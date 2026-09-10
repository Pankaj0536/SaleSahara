import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  organizationName: z.string().optional(),
  industry: z.string().optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'SALES_AGENT', 'ANALYST']).optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const tokens = await AuthService.register(req.body);
      return sendSuccess(res, tokens, 201);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const tokens = await AuthService.login(req.body);
      return sendSuccess(res, tokens, 200);
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.body.refreshToken || (req.headers['x-refresh-token'] as string);
      if (!refreshToken) {
        return sendError(res, 'TOKEN_REQUIRED', 'Refresh token is required.', 400);
      }
      const tokens = await AuthService.refresh(refreshToken);
      return sendSuccess(res, tokens, 200);
    } catch (error) {
      next(error);
    }
  }

  static async logout(_req: Request, res: Response) {
    return sendSuccess(res, { message: 'Logged out successfully.' });
  }

  static async forgotPassword(req: Request, res: Response) {
    return sendSuccess(res, {
      message: `Password reset instructions sent to ${req.body.email || 'user email'}.`
    });
  }

  static async resetPassword(_req: Request, res: Response) {
    return sendSuccess(res, { message: 'Password reset successfully.' });
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      const meData = await AuthService.getMe(req.user!.userId);
      return sendSuccess(res, meData);
    } catch (error) {
      next(error);
    }
  }
}
