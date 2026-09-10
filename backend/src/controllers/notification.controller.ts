import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';
import { sendSuccess } from '../utils/response';

export class NotificationController {
  static async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 50;
      const notifications = await NotificationService.getNotifications(
        req.user!.organizationId,
        req.user?.userId,
        limit
      );
      return sendSuccess(res, notifications);
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await NotificationService.markAsRead(id, req.user!.organizationId);
      return sendSuccess(res, { message: 'Notification marked as read.' });
    } catch (error) {
      next(error);
    }
  }

  static async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const count = await NotificationService.markAllAsRead(
        req.user!.organizationId,
        req.user?.userId
      );
      return sendSuccess(res, { message: `${count} notifications marked as read.` });
    } catch (error) {
      next(error);
    }
  }
}
