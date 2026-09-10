import { Request, Response, NextFunction } from 'express';
import { AIService } from '../services/ai.service';
import { sendSuccess, sendError } from '../utils/response';
import { z } from 'zod';

export const generateMessageSchema = z.object({
  leadId: z.string().min(1),
  tone: z.enum(['professional', 'friendly', 'concise', 'urgent']).optional(),
  actionId: z.string().optional()
});

export class AIController {
  static async getNextBestAction(req: Request, res: Response, next: NextFunction) {
    try {
      const leadId = Array.isArray(req.params.leadId) ? req.params.leadId[0] : req.params.leadId;
      const action = await AIService.determineNextBestAction(
        leadId,
        req.user!.organizationId
      );
      return sendSuccess(res, action);
    } catch (error) {
      next(error);
    }
  }

  static async generateMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { leadId, tone, actionId } = req.body;
      const message = await AIService.generateSalesMessage(
        leadId,
        req.user!.organizationId,
        tone || 'professional',
        actionId,
        req.user?.userId
      );
      return sendSuccess(res, message, 201);
    } catch (error) {
      next(error);
    }
  }

  static async regenerateMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { leadId, tone, actionId } = req.body;
      const message = await AIService.generateSalesMessage(
        leadId,
        req.user!.organizationId,
        tone || 'friendly',
        actionId,
        req.user?.userId
      );
      return sendSuccess(res, message);
    } catch (error) {
      next(error);
    }
  }

  static async shortenMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { content } = req.body;
      if (!content) return sendError(res, 'CONTENT_REQUIRED', 'Message content is required.', 400);
      const shortened = await AIService.shortenMessage(content);
      return sendSuccess(res, { shortened });
    } catch (error) {
      next(error);
    }
  }
}
