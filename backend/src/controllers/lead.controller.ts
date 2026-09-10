import { Request, Response, NextFunction } from 'express';
import { LeadService } from '../services/lead.service';
import { sendSuccess, sendError } from '../utils/response';
import { getPagination } from '../utils/pagination';
import { z } from 'zod';

export const createLeadSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  companyName: z.string().min(1),
  industry: z.string().optional(),
  jobTitle: z.string().optional(),
  companySize: z.string().optional(),
  location: z.string().optional(),
  source: z.string().optional(),
  budget: z.number().optional(),
  expectedDealValue: z.number().optional(),
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'DEMO', 'NEGOTIATION', 'CONVERTED', 'LOST']).optional(),
  notes: z.string().optional()
});

export class LeadController {
  static async getLeads(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = getPagination(req);
      const filters = {
        search: req.query.search as string,
        status: req.query.status as string,
        source: req.query.source as string,
        priority: req.query.priority as string,
        minScore: req.query.minScore ? Number(req.query.minScore) : undefined,
        maxScore: req.query.maxScore ? Number(req.query.maxScore) : undefined,
        assignedTo: req.query.assignedTo as string,
        sort: req.query.sort as string
      };

      const result = await LeadService.getLeads(req.user!.organizationId, filters, pagination);
      return sendSuccess(res, result.leads, 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  static async getLeadById(req: Request, res: Response, next: NextFunction) {
    try {
      const leadId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const lead = await LeadService.getLeadById(leadId, req.user!.organizationId);
      if (!lead) return sendError(res, 'LEAD_NOT_FOUND', 'Lead not found.', 404);
      return sendSuccess(res, lead);
    } catch (error) {
      next(error);
    }
  }

  static async createLead(req: Request, res: Response, next: NextFunction) {
    try {
      const lead = await LeadService.createLead(req.user!.organizationId, req.body, req.user!.userId);
      return sendSuccess(res, lead, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateLead(req: Request, res: Response, next: NextFunction) {
    try {
      const leadId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const lead = await LeadService.updateLead(
        leadId,
        req.user!.organizationId,
        req.body,
        req.user!.userId
      );
      return sendSuccess(res, lead);
    } catch (error) {
      next(error);
    }
  }

  static async deleteLead(req: Request, res: Response, next: NextFunction) {
    try {
      const leadId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const success = await LeadService.deleteLead(leadId, req.user!.organizationId, req.user!.userId);
      if (!success) return sendError(res, 'LEAD_NOT_FOUND', 'Lead not found or already deleted.', 404);
      return sendSuccess(res, { message: 'Lead deleted successfully.' });
    } catch (error) {
      next(error);
    }
  }

  static async bulkCreate(req: Request, res: Response, next: NextFunction) {
    try {
      const { leads } = req.body;
      if (!Array.isArray(leads)) {
        return sendError(res, 'INVALID_INPUT', 'Body must contain an array of leads.', 400);
      }
      const created = await Promise.all(
        leads.map((l) => LeadService.createLead(req.user!.organizationId, l, req.user!.userId))
      );
      return sendSuccess(res, { count: created.length, leads: created }, 201);
    } catch (error) {
      next(error);
    }
  }

  static async getPrioritized(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 25;
      const leads = await LeadService.getPrioritizedLeads(req.user!.organizationId, limit);
      return sendSuccess(res, leads);
    } catch (error) {
      next(error);
    }
  }

  static async getHot(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 25;
      const leads = await LeadService.getHotLeads(req.user!.organizationId, limit);
      return sendSuccess(res, leads);
    } catch (error) {
      next(error);
    }
  }

  static async getAtRisk(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 25;
      const leads = await LeadService.getAtRiskLeads(req.user!.organizationId, limit);
      return sendSuccess(res, leads);
    } catch (error) {
      next(error);
    }
  }

  static async getRisingIntent(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 25;
      const leads = await LeadService.getRisingIntentLeads(req.user!.organizationId, limit);
      return sendSuccess(res, leads);
    } catch (error) {
      next(error);
    }
  }
}
