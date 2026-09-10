import { Request, Response, NextFunction } from 'express';
import { ActivityService } from '../services/activity.service';
import { sendSuccess } from '../utils/response';
import { z } from 'zod';

export const createActivitySchema = z.object({
  type: z.enum([
    'website_visit',
    'pricing_visit',
    'product_visit',
    'email_open',
    'email_click',
    'email_reply',
    'demo_request',
    'form_submission',
    'phone_call',
    'meeting',
    'document_download',
    'whatsapp_click'
  ]),
  timestamp: z.string().or(z.date()).optional(),
  metadata: z.record(z.any()).optional()
});

export class ActivityController {
  static async createActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const leadId = Array.isArray(req.params.leadId) ? req.params.leadId[0] : req.params.leadId;
      const result = await ActivityService.createActivity({
        organizationId: req.user!.organizationId,
        leadId,
        type: req.body.type,
        timestamp: req.body.timestamp ? new Date(req.body.timestamp) : undefined,
        metadata: req.body.metadata
      });
      return sendSuccess(res, result, 201);
    } catch (error) {
      next(error);
    }
  }

  static async getLeadActivities(req: Request, res: Response, next: NextFunction) {
    try {
      const leadId = Array.isArray(req.params.leadId) ? req.params.leadId[0] : req.params.leadId;
      const limit = parseInt(req.query.limit as string, 10) || 50;
      const activities = await ActivityService.getLeadActivities(
        req.user!.organizationId,
        leadId,
        limit
      );
      return sendSuccess(res, activities);
    } catch (error) {
      next(error);
    }
  }

  static async getTimeline(req: Request, res: Response, next: NextFunction) {
    try {
      const leadId = Array.isArray(req.params.leadId) ? req.params.leadId[0] : req.params.leadId;
      const timeline = await ActivityService.getTimeline(
        req.user!.organizationId,
        leadId
      );
      return sendSuccess(res, timeline);
    } catch (error) {
      next(error);
    }
  }
}
