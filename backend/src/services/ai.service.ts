import axios from 'axios';
import { env } from '../config/env';
import { Lead } from '../models/Lead';
import { LeadActivity } from '../models/LeadActivity';
import { NextBestAction, INextBestAction } from '../models/NextBestAction';
import { AIMessage, MessageTone } from '../models/AIMessage';
import { PredictionExplanation } from '../models/PredictionExplanation';
import { FeatureService } from './feature.service';
import { logger } from '../utils/logger';
import { Types } from 'mongoose';

export class AIService {
  static async determineNextBestAction(leadId: string, organizationId: string): Promise<INextBestAction> {
    const lead = await Lead.findOne({ _id: leadId, organizationId });
    if (!lead) {
      const err: any = new Error('Lead not found.');
      err.code = 'LEAD_NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }

    const activities = await LeadActivity.find({ leadId, organizationId }).sort({ timestamp: -1 });
    const features = FeatureService.extractFeatures(lead, activities);

    let action = 'Send educational product case study and industry benchmark report';
    let channel = 'email';
    let reason = 'Nurture intent through relevant peer validation';
    let confidence = 0.75;

    if (lead.aiScore >= 85 && features.demoRequests > 0) {
      action = 'Contact within 2 hours to confirm requirements and schedule solution demo';
      channel = 'phone';
      reason = 'Extremely high purchase intent detected immediately following demo request';
      confidence = 0.95;
    } else if (lead.aiScore >= 80 && lead.engagementTrend === 'declining') {
      action = 'Re-engage lead with tailored ROI calculator and exclusive trial offer';
      channel = 'email';
      reason = 'High conversion potential at risk due to declining recent engagement velocity';
      confidence = 0.91;
    } else if ((lead.expectedDealValue || 0) >= 50000 && features.daysSinceLastActivity >= 1) {
      action = 'Schedule executive sync with Solutions Architect';
      channel = 'meeting';
      reason = 'Enterprise tier deal value warrants high-touch executive engagement';
      confidence = 0.89;
    } else if (features.pricingVisits >= 2 && features.demoRequests === 0) {
      action = 'Send transparent pricing overview and offer custom volume tier discount';
      channel = 'email';
      reason = 'Repeated pricing page visits indicate active commercial evaluation';
      confidence = 0.86;
    } else if (lead.status === 'NEW' && features.websiteVisits >= 3) {
      action = 'Send personalized welcome message highlighting relevant industry features';
      channel = 'email';
      reason = 'Frequent exploratory browsing shows strong nascent curiosity';
      confidence = 0.82;
    }

    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h validity

    const nba = await NextBestAction.create({
      leadId: new Types.ObjectId(leadId),
      organizationId: new Types.ObjectId(organizationId),
      action,
      channel,
      reason,
      confidence,
      generatedBy: 'rule',
      status: 'pending',
      expiresAt
    });

    return nba;
  }

  static async generateSalesMessage(
    leadId: string,
    organizationId: string,
    tone: MessageTone = 'professional',
    actionId?: string,
    userId?: string
  ): Promise<any> {
    const lead = await Lead.findOne({ _id: leadId, organizationId });
    if (!lead) {
      const err: any = new Error('Lead not found.');
      err.code = 'LEAD_NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }

    const explanation = await PredictionExplanation.findOne({ leadId, organizationId }).sort({ generatedAt: -1 });
    const topPositiveFactors = explanation?.factors
      ?.filter((f) => f.direction === 'positive')
      ?.map((f) => f.feature)
      ?.slice(0, 3) || ['active solution evaluation', 'pricing exploration'];

    // Template generator based on tone & lead context
    let content = '';

    if (tone === 'professional') {
      content = `Hi ${lead.firstName},\n\nI noticed your recent interest in our enterprise platform at ${lead.companyName}, particularly regarding our ${lead.industry} capabilities. Given your current evaluation and positive indicators around ${topPositiveFactors.join(' and ')}, I'd welcome the opportunity to share a tailored overview that aligns with your team's objectives.\n\nWould you have 15 minutes this Thursday or Friday for a brief introduction?\n\nBest regards,\nSales Intelligence Team`;
    } else if (tone === 'friendly') {
      content = `Hey ${lead.firstName}!\n\nHope your week is going great. Saw you were checking out how we help teams in ${lead.industry} scale. Based on your activity around ${topPositiveFactors[0] || 'our platform'}, I thought you'd love a quick peek under the hood tailored specifically for ${lead.companyName}.\n\nLet me know if you'd like to grab a virtual coffee sometime this week!\n\nCheers,\nSales Intelligence Team`;
    } else if (tone === 'concise') {
      content = `Hi ${lead.firstName} — Following up on your interest in LeadIQ for ${lead.companyName}. We have specific benchmarks for ${lead.industry} teams evaluating solutions like ours. Are you open to a 10-minute briefing this week?\n\nBest,\nSales Intelligence Team`;
    } else {
      // Urgent
      content = `Hi ${lead.firstName},\n\nWith end-of-quarter incentives currently available for ${lead.companyName}, I wanted to reach out directly regarding your evaluation. We can fast-track onboarding and lock in custom tier pricing if we connect in the next 48 hours.\n\nAre you available today or tomorrow morning for a quick alignment call?\n\nBest,\nSales Intelligence Team`;
    }

    // If an external LLM API key is present, optionally augment message
    if (env.LLM_API_KEY) {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are an expert sales intelligence assistant. Generate an outreach message strictly adhering to tone: ${tone}. Never mention AI scores directly.`
              },
              {
                role: 'user',
                content: `Lead: ${lead.firstName} ${lead.lastName}, Company: ${lead.companyName}, Industry: ${lead.industry}, Top signals: ${topPositiveFactors.join(', ')}.`
              }
            ],
            temperature: 0.7,
            max_tokens: 300
          },
          {
            headers: {
              Authorization: `Bearer ${env.LLM_API_KEY}`,
              'Content-Type': 'application/json'
            },
            timeout: 5000
          }
        );
        const llmContent = response.data?.choices?.[0]?.message?.content;
        if (llmContent) {
          content = llmContent;
        }
      } catch (err: any) {
        logger.warn(`External LLM generation failed (${err.message}); utilizing calibrated deterministic template.`);
      }
    }

    const aiMessage = await AIMessage.create({
      organizationId: new Types.ObjectId(organizationId),
      leadId: new Types.ObjectId(leadId),
      actionId: actionId ? new Types.ObjectId(actionId) : undefined,
      content,
      tone,
      generatedAt: new Date(),
      createdBy: userId ? new Types.ObjectId(userId) : undefined
    });

    return aiMessage;
  }

  static async shortenMessage(content: string): Promise<string> {
    const lines = content.split('\n').filter((l) => l.trim().length > 0);
    if (lines.length <= 2) return content;
    // Return first hook and closing call to action
    return `${lines[0]}\n\n${lines[1]}\n\nWould you have 10 minutes this week for a brief conversation?\n\nBest regards,`;
  }
}
