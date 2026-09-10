import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { sendSuccess, sendError } from '../utils/response';
import { getPagination } from '../utils/pagination';

export class UserController {
  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findById(req.user!.userId).select('-passwordHash');
      if (!user) return sendError(res, 'USER_NOT_FOUND', 'User not found.', 404);
      return sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }

  static async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, avatar } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user!.userId,
        { $set: { ...(name && { name }), ...(avatar && { avatar }) } },
        { new: true }
      ).select('-passwordHash');
      return sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = getPagination(req);
      const query = { organizationId: req.user!.organizationId, isActive: true };

      const [users, total] = await Promise.all([
        User.find(query).select('-passwordHash').skip(pagination.skip).limit(pagination.limit).lean(),
        User.countDocuments(query)
      ]);

      return sendSuccess(res, users, 200, {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit) || 1
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const user = await User.findOne({
        _id: id,
        organizationId: req.user!.organizationId
      }).select('-passwordHash');

      if (!user) return sendError(res, 'USER_NOT_FOUND', 'User not found.', 404);
      return sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { role, isActive, name, avatar } = req.body;
      const updateData: any = {};
      if (role) updateData.role = role;
      if (isActive !== undefined) updateData.isActive = isActive;
      if (name) updateData.name = name;
      if (avatar) updateData.avatar = avatar;

      const user = await User.findOneAndUpdate(
        { _id: id, organizationId: req.user!.organizationId },
        { $set: updateData },
        { new: true }
      ).select('-passwordHash');

      if (!user) return sendError(res, 'USER_NOT_FOUND', 'User not found.', 404);
      return sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }
}
