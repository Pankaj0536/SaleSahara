import request from 'supertest';
import app from '../src/app';
import { connectDatabase, disconnectDatabase } from '../src/config/database';
import { Lead } from '../src/models/Lead';
import { User } from '../src/models/User';
import { Organization } from '../src/models/Organization';

describe('LeadIQ Production Backend End-to-End Test Suite', () => {
  let authToken: string;
  let organizationId: string;
  let testLeadId: string;

  beforeAll(async () => {
    await connectDatabase();
    await Organization.deleteMany({});
    await User.deleteMany({});
    await Lead.deleteMany({});
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  describe('1. Authentication & Multi-Tenancy', () => {
    it('should register a new organization and admin user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Chief Sales Officer',
          email: 'cso@testenterprise.com',
          password: 'SecurePassword123!',
          organizationName: 'Test Enterprise Corp',
          industry: 'SaaS',
          role: 'ADMIN'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();

      authToken = res.body.data.accessToken;
      organizationId = res.body.data.user.organizationId;
    });

    it('should reject invalid credentials during login', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'cso@testenterprise.com',
          password: 'WrongPassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('should return current user profile from /api/auth/me', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe('cso@testenterprise.com');
      expect(res.body.data.organization.name).toBe('Test Enterprise Corp');
    });
  });

  describe('2. CRM Leads & Prioritization', () => {
    it('should create a new lead with validation', async () => {
      const res = await request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          firstName: 'Vikram',
          lastName: 'Mehta',
          email: 'vikram.mehta@cloudscale.io',
          phone: '+1 (555) 987-6543',
          companyName: 'CloudScale IO',
          industry: 'SaaS',
          budget: 35000,
          expectedDealValue: 40000,
          source: 'website'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBeDefined();
      testLeadId = res.body.data._id;
    });

    it('should query leads with complex filters and pagination', async () => {
      const res = await request(app)
        .get('/api/leads?page=1&limit=10&search=Vikram&source=website')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.total).toBeGreaterThanOrEqual(1);
    });

    it('should retrieve prioritized and hot leads', async () => {
      const res = await request(app)
        .get('/api/leads/prioritized')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('3. Activities & Behavioral Tracking', () => {
    it('should record activities and auto-recalculate engagement velocity', async () => {
      const res1 = await request(app)
        .post(`/api/leads/${testLeadId}/activities`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'pricing_visit',
          metadata: { plan: 'enterprise', durationSec: 140 }
        });

      expect(res1.status).toBe(201);
      expect(res1.body.data.activity.type).toBe('pricing_visit');
      expect(res1.body.data.lead.engagementScore).toBeGreaterThan(0);

      const res2 = await request(app)
        .post(`/api/leads/${testLeadId}/activities`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'demo_request',
          metadata: { requestedDate: '2026-09-12' }
        });

      expect(res2.status).toBe(201);
      expect(res2.body.data.lead.engagementTrend).toBe('rising');
    });

    it('should fetch complete chronological timeline', async () => {
      const res = await request(app)
        .get(`/api/leads/${testLeadId}/timeline`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0].type).toBe('pricing_visit');
      expect(res.body.data[1].type).toBe('demo_request');
    });
  });

  describe('4. AI Predictions & SHAP Explanations', () => {
    it('should run conversion prediction and compute probability, score, and priority', async () => {
      const res = await request(app)
        .post(`/api/predictions/${testLeadId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.probability).toBeGreaterThan(0);
      expect(res.body.data.score).toBeGreaterThanOrEqual(0);
      expect(['HOT', 'HIGH', 'MEDIUM', 'LOW']).toContain(res.body.data.priority);
      expect(res.body.data.calibration).toBeDefined();
    });

    it('should return SHAP explanation factors', async () => {
      const res = await request(app)
        .get(`/api/predictions/${testLeadId}/explanation`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.factors).toBeDefined();
      expect(res.body.data.factors.length).toBeGreaterThan(0);
      expect(res.body.data.factors[0].impact).toBeGreaterThan(0);
    });
  });

  describe('5. Next Best Action & AI Outreach', () => {
    it('should generate deterministic Next Best Action based on high intent signals', async () => {
      const res = await request(app)
        .get(`/api/ai/action/${testLeadId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.action).toBeDefined();
      expect(res.body.data.confidence).toBeGreaterThan(0.7);
    });

    it('should generate personalized sales outreach message with configured tone', async () => {
      const res = await request(app)
        .post('/api/ai/message')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          leadId: testLeadId,
          tone: 'professional'
        });

      expect(res.status).toBe(201);
      expect(res.body.data.content).toContain('Vikram');
      expect(res.body.data.tone).toBe('professional');
    });
  });

  describe('6. Actual Outcome Feedback Loop (Prediction vs Actual)', () => {
    it('should record actual conversion outcome and link to prediction performance ledger', async () => {
      const res = await request(app)
        .post('/api/feedback/outcome')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          leadId: testLeadId,
          outcome: 'CONVERTED'
        });

      expect(res.status).toBe(200);
      expect(res.body.data.lead.actualOutcome).toBe('CONVERTED');
      expect(res.body.data.metric).toBeDefined();
      expect(res.body.data.metric.brierLoss).toBeDefined();
    });

    it('should compute prediction vs actual analytics and confusion matrix', async () => {
      const res = await request(app)
        .get('/api/feedback/prediction-vs-actual')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.totalEvaluated).toBeGreaterThanOrEqual(1);
      expect(res.body.data.confusionMatrix).toBeDefined();
      expect(res.body.data.brierScore).toBeDefined();
    });
  });

  describe('7. Offline-First Synchronization & Conflict Resolution', () => {
    it('should push offline operations with unique operationId (idempotency)', async () => {
      const opId = `op-test-${Date.now()}`;
      const payload = {
        operations: [
          {
            operationId: opId,
            entity: 'lead',
            action: 'create',
            payload: {
              firstName: 'Offline',
              lastName: 'SyncLead',
              email: 'offline.sync@testcorp.com',
              companyName: 'Offline Corp',
              budget: 20000
            },
            clientTimestamp: new Date().toISOString()
          }
        ]
      };

      // First push
      const res1 = await request(app)
        .post('/api/sync/push')
        .set('Authorization', `Bearer ${authToken}`)
        .send(payload);

      expect(res1.status).toBe(200);
      expect(res1.body.data.synced).toBe(1);

      // Duplicate push (idempotency verification)
      const res2 = await request(app)
        .post('/api/sync/push')
        .set('Authorization', `Bearer ${authToken}`)
        .send(payload);

      expect(res2.status).toBe(200);
      expect(res2.body.data.synced).toBe(1); // skipped duplicate without creating duplicate lead
    });

    it('should pull incremental changes since timestamp', async () => {
      const res = await request(app)
        .post('/api/sync/pull')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ since: new Date(Date.now() - 3600000).toISOString() });

      expect(res.status).toBe(200);
      expect(res.body.data.leads).toBeDefined();
      expect(res.body.data.count).toBeGreaterThan(0);
    });
  });

  describe('8. Analytics Aggregations', () => {
    it('should return overview metrics calculated via MongoDB pipelines', async () => {
      const res = await request(app)
        .get('/api/analytics/overview')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.totalLeads).toBeGreaterThan(0);
      expect(res.body.data.conversionRate).toBeDefined();
      expect(res.body.data.expectedRevenue).toBeDefined();
    });

    it('should return sales funnel stages', async () => {
      const res = await request(app)
        .get('/api/analytics/funnel')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.some((s: any) => s.stage === 'CONVERTED')).toBe(true);
    });

    it('should return revenue forecasting breakdown', async () => {
      const res = await request(app)
        .get('/api/analytics/revenue')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.currentPipeline).toBeDefined();
      expect(res.body.data.predictedRevenue).toBeDefined();
    });
  });

  describe('9. Health Checks', () => {
    it('should return status healthy from /health', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.api).toBe(true);
      expect(res.body.database).toBe(true);
    });
  });
});
