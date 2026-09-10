import { Request, Response, NextFunction } from 'express';
import { SyncService } from '../services/sync.service';
import { sendSuccess, sendError } from '../utils/response';

export class SyncController {
  static async push(req: Request, res: Response, next: NextFunction) {
    try {
      const { operations } = req.body;
      if (!Array.isArray(operations)) {
        return sendError(res, 'INVALID_INPUT', 'Body must contain an array of operations.', 400);
      }

      const result = await SyncService.pushOperations(
        req.user!.organizationId,
        req.user!.userId,
        operations
      );

      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async pull(req: Request, res: Response, next: NextFunction) {
    try {
      const { since } = req.body;
      const result = await SyncService.pullChanges(req.user!.organizationId, since);
      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const status = await SyncService.getStatus(req.user!.organizationId);
      return sendSuccess(res, status);
    } catch (error) {
      next(error);
    }
  }
}
