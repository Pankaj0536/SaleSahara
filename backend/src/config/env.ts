import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/leadiq'),
  JWT_SECRET: z.string().default('leadiq_super_secret_jwt_access_token_key_2026!'),
  JWT_REFRESH_SECRET: z.string().default('leadiq_super_secret_jwt_refresh_token_key_2026!'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  ML_SERVICE_URL: z.string().default('http://127.0.0.1:8000'),
  ML_SERVICE_SECRET: z.string().default('internal_ml_service_secret_token_leadiq_2026'),
  LLM_API_KEY: z.string().optional()
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment variables:', parsedEnv.error.format());
  throw new Error('Invalid environment variables configuration.');
}

export const env = parsedEnv.data;
