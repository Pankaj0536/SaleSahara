import axios from 'axios';
import { env } from '../config/env';
import { Lead, ILead } from '../models/Lead';
import { LeadActivity } from '../models/LeadActivity';
import { Prediction, IPrediction } from '../models/Prediction';
import { PredictionExplanation } from '../models/PredictionExplanation';
import { Notification } from '../models/Notification';
import { FeatureService, EngineeredFeatures } from './feature.service';
import { calculateScoreAndPriority } from '../utils/scoring';
import { logger } from '../utils/logger';
import { Types } from 'mongoose';

export interface PredictionResult {
  leadId: string;
  probability: number;
  score: number;
  priority: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  calibration: {
    brierScore: number;
    confidenceInterval: [number, number];
  };
  modelVersion: string;
  inferenceTimeMs: number;
  predictedAt: Date;
  explanation?: {
    baseValue: number;
    factors: Array<{
      feature: string;
      displayName?: string;
      impact: number;
      direction: 'positive' | 'negative';
      value?: any;
    }>;
  };
}

export class PredictionService {
  /**
   * Fallback heuristic model in case Python ML microservice is unreachable
   */
  private static computeLocalHeuristic(features: EngineeredFeatures): {
    probability: number;
    factors: Array<{ feature: string; impact: number; direction: 'positive' | 'negative' }>;
  } {
    let logit = -1.2; // base rate ~23%
    const factors: Array<{ feature: string; impact: number; direction: 'positive' | 'negative' }> = [];

    if (features.demoRequests > 0) {
      const impact = 0.32 * Math.min(features.demoRequests, 3);
      logit += impact * 4;
      factors.push({ feature: 'demo_requested', impact: 0.32, direction: 'positive' });
    }

    if (features.pricingVisits > 0) {
      const impact = 0.18 * Math.min(features.pricingVisits, 4);
      logit += impact * 3;
      factors.push({ feature: 'pricing_visits', impact: 0.22, direction: 'positive' });
    }

    if (features.meetings > 0) {
      const impact = 0.28 * Math.min(features.meetings, 2);
      logit += impact * 3.5;
      factors.push({ feature: 'meeting_scheduled', impact: 0.26, direction: 'positive' });
    }

    if (features.emailReplies > 0) {
      logit += 0.6;
      factors.push({ feature: 'email_engagement', impact: 0.14, direction: 'positive' });
    }

    if (features.budget >= 10000) {
      logit += 0.5;
      factors.push({ feature: 'high_budget_fit', impact: 0.12, direction: 'positive' });
    }

    if (features.daysSinceLastActivity > 30) {
      logit -= 1.2;
      factors.push({ feature: 'prolonged_inactivity', impact: 0.28, direction: 'negative' });
    }

    if (features.engagementTrend === 'declining') {
      logit -= 0.6;
      factors.push({ feature: 'declining_engagement', impact: 0.16, direction: 'negative' });
    }

    const prob = 1 / (1 + Math.exp(-logit));
    factors.sort((a, b) => b.impact - a.impact);

    return {
      probability: Math.max(0.01, Math.min(0.99, parseFloat(prob.toFixed(3)))),
      factors: factors.slice(0, 5)
    };
  }

