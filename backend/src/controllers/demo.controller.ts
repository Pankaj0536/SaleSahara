import { Request, Response, NextFunction } from 'express';
import { Lead } from '../models/Lead';
import { LeadActivity } from '../models/LeadActivity';
import { Prediction } from '../models/Prediction';
import { PredictionExplanation } from '../models/PredictionExplanation';
import { NextBestAction } from '../models/NextBestAction';
import { AIMessage } from '../models/AIMessage';
import { Notification } from '../models/Notification';
import { ModelMetric } from '../models/ModelMetric';
import { sendSuccess } from '../utils/response';
import { seedDatabase } from '../scripts/seed';
import { Types } from 'mongoose';

export class DemoController {
  static async reset(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.user?.organizationId ? new Types.ObjectId(req.user.organizationId) : null;
      const filter = orgId ? { organizationId: orgId } : {};

      await Promise.all([
        Lead.deleteMany(filter),
        LeadActivity.deleteMany(filter),
        Prediction.deleteMany(filter),
        PredictionExplanation.deleteMany(filter),
        NextBestAction.deleteMany(filter),
        AIMessage.deleteMany(filter),
        Notification.deleteMany(filter),
        ModelMetric.deleteMany(filter)
      ]);

      return sendSuccess(res, { message: 'Demo database cleared successfully.' });
    } catch (error) {
      next(error);
    }
  }

  static async seed(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await seedDatabase(req.user?.organizationId);
      return sendSuccess(res, {
        message: 'Demo dataset seeded successfully with 1,000+ realistic leads, activities, and Rahul scenario.',
        stats: result
      }, 201);
    } catch (error) {
      next(error);
    }
  }
}
