import { Request, Response, NextFunction } from 'express';
import { AuditLog } from '../models/AuditLog';
import { sendSuccess } from '../utils/response';
import { getPagination } from '../utils/pagination';

export class AuditController {
  static async getLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = getPagination(req);
      const query: any = { organizationId: req.user!.organizationId };

      if (req.query.action) query.action = req.query.action;
      if (req.query.entity) query.entity = req.query.entity;

      const [logs, total] = await Promise.all([
        AuditLog.find(query)
          .sort({ timestamp: -1 })
          .skip(pagination.skip)
          .limit(pagination.limit)
          .lean(),
        AuditLog.countDocuments(query)
      ]);

      return sendSuccess(res, logs, 200, {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit) || 1
      });
    } catch (error) {
      next(error);
    }
  }
}
