import { ILead } from '../models/Lead';
import { ILeadActivity } from '../models/LeadActivity';

export interface EngineeredFeatures {
  // Basic
  budget: number;
  expectedDealValue: number;
  companySize: string;
  industry: string;
  source: string;

  // Engagement Counts
  websiteVisits: number;
  pricingVisits: number;
  productVisits: number;
  emailOpens: number;
  emailClicks: number;
  emailReplies: number;
  demoRequests: number;
  calls: number;
  meetings: number;
  documentDownloads: number;

  // Temporal
  daysSinceFirstActivity: number;
  daysSinceLastActivity: number;
  activityFrequency: number;
  engagementVelocity: number;

  // Behavioral
  highIntentActions: number;
  recentActivityCount: number;
  pricingToDemoRatio: number;
  emailResponseRate: number;
  engagementTrend: string;
  engagementScore: number;

  // Raw sequence for LSTM
  activitySequence: string[];
}

export class FeatureService {
  static extractFeatures(lead: ILead, activities: ILeadActivity[], referenceDate: Date = new Date()): EngineeredFeatures {
    const nowMs = referenceDate.getTime();

    let websiteVisits = 0;
    let pricingVisits = 0;
    let productVisits = 0;
    let emailOpens = 0;
    let emailClicks = 0;
    let emailReplies = 0;
    let demoRequests = 0;
    let calls = 0;
    let meetings = 0;
    let documentDownloads = 0;

    let recentActivityCount = 0; // last 7 days
    let earliestTimeMs = nowMs;
    let latestTimeMs = 0;

    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const sortedActivities = [...activities].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const activitySequence: string[] = [];

    for (const act of sortedActivities) {
      const actTime = new Date(act.timestamp).getTime();
      if (actTime < earliestTimeMs) earliestTimeMs = actTime;
      if (actTime > latestTimeMs) latestTimeMs = actTime;

      activitySequence.push(act.type);

      if (nowMs - actTime <= sevenDaysMs) {
        recentActivityCount++;
      }

      switch (act.type) {
        case 'website_visit':
          websiteVisits++;
          break;
        case 'pricing_visit':
          pricingVisits++;
          break;
        case 'product_visit':
          productVisits++;
          break;
        case 'email_open':
          emailOpens++;
          break;
        case 'email_click':
          emailClicks++;
          break;
        case 'email_reply':
          emailReplies++;
          break;
        case 'demo_request':
          demoRequests++;
          break;
        case 'phone_call':
          calls++;
          break;
        case 'meeting':
          meetings++;
          break;
        case 'document_download':
          documentDownloads++;
          break;
      }
    }

    const totalActivities = activities.length;
    const daysSinceFirstActivity =
      totalActivities > 0
        ? Math.max(0, parseFloat(((nowMs - earliestTimeMs) / (1000 * 60 * 60 * 24)).toFixed(1)))
        : 0;

    const daysSinceLastActivity =
      totalActivities > 0
        ? Math.max(0, parseFloat(((nowMs - latestTimeMs) / (1000 * 60 * 60 * 24)).toFixed(1)))
        : 30;

    const activityFrequency =
      daysSinceFirstActivity > 0 ? parseFloat((totalActivities / daysSinceFirstActivity).toFixed(3)) : totalActivities;

    const engagementVelocity = parseFloat((recentActivityCount / 7).toFixed(3));

    const highIntentActions = demoRequests * 3 + pricingVisits * 2 + meetings * 3;

    const pricingToDemoRatio =
      pricingVisits > 0 ? parseFloat((demoRequests / pricingVisits).toFixed(2)) : demoRequests > 0 ? 1 : 0;

    const emailResponseRate =
      emailOpens > 0 ? parseFloat((emailReplies / emailOpens).toFixed(2)) : 0;

    return {
      budget: lead.budget || 0,
      expectedDealValue: lead.expectedDealValue || 0,
      companySize: lead.companySize || '10-50',
      industry: lead.industry || 'Technology',
      source: lead.source || 'website',
      websiteVisits,
      pricingVisits,
      productVisits,
      emailOpens,
      emailClicks,
      emailReplies,
      demoRequests,
      calls,
      meetings,
      documentDownloads,
      daysSinceFirstActivity,
      daysSinceLastActivity,
      activityFrequency,
      engagementVelocity,
      highIntentActions,
      recentActivityCount,
      pricingToDemoRatio,
      emailResponseRate,
      engagementTrend: lead.engagementTrend || 'stable',
      engagementScore: lead.engagementScore || 0,
      activitySequence
    };
  }
}
