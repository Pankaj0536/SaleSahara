import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import mongoose from 'mongoose';
import axios from 'axios';

import { env } from './config/env';
import { corsOptions } from './config/cors';
import { generalLimiter } from './middleware/rateLimit';
import { errorHandler } from './middleware/error';
import { swaggerSpec } from './config/swagger';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import organizationRoutes from './routes/organization.routes';
import leadRoutes from './routes/lead.routes';
import activityRoutes from './routes/activity.routes';
import predictionRoutes from './routes/prediction.routes';
import analyticsRoutes from './routes/analytics.routes';
import aiRoutes from './routes/ai.routes';
import importRoutes from './routes/import.routes';
import notificationRoutes from './routes/notification.routes';
import syncRoutes from './routes/sync.routes';
import modelRoutes from './routes/model.routes';
import feedbackRoutes from './routes/feedback.routes';
import auditRoutes from './routes/audit.routes';
import demoRoutes from './routes/demo.routes';

const app = express();

// Security and utility middleware
app.use(helmet({ contentSecurityPolicy: false })); // allow swagger ui inline assets
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(generalLimiter);

// OpenAPI / Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// System Health Checks
app.get('/health', async (_req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  let mlServiceConnected = false;

  try {
    const mlRes = await axios.get(`${env.ML_SERVICE_URL}/health`, { timeout: 1500 });
    mlServiceConnected = mlRes.status === 200;
  } catch {
    mlServiceConnected = false;
  }

  return res.status(200).json({
    status: dbConnected ? 'healthy' : 'degraded',
    api: true,
    database: dbConnected,
    mlService: mlServiceConnected,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health/ml', async (_req, res) => {
  try {
    const mlRes = await axios.get(`${env.ML_SERVICE_URL}/health`, { timeout: 2000 });
    return res.status(200).json({
      online: true,
      data: mlRes.data
    });
  } catch (error: any) {
    return res.status(503).json({
      online: false,
      message: `ML service is currently unreachable (${error.message}). Calibrated fallback engine is active.`
    });
  }
});

// REST API Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api', activityRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/import', importRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/demo', demoRoutes);

// Centralized error handling
app.use(errorHandler);

export default app;
