import { Lead, ILead, LeadStatus } from '../models/Lead';
import { Prediction } from '../models/Prediction';
import { ModelMetric } from '../models/ModelMetric';
import { AuditLog } from '../models/AuditLog';
import { Types } from 'mongoose';
import { PaginationOptions, buildPaginationMetadata } from '../utils/pagination';

export interface LeadFilterQuery {
  search?: string;
  status?: string;
  source?: string;
  priority?: string;
  minScore?: number;
  maxScore?: number;
  assignedTo?: string;
  sort?: string;
}

export class LeadService {
  static async getLeads(
    organizationId: string,
    filters: LeadFilterQuery,
    pagination: PaginationOptions
  ) {
    const query: any = { organizationId: new Types.ObjectId(organizationId) };

    if (filters.search) {
      const regex = new RegExp(filters.search, 'i');
      query.$or = [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { companyName: regex }
      ];
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.source) {
      query.source = filters.source;
    }

    if (filters.priority) {
      query.priority = filters.priority;
    }

    if (filters.minScore !== undefined || filters.maxScore !== undefined) {
      query.aiScore = {};
      if (filters.minScore !== undefined) query.aiScore.$gte = Number(filters.minScore);
      if (filters.maxScore !== undefined) query.aiScore.$lte = Number(filters.maxScore);
    }

    if (filters.assignedTo) {
      query.assignedTo = new Types.ObjectId(filters.assignedTo);
    }

    let sortOption: any = { createdAt: -1 };
    if (filters.sort) {
      const isDesc = filters.sort.startsWith('-');
      const field = isDesc ? filters.sort.substring(1) : filters.sort;
      sortOption = { [field]: isDesc ? -1 : 1 };
    }

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .sort(sortOption)
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      Lead.countDocuments(query)
    ]);

    return {
      leads,
      pagination: buildPaginationMetadata(total, pagination.page, pagination.limit)
    };
  }

  static async getLeadById(leadId: string, organizationId: string) {
    return Lead.findOne({ _id: leadId, organizationId }).lean();
  }

  static async createLead(organizationId: string, data: Partial<ILead>, userId?: string) {
    const lead = await Lead.create({
      ...data,
      organizationId: new Types.ObjectId(organizationId)
    });

    await AuditLog.create({
      organizationId: new Types.ObjectId(organizationId),
      userId: userId ? new Types.ObjectId(userId) : undefined,
      action: 'CREATE_LEAD',
      entity: 'lead',
      entityId: lead._id.toString(),
      metadata: { email: lead.email, companyName: lead.companyName }
    });

    return lead;
  }

  static async updateLead(
    leadId: string,
    organizationId: string,
    updateData: Partial<ILead>,
    userId?: string
  ) {
    const lead = await Lead.findOne({ _id: leadId, organizationId });
    if (!lead) {
      const err: any = new Error('Lead not found.');
      err.code = 'LEAD_NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }

    const previousStatus = lead.status;
    Object.assign(lead, updateData);

    // Continuous learning loop: link actual outcome to latest prediction
    if (
      (lead.status === 'CONVERTED' || lead.status === 'LOST') &&
      lead.status !== previousStatus
    ) {
      lead.actualOutcome = lead.status;
      lead.outcomeRecordedAt = new Date();

      const latestPrediction = await Prediction.findOne({
        leadId: lead._id,
        organizationId: lead.organizationId
      }).sort({ predictedAt: -1 });

      if (latestPrediction) {
        const actualBinary = lead.status === 'CONVERTED' ? 1 : 0;
        const brierLoss = Math.pow(latestPrediction.probability - actualBinary, 2);
        const isCorrect =
          (latestPrediction.probability >= 0.5 && actualBinary === 1) ||
          (latestPrediction.probability < 0.5 && actualBinary === 0);

        let bucket: '0-39' | '40-59' | '60-79' | '80-100' = '0-39';
        if (latestPrediction.score >= 80) bucket = '80-100';
        else if (latestPrediction.score >= 60) bucket = '60-79';
        else if (latestPrediction.score >= 40) bucket = '40-59';

        await ModelMetric.create({
          organizationId: lead.organizationId,
          leadId: lead._id,
          predictionId: latestPrediction._id,
          modelVersion: latestPrediction.modelVersion,
          predictedProbability: latestPrediction.probability,
          predictedScore: latestPrediction.score,
          predictedPriority: latestPrediction.priority,
          actualOutcome: lead.status,
          brierLoss: parseFloat(brierLoss.toFixed(4)),
          isCorrect,
          scoreBucket: bucket,
          resolvedAt: new Date()
        });
      }
    }

    await lead.save();

    await AuditLog.create({
      organizationId: new Types.ObjectId(organizationId),
      userId: userId ? new Types.ObjectId(userId) : undefined,
      action: 'UPDATE_LEAD',
      entity: 'lead',
      entityId: lead._id.toString(),
      metadata: { changedFields: Object.keys(updateData) }
    });

    return lead;
  }

  static async deleteLead(leadId: string, organizationId: string, userId?: string) {
    const result = await Lead.deleteOne({ _id: leadId, organizationId });
    if (result.deletedCount > 0) {
      await AuditLog.create({
        organizationId: new Types.ObjectId(organizationId),
        userId: userId ? new Types.ObjectId(userId) : undefined,
        action: 'DELETE_LEAD',
        entity: 'lead',
        entityId: leadId
      });
    }
    return result.deletedCount > 0;
  }

  static async getPrioritizedLeads(organizationId: string, limit: number = 25) {
    return Lead.find({
      organizationId: new Types.ObjectId(organizationId),
      status: { $nin: ['CONVERTED', 'LOST'] }
    })
      .sort({ aiScore: -1, expectedDealValue: -1 })
      .limit(limit)
      .lean();
  }

  static async getHotLeads(organizationId: string, limit: number = 25) {
    return Lead.find({
      organizationId: new Types.ObjectId(organizationId),
      priority: 'HOT',
      status: { $nin: ['CONVERTED', 'LOST'] }
    })
      .sort({ aiScore: -1 })
      .limit(limit)
      .lean();
  }

  static async getAtRiskLeads(organizationId: string, limit: number = 25) {
    return Lead.find({
      organizationId: new Types.ObjectId(organizationId),
      aiScore: { $gte: 50 },
      engagementTrend: 'declining',
      status: { $nin: ['CONVERTED', 'LOST'] }
    })
      .sort({ aiScore: -1 })
      .limit(limit)
      .lean();
  }

  static async getRisingIntentLeads(organizationId: string, limit: number = 25) {
    return Lead.find({
      organizationId: new Types.ObjectId(organizationId),
      engagementTrend: 'rising',
      status: { $nin: ['CONVERTED', 'LOST'] }
    })
      .sort({ engagementScore: -1 })
      .limit(limit)
      .lean();
  }
}
