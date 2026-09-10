import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, IUser, UserRole } from '../models/User';
import { Organization } from '../models/Organization';
import { AuditLog } from '../models/AuditLog';
import { env } from '../config/env';
import { Types } from 'mongoose';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  organizationName?: string;
  industry?: string;
  role?: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    organizationId: string;
    organizationName?: string;
  };
}

export class AuthService {
  static generateTokens(user: IUser, organizationName?: string): AuthTokens {
    const payload = {
      userId: user._id.toString(),
      organizationId: user.organizationId.toString(),
      role: user.role,
      email: user.email
    };

    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any
    });

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as any
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId.toString(),
        organizationName
      }
    };
  }

  static async register(input: RegisterInput): Promise<AuthTokens> {
    const existingUser = await User.findOne({ email: input.email.toLowerCase() });
    if (existingUser) {
      const err: any = new Error('A user with this email address already exists.');
      err.code = 'USER_ALREADY_EXISTS';
      err.statusCode = 409;
      throw err;
    }

    // Create or find default organization
    const org = await Organization.create({
      name: input.organizationName || `${input.name}'s Organization`,
      industry: input.industry || 'Technology',
      currency: 'USD',
      timezone: 'UTC'
    });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(input.password, salt);

    const user = await User.create({
      organizationId: org._id,
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash,
      role: input.role || 'ADMIN',
      isActive: true,
      lastLoginAt: new Date()
    });

    await AuditLog.create({
      organizationId: org._id,
      userId: user._id,
      action: 'CREATE_LEAD',
      entity: 'user',
      entityId: user._id.toString(),
      metadata: { role: user.role, email: user.email }
    });

    return this.generateTokens(user, org.name);
  }

  static async login(input: LoginInput): Promise<AuthTokens> {
    const user = await User.findOne({ email: input.email.toLowerCase(), isActive: true });
    if (!user) {
      const err: any = new Error('Invalid email or password.');
      err.code = 'INVALID_CREDENTIALS';
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await user.comparePassword(input.password);
    if (!isMatch) {
      const err: any = new Error('Invalid email or password.');
      err.code = 'INVALID_CREDENTIALS';
      err.statusCode = 401;
      throw err;
    }

    user.lastLoginAt = new Date();
    await user.save();

    const org = await Organization.findById(user.organizationId);

    await AuditLog.create({
      organizationId: user.organizationId,
      userId: user._id,
      action: 'LOGIN',
      entity: 'user',
      entityId: user._id.toString(),
      metadata: { ip: 'system' }
    });

    return this.generateTokens(user, org?.name);
  }

  static async refresh(refreshToken: string): Promise<AuthTokens> {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as any;
      const user = await User.findById(decoded.userId);

      if (!user || !user.isActive) {
        const err: any = new Error('User not found or inactive.');
        err.code = 'UNAUTHORIZED';
        err.statusCode = 401;
        throw err;
      }

      const org = await Organization.findById(user.organizationId);
      return this.generateTokens(user, org?.name);
    } catch (error) {
      const err: any = new Error('Invalid or expired refresh token.');
      err.code = 'INVALID_REFRESH_TOKEN';
      err.statusCode = 401;
      throw err;
    }
  }

  static async getMe(userId: string): Promise<any> {
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      const err: any = new Error('User not found.');
      err.code = 'USER_NOT_FOUND';
      err.statusCode = 404;
      throw err;
    }

    const org = await Organization.findById(user.organizationId);
    return {
      user,
      organization: org
    };
  }
}
