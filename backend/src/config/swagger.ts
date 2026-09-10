import swaggerJsDoc from 'swagger-jsdoc';
import { env } from './env';

const swaggerOptions: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LeadIQ API Documentation',
      version: '1.0.0',
      description:
        'Enterprise AI Sales Intelligence & CRM Lead Conversion Intelligence Platform Backend API. Supports JWT Authentication, Multi-tenant Lead Management, CatBoost/XGBoost/LSTM Predictions, SHAP Explainability, Next Best Action, and Offline Synchronization.'
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Local Development Server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Provide JWT token: Bearer <token>'
        }
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string' },
                message: { type: 'string' }
              }
            }
          }
        },
        Lead: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' },
            companyName: { type: 'string' },
            industry: { type: 'string' },
            status: { type: 'string' },
            priority: { type: 'string', enum: ['HOT', 'HIGH', 'MEDIUM', 'LOW'] },
            aiScore: { type: 'number' },
            conversionProbability: { type: 'number' },
            confidenceLevel: { type: 'string' },
            expectedRevenue: { type: 'number' }
          }
        }
      }
    },
    security: [{ BearerAuth: [] }]
  },
  apis: ['./src/routes/*.ts', './dist/routes/*.js']
};

export const swaggerSpec = swaggerJsDoc(swaggerOptions);
