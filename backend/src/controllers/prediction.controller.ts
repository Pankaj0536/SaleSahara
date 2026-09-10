import { Request, Response, NextFunction } from 'express';
import { PredictionService } from '../services/prediction.service';
import { sendSuccess, sendError } from '../utils/response';

export class PredictionController {
  static async predictLead(req: Request, res: Response, next: NextFunction) {
    try {
      const leadId = Array.isArray(req.params.leadId) ? req.params.leadId[0] : req.params.leadId;
      const result = await PredictionService.predictLead(leadId, req.user!.organizationId);
      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async batchPredict(req: Request, res: Response, next: NextFunction) {
    try {
      const { leadIds, filter } = req.body;
      const result = await PredictionService.batchPredict(
        req.user!.organizationId,
        filter || {},
        leadIds
      );
      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async getExplanation(req: Request, res: Response, next: NextFunction) {
    try {
      const leadId = Array.isArray(req.params.leadId) ? req.params.leadId[0] : req.params.leadId;
      const explanation = await PredictionService.getLatestExplanation(
        leadId,
        req.user!.organizationId
      );
      if (!explanation) {
        return sendError(res, 'EXPLANATION_NOT_FOUND', 'No SHAP explanation found for this lead.', 404);
      }
      return sendSuccess(res, explanation);
    } catch (error) {
      next(error);
    }
  }

  static async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const leadId = Array.isArray(req.params.leadId) ? req.params.leadId[0] : req.params.leadId;
      const history = await PredictionService.getPredictionHistory(
        leadId,
        req.user!.organizationId
      );
      return sendSuccess(res, history);
    } catch (error) {
      next(error);
    }
  }
}