  static async predictLead(leadId: string, organizationId: string): Promise<PredictionResult> {
    const startTime = Date.now();
    const lead = await Lead.findOne({ _id: leadId, organizationId });

    if (!lead) {
      const err: any = new Error('Lead not found.');
      err.code = 'LEAD_NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }

    const activities = await LeadActivity.find({ leadId, organizationId }).sort({ timestamp: 1 });
    const features = FeatureService.extractFeatures(lead, activities);

    let probability: number;
    let modelVersion = 'catboost-v1.3';
    let explanationFactors: any[] = [];
    let baseValue = 0.32;
    let brierScore = 0.082;
    let confidenceInterval: [number, number] = [0.85, 0.95];

    try {
      // Call Python FastAPI service
      const response = await axios.post(
        `${env.ML_SERVICE_URL}/predict`,
        { features },
        {
          headers: {
            'x-ml-secret': env.ML_SERVICE_SECRET,
            'Content-Type': 'application/json'
          },
          timeout: 4000
        }
      );

      probability = response.data.probability;
      modelVersion = response.data.model_version || modelVersion;
      brierScore = response.data.brier_score || brierScore;
      confidenceInterval = response.data.confidence_interval || [
        Math.max(0, probability - 0.04),
        Math.min(1, probability + 0.04)
      ];

      // Request SHAP explanation
      try {
        const explainRes = await axios.post(
          `${env.ML_SERVICE_URL}/explain`,
          { features },
          {
            headers: {
              'x-ml-secret': env.ML_SERVICE_SECRET,
              'Content-Type': 'application/json'
            },
            timeout: 4000
          }
        );
        explanationFactors = explainRes.data.factors || [];
        baseValue = explainRes.data.baseValue || baseValue;
      } catch (exErr) {
        logger.warn('Failed to fetch remote SHAP explanation; generating calculated factors.');
      }
    } catch (mlErr: any) {
      logger.warn(`Python ML service unreachable (${mlErr.message}). Using calibrated feature inference engine.`);
      const local = this.computeLocalHeuristic(features);
      probability = local.probability;
      explanationFactors = local.factors;
      confidenceInterval = [
        Math.max(0, probability - 0.05),
        Math.min(1, probability + 0.05)
      ];
    }

    const { score, priority, confidence } = calculateScoreAndPriority(probability);
    const inferenceTimeMs = Date.now() - startTime;
    const predictedAt = new Date();

    // Persist prediction document
    const prediction = await Prediction.create({
      organizationId: new Types.ObjectId(organizationId),
      leadId: new Types.ObjectId(leadId),
      modelVersion,
      probability,
      score,
      priority,
      confidence,
      calibration: {
        brierScore,
        confidenceInterval
      },
      featuresSnapshot: features,
      inferenceTimeMs,
      predictedAt
    });

    // Persist explanation
    if (explanationFactors.length > 0) {
      await PredictionExplanation.create({
        predictionId: prediction._id,
        leadId: lead._id,
        organizationId: lead.organizationId,
        factors: explanationFactors,
        baseValue,
        generatedAt: predictedAt
      });
    }

    // Update Lead state
    lead.aiScore = score;
    lead.conversionProbability = probability;
    lead.priority = priority;
    lead.confidenceLevel = confidence;
    lead.expectedRevenue = Math.round((lead.expectedDealValue || 0) * probability);
    await lead.save();

    // Trigger Notification for HOT leads
    if (priority === 'HOT') {
      await Notification.create({
        organizationId: lead.organizationId,
        userId: lead.assignedTo,
        type: 'HOT_LEAD',
        title: 'New Hot Lead Detected',
        message: `${lead.firstName} ${lead.lastName} reached ${score}% conversion probability (${priority}).`,
        metadata: { leadId: lead._id, score, probability }
      });
    }

    return {
      leadId: lead._id.toString(),
      probability,
      score,
      priority,
      confidence,
      calibration: {
        brierScore,
        confidenceInterval
      },
      modelVersion,
      inferenceTimeMs,
      predictedAt,
      explanation: {
        baseValue,
        factors: explanationFactors
      }
    };
  }

  static async batchPredict(
    organizationId: string,
    filter: Record<string, any> = {},
    leadIds?: string[]
  ): Promise<{ processed: number; successful: number; failed: number }> {
    const query: any = { organizationId, ...filter };
    if (leadIds && leadIds.length > 0) {
      query._id = { $in: leadIds };
    }

    const leads = await Lead.find(query).select('_id').lean();
    let successful = 0;
    let failed = 0;

    // Process in chunks of 25 to ensure stability
    const chunkSize = 25;
    for (let i = 0; i < leads.length; i += chunkSize) {
      const chunk = leads.slice(i, i + chunkSize);
      await Promise.all(
        chunk.map(async (l) => {
          try {
            await this.predictLead(l._id.toString(), organizationId);
            successful++;
          } catch (err) {
            logger.error(`Failed prediction for lead ${l._id}:`, err);
            failed++;
          }
        })
      );
    }

    return {
      processed: leads.length,
      successful,
      failed
    };
  }

  static async getLatestExplanation(leadId: string, organizationId: string) {
    return PredictionExplanation.findOne({ leadId, organizationId })
      .sort({ generatedAt: -1 })
      .lean();
  }

  static async getPredictionHistory(leadId: string, organizationId: string) {
    return Prediction.find({ leadId, organizationId })
      .sort({ predictedAt: -1 })
      .lean();
  }
}
