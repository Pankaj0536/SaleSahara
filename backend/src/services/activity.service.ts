import { LeadActivity, ILeadActivity, ActivityType } from '../models/LeadActivity';
import { Lead } from '../models/Lead';
import { calculateEngagementScore } from '../utils/scoring';
import { Types } from 'mongoose';

export interface CreateActivityInput {
  organizationId: string;
  leadId: string;
  type: ActivityType;
  timestamp?: Date;
  metadata?: Record<string, any>;
}

export class ActivityService {
  static async createActivity(input: CreateActivityInput): Promise<{
    activity: ILeadActivity;
    lead: any;
  }> {
    const lead = await Lead.findOne({
      _id: input.leadId,
      organizationId: input.organizationId
    });

    if (!lead) {
      const err: any = new Error('Lead not found.');
      err.code = 'LEAD_NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }

    const activityTime = input.timestamp ? new Date(input.timestamp) : new Date();

    const activity = await LeadActivity.create({
      organizationId: new Types.ObjectId(input.organizationId),
      leadId: new Types.ObjectId(input.leadId),
      type: input.type,
      timestamp: activityTime,
      metadata: input.metadata || {}
    });

    // Fetch all activities for this lead to re-evaluate engagement score & trend
    const allActivities = await LeadActivity.find({
      organizationId: input.organizationId,
      leadId: input.leadId
    }).sort({ timestamp: -1 });

    const { score, trend } = calculateEngagementScore(allActivities, activityTime);

    lead.engagementScore = score;
    lead.engagementTrend = trend;
    if (!lead.lastActivityAt || activityTime > lead.lastActivityAt) {
      lead.lastActivityAt = activityTime;
    }
    await lead.save();

    return { activity, lead };
  }

  static async getLeadActivities(
    organizationId: string,
    leadId: string,
    limit: number = 50
  ): Promise<any[]> {
    return LeadActivity.find({
      organizationId,
      leadId
    })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();
  }

  static async getTimeline(organizationId: string, leadId: string): Promise<any[]> {
    const activities = await LeadActivity.find({
      organizationId,
      leadId
    })
      .sort({ timestamp: 1 })
      .lean();

    return activities.map((act) => ({
      id: act._id,
      type: act.type,
      timestamp: act.timestamp,
      metadata: act.metadata
    }));
  }
}
