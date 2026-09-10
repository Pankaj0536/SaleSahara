import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { sendSuccess } from '../utils/response';

export class AnalyticsController {
  static async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnalyticsService.getOverview(req.user!.organizationId);
      return sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async getFunnel(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnalyticsService.getFunnel(req.user!.organizationId);
      return sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async getSources(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnalyticsService.getSources(req.user!.organizationId);
      return sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async getRevenue(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnalyticsService.getRevenue(req.user!.organizationId);
      return sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async getSegments(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnalyticsService.getSegments(req.user!.organizationId);
      return sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async getPredictionVsActual(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnalyticsService.getPredictionVsActual(req.user!.organizationId);
      return sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }
}
