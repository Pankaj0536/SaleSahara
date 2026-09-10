import { Request, Response, NextFunction } from 'express';
import { Organization } from '../models/Organization';
import { sendSuccess, sendError } from '../utils/response';

export class OrganizationController {
  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const org = await Organization.findById(req.user!.organizationId).lean();
      if (!org) return sendError(res, 'ORGANIZATION_NOT_FOUND', 'Organization not found.', 404);
      return sendSuccess(res, org);
    } catch (error) {
      next(error);
    }
  }

  static async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const org = await Organization.findByIdAndUpdate(
        req.user!.organizationId,
        { $set: req.body },
        { new: true }
      ).lean();
      if (!org) return sendError(res, 'ORGANIZATION_NOT_FOUND', 'Organization not found.', 404);
      return sendSuccess(res, org);
    } catch (error) {
      next(error);
    }
  }
}
