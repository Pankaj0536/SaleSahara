import { LeadPriority } from '../models/Lead';
import { ILeadActivity, ActivityType } from '../models/LeadActivity';

export const calculateScoreAndPriority = (
  probability: number
): { score: number; priority: LeadPriority; confidence: 'HIGH' | 'MEDIUM' | 'LOW' } => {
  const boundedProb = Math.max(0, Math.min(1, probability));
  const score = Math.round(boundedProb * 100);

  let priority: LeadPriority;
  if (score >= 80) {
    priority = 'HOT';
  } else if (score >= 60) {
    priority = 'HIGH';
  } else if (score >= 40) {
    priority = 'MEDIUM';
  } else {
    priority = 'LOW';
  }

  // Confidence estimation based on distance from decision boundary (0.5)
  const distance = Math.abs(boundedProb - 0.5);
  let confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  if (distance >= 0.28) {
    confidence = 'HIGH';
  } else if (distance >= 0.12) {
    confidence = 'MEDIUM';
  } else {
    confidence = 'LOW';
  }

  return { score, priority, confidence };
};

export const ACTIVITY_WEIGHTS: Record<ActivityType, number> = {
  website_visit: 2,
  pricing_visit: 6,
  product_visit: 3,
  email_open: 2,
  email_click: 4,
  email_reply: 8,
  demo_request: 15,
  form_submission: 10,
  phone_call: 7,
  meeting: 12,
  document_download: 5,
  whatsapp_click: 5
};

export const calculateEngagementScore = (
  activities: ILeadActivity[],
  referenceDate: Date = new Date()
): { score: number; trend: 'rising' | 'stable' | 'declining' } => {
  if (!activities || activities.length === 0) {
    return { score: 0, trend: 'stable' };
  }

  let totalScore = 0;
  let recentScore = 0; // last 7 days
  let priorScore = 0;  // 8 to 30 days

  const nowMs = referenceDate.getTime();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  for (const act of activities) {
    const actTime = new Date(act.timestamp).getTime();
    const diffMs = Math.max(0, nowMs - actTime);
    const daysAgo = diffMs / (1000 * 60 * 60 * 24);

    const baseWeight = ACTIVITY_WEIGHTS[act.type] || 2;
    // Exponential decay with half-life around 14 days
    const decay = Math.exp(-0.05 * daysAgo);
    const weightedScore = baseWeight * decay;

    totalScore += weightedScore;

    if (diffMs <= sevenDaysMs) {
      recentScore += weightedScore;
    } else if (diffMs <= thirtyDaysMs) {
      priorScore += weightedScore;
    }
  }

  // Normalized score capped at 100
  const normalizedScore = Math.min(100, Math.round(totalScore));

  // Trend detection
  const recentRate = recentScore / 7;
  const priorRate = priorScore / 23;

  let trend: 'rising' | 'stable' | 'declining' = 'stable';
  if (recentRate > priorRate * 1.3 && recentScore > 2) {
    trend = 'rising';
  } else if (recentRate < priorRate * 0.6 && priorScore > 5) {
    trend = 'declining';
  }

  return {
    score: normalizedScore,
    trend
  };
};
