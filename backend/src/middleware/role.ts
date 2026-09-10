import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { UserRole } from '../models/User';

export const requireRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'UNAUTHORIZED', 'Authentication required.', 401);
    }

    if (req.user.role === 'ADMIN') {
      return next(); // ADMIN has universal access
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        'FORBIDDEN',
        `Access denied. Role '${req.user.role}' lacks sufficient permissions.`,
        403
      );
    }

    next();
  };
};
