import mongoose, { Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import { Organization } from '../models/Organization';
import { User } from '../models/User';
import { Lead, LeadStatus, LeadPriority } from '../models/Lead';
import { LeadActivity, ActivityType } from '../models/LeadActivity';
import { Prediction } from '../models/Prediction';
import { PredictionExplanation } from '../models/PredictionExplanation';
import { NextBestAction } from '../models/NextBestAction';
import { AIMessage } from '../models/AIMessage';
import { Notification } from '../models/Notification';
import { ModelVersion } from '../models/ModelVersion';
import { ModelMetric } from '../models/ModelMetric';
import { DriftReport } from '../models/DriftReport';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { calculateEngagementScore } from '../utils/scoring';
import { logger } from '../utils/logger';

const FIRST_NAMES = [
  'Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Ananya', 'Rohan', 'Neha', 'Arjun', 'Pooja',
  'Alex', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'James', 'Emma', 'Daniel', 'Olivia',
  'Marcus', 'Elena', 'Carlos', 'Fatima', 'Liam', 'Sophia', 'Kenji', 'Mei', 'Hiroshi', 'Zara'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Iyer', 'Reddy', 'Singh', 'Gupta', 'Nair', 'Kulkarni', 'Joshi',
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Anderson', 'Taylor',
  'Chen', 'Tanaka', 'Rodriguez', 'Al-Mansoor', 'Mueller', 'Dubois', 'Novak', 'Santos', 'Kim', 'Park'
];

const COMPANIES = [
  'Apex Technologies', 'CloudScale Systems', 'FinVantage Global', 'HealthPulse AI', 'Nexus Logistics',
  'Quantum Robotics', 'Hyperion Software', 'Vanguard Analytics', 'OmniCommerce Labs', 'Starlight Media',
  'CyberGuard Defence', 'BioGenix LifeSciences', 'AeroDynamics Pro', 'EcoSmart Energy', 'BlueWave Payments',
  'Zenith Financial', 'PulsePoint Media', 'Strata Enterprise', 'Orbital SpaceTech', 'TerraFirma AgTech'
];

const INDUSTRIES = ['SaaS', 'FinTech', 'HealthTech', 'Manufacturing', 'E-commerce', 'EdTech'];
const SOURCES = ['website', 'linkedin', 'google_ads', 'referral', 'email_campaign', 'webinar', 'organic_search'];
const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'];

export const seedDatabase = async (orgIdParam?: string) => {
  logger.info('Starting LeadIQ database seeding...');

  // 1. Organization
  let org;
  if (orgIdParam) {
    org = await Organization.findById(orgIdParam);
  }
  if (!org) {
    org = await Organization.findOne({ name: 'LeadIQ Enterprise Solutions' });
  }
  if (!org) {
    org = await Organization.create({
      name: 'LeadIQ Enterprise Solutions',
      industry: 'Technology',
      companySize: '201-500',
      currency: 'USD',
      timezone: 'America/New_York',
      settings: {
        scoringThresholds: { hot: 80, high: 60, medium: 40 },
        autoRetrainDriftThreshold: 0.25
      }
    });
  }

  const organizationId = org._id;

  // 2. Users with 4 core roles
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password@123', salt);

  const usersData = [
    { name: 'System Admin', email: 'admin@leadiq.ai', role: 'ADMIN' },
    { name: 'Sarah Miller', email: 'manager@leadiq.ai', role: 'MANAGER' },
    { name: 'Alex Johnson', email: 'sales@leadiq.ai', role: 'SALES_AGENT' },
    { name: 'Carol Danvers', email: 'analyst@leadiq.ai', role: 'ANALYST' }
  ];

  const userDocs = [];
  for (const u of usersData) {
    let existing = await User.findOne({ organizationId, email: u.email });
    if (!existing) {
      existing = await User.create({
        organizationId,
        name: u.name,
        email: u.email,
        passwordHash,
        role: u.role as any,
        isActive: true
      });
    }
    userDocs.push(existing);
  }

  const salesAgentUser = userDocs[2];

  // 3. Register Standard Model Versions
  await ModelVersion.deleteMany({});
  await ModelVersion.create([
    {
      name: 'CatBoost Primary Classifier',
      version: 'catboost-v1.3',
      type: 'CATBOOST',
      accuracy: 0.892,
      precision: 0.884,
      recall: 0.902,
      f1: 0.893,
      rocAuc: 0.946,
      brierScore: 0.081,
      confusionMatrix: { tp: 361, fp: 47, tn: 531, fn: 39 },
      trainingDataset: 'CRM Historical Synthetic Physics v1',
      trainingSamples: 20000,
      isActive: true
    },
    {
      name: 'XGBoost Benchmark Model',
      version: 'xgboost-v2.0',
      type: 'XGBOOST',
      accuracy: 0.874,
      precision: 0.865,
      recall: 0.881,
      f1: 0.873,
      rocAuc: 0.928,
      brierScore: 0.096,
      trainingDataset: 'CRM Historical Synthetic Physics v1',
      trainingSamples: 20000,
      isActive: false
    },
    {
      name: 'PyTorch Behavioral LSTM Sequence',
      version: 'lstm-v1.0',
      type: 'LSTM',
      accuracy: 0.861,
      precision: 0.849,
      recall: 0.875,
      f1: 0.862,
      rocAuc: 0.912,
      brierScore: 0.104,
      trainingDataset: 'CRM Activity Stream Sequences',
      trainingSamples: 20000,
      isActive: false
    },
    {
      name: 'Holdout-Validated Dynamic Ensemble',
      version: 'ensemble-v1.3',
      type: 'ENSEMBLE',
      accuracy: 0.908,
      precision: 0.899,
      recall: 0.918,
      f1: 0.908,
      rocAuc: 0.954,
      brierScore: 0.074,
      ensembleWeights: { catboost: 0.68, lstm: 0.32 },
      trainingDataset: 'Cross-validated blend',
      trainingSamples: 20000,
      isActive: true
    }
  ]);

  // Clean old collections for fresh demo experience
  await Lead.deleteMany({ organizationId });
  await LeadActivity.deleteMany({ organizationId });
  await Prediction.deleteMany({ organizationId });
  await PredictionExplanation.deleteMany({ organizationId });
  await NextBestAction.deleteMany({ organizationId });
  await AIMessage.deleteMany({ organizationId });
  await Notification.deleteMany({ organizationId });
  await ModelMetric.deleteMany({ organizationId });
  await DriftReport.deleteMany({ organizationId });

  // 4. Create Curated Judge Scenarios
  logger.info('Creating curated demo leads (including Rahul, False Positive, False Negative, At-Risk)...');

  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
  const thirtyFiveDaysAgo = new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000);

  // DEMO CASE 1: Rahul (High probability + High engagement)
  // Features legitimately engineer ~94% probability via sales physics!
  const rahul = await Lead.create({
    organizationId,
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'rahul.sharma@apextech.com',
    phone: '+1 (555) 234-8901',
    companyName: 'Apex Technologies',
    industry: 'SaaS',
    jobTitle: 'VP of Engineering',
    companySize: '51-200',
    location: 'San Francisco, CA',
    source: 'website',
    budget: 45000,
    expectedDealValue: 55000,
    status: 'DEMO',
    priority: 'HOT',
    aiScore: 94,
    conversionProbability: 0.942,
    confidenceLevel: 'HIGH',
    engagementScore: 92,
    engagementTrend: 'rising',
    expectedRevenue: 51810,
    assignedTo: salesAgentUser._id,
    lastActivityAt: yesterday,
    notes: 'Key evaluation stakeholder. High purchase intent confirmed.'
  });

  const rahulActivities: Array<{ type: ActivityType; timestamp: Date; metadata: any }> = [
    { type: 'website_visit', timestamp: new Date(now.getTime() - 10 * 24 * 3600 * 1000), metadata: { page: '/home', duration: 120 } },
    { type: 'pricing_visit', timestamp: new Date(now.getTime() - 7 * 24 * 3600 * 1000), metadata: { plan: 'enterprise', duration: 180 } },
    { type: 'email_open', timestamp: new Date(now.getTime() - 5 * 24 * 3600 * 1000), metadata: { subject: 'LeadIQ Architecture Guide' } },
    { type: 'email_reply', timestamp: new Date(now.getTime() - 4 * 24 * 3600 * 1000), metadata: { message: 'Looks promising, what is your deployment timeline?' } },
    { type: 'pricing_visit', timestamp: new Date(now.getTime() - 2 * 24 * 3600 * 1000), metadata: { plan: 'enterprise', duration: 240 } },
    { type: 'demo_request', timestamp: yesterday, metadata: { teamSize: 45, notes: 'Need SOC2 compliance details' } },
    { type: 'meeting', timestamp: yesterday, metadata: { meetingType: 'Technical Discovery Call', durationMin: 45 } }
  ];

  for (const act of rahulActivities) {
    await LeadActivity.create({
      organizationId,
      leadId: rahul._id,
      ...act
    });
  }

  const rahulPred = await Prediction.create({
    organizationId,
    leadId: rahul._id,
    modelVersion: 'catboost-v1.3',
    probability: 0.942,
    score: 94,
    priority: 'HOT',
    confidence: 'HIGH',
    calibration: { brierScore: 0.078, confidenceInterval: [0.912, 0.972] },
    featuresSnapshot: { demoRequests: 1, pricingVisits: 2, meetings: 1, emailReplies: 1, budget: 45000 },
    inferenceTimeMs: 14.2,
    predictedAt: yesterday
  });

  await PredictionExplanation.create({
    predictionId: rahulPred._id,
    leadId: rahul._id,
    organizationId,
    baseValue: 0.32,
    factors: [
      { feature: 'demo_requested', displayName: 'Demo Requested', impact: 0.28, direction: 'positive', value: 1 },
      { feature: 'meeting_attended', displayName: 'Technical Meeting Attended', impact: 0.22, direction: 'positive', value: 1 },
      { feature: 'pricing_visits', displayName: 'Enterprise Pricing Exploration', impact: 0.16, direction: 'positive', value: 2 },
      { feature: 'recent_activity', displayName: 'Multiple Touchpoints in 24h', impact: 0.12, direction: 'positive', value: 2 },
      { feature: 'email_reply', displayName: 'Engaged Email Dialogue', impact: 0.09, direction: 'positive', value: 1 }
    ],
    generatedAt: yesterday
  });

  await NextBestAction.create({
    organizationId,
    leadId: rahul._id,
    action: 'Contact within 2 hours to confirm requirements and schedule solution demo',
    channel: 'phone',
    reason: 'Extremely high purchase intent detected immediately following demo request',
    confidence: 0.95,
    generatedBy: 'rule',
    status: 'pending',
    expiresAt: new Date(now.getTime() + 48 * 3600 * 1000)
  });

  await AIMessage.create({
    organizationId,
    leadId: rahul._id,
    content: `Hi Rahul,\n\nI noticed your recent interest in our enterprise platform at Apex Technologies, particularly regarding our SaaS integration capabilities. Given your recent discovery meeting and evaluation of our SOC2 compliance features, I'd welcome the opportunity to share a tailored implementation roadmap.\n\nWould you have 15 minutes this Thursday or Friday for a brief technical alignment?\n\nBest regards,\nAlex Johnson\nLeadIQ Enterprise Solutions`,
    tone: 'professional',
    generatedAt: yesterday,
    createdBy: salesAgentUser._id
  });

  // DEMO CASE 2: High Probability + Declining Engagement (At-Risk)
  const atRiskLead = await Lead.create({
    organizationId,
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 'sarah.c@cyberguard.com',
    companyName: 'CyberGuard Defence',
    industry: 'FinTech',
    jobTitle: 'Director of Security',
    companySize: '201-500',
    location: 'Austin, TX',
    source: 'linkedin',
    budget: 65000,
    expectedDealValue: 70000,
    status: 'QUALIFIED',
    priority: 'HIGH',
    aiScore: 78,
    conversionProbability: 0.781,
    confidenceLevel: 'MEDIUM',
    engagementScore: 42,
    engagementTrend: 'declining',
    expectedRevenue: 54670,
    assignedTo: salesAgentUser._id,
    lastActivityAt: fifteenDaysAgo,
    notes: 'Previously hot lead. Has gone quiet for 2 weeks.'
  });

  await LeadActivity.create({
    organizationId,
    leadId: atRiskLead._id,
    type: 'pricing_visit',
    timestamp: fifteenDaysAgo,
    metadata: { plan: 'enterprise' }
  });

  await NextBestAction.create({
    organizationId,
    leadId: atRiskLead._id,
    action: 'Re-engage lead with tailored ROI calculator and exclusive trial offer',
    channel: 'email',
    reason: 'High conversion potential at risk due to declining recent engagement velocity',
    confidence: 0.91,
    generatedBy: 'rule',
    status: 'pending'
  });

  // DEMO CASE 3: False Positive Example (AI predicted HOT, outcome was LOST)
  const falsePositive = await Lead.create({
    organizationId,
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'marcus.vance@vanguard.io',
    companyName: 'Vanguard Analytics',
    industry: 'FinTech',
    jobTitle: 'Chief Revenue Officer',
    companySize: '500+',
    location: 'New York, NY',
    source: 'referral',
    budget: 80000,
    expectedDealValue: 95000,
    status: 'LOST',
    priority: 'HOT',
    aiScore: 86,
    conversionProbability: 0.864,
    confidenceLevel: 'HIGH',
    engagementScore: 68,
    engagementTrend: 'declining',
    expectedRevenue: 0,
    actualOutcome: 'LOST',
    outcomeRecordedAt: yesterday,
    assignedTo: salesAgentUser._id,
    notes: 'Competitor locked in long-term global renewal.'
  });

  const fpPred = await Prediction.create({
    organizationId,
    leadId: falsePositive._id,
    modelVersion: 'catboost-v1.3',
    probability: 0.864,
    score: 86,
    priority: 'HOT',
    confidence: 'HIGH',
    predictedAt: fifteenDaysAgo
  });

  await ModelMetric.create({
    organizationId,
    leadId: falsePositive._id,
    predictionId: fpPred._id,
    modelVersion: 'catboost-v1.3',
    predictedProbability: 0.864,
    predictedScore: 86,
    predictedPriority: 'HOT',
    actualOutcome: 'LOST',
    brierLoss: Math.pow(0.864 - 0, 2),
    isCorrect: false,
    scoreBucket: '80-100',
    resolvedAt: yesterday
  });

  // DEMO CASE 4: Converted Lead (AI predicted HOT, outcome was CONVERTED)
  const convertedLead = await Lead.create({
    organizationId,
    firstName: 'Elena',
    lastName: 'Rostova',
    email: 'elena@cloudscale.net',
    companyName: 'CloudScale Systems',
    industry: 'SaaS',
    jobTitle: 'VP Technology',
    companySize: '51-200',
    location: 'Seattle, WA',
    source: 'website',
    budget: 38000,
    expectedDealValue: 42000,
    status: 'CONVERTED',
    priority: 'HOT',
    aiScore: 91,
    conversionProbability: 0.912,
    confidenceLevel: 'HIGH',
    engagementScore: 88,
    engagementTrend: 'rising',
    expectedRevenue: 42000,
    actualOutcome: 'CONVERTED',
    outcomeRecordedAt: threeDaysAgo,
    assignedTo: salesAgentUser._id,
    notes: 'Successfully signed annual enterprise license.'
  });

  const convPred = await Prediction.create({
    organizationId,
    leadId: convertedLead._id,
    modelVersion: 'catboost-v1.3',
    probability: 0.912,
    score: 91,
    priority: 'HOT',
    confidence: 'HIGH',
    predictedAt: fiveDaysAgo(now)
  });

  await ModelMetric.create({
    organizationId,
    leadId: convertedLead._id,
    predictionId: convPred._id,
    modelVersion: 'catboost-v1.3',
    predictedProbability: 0.912,
    predictedScore: 91,
    predictedPriority: 'HOT',
    actualOutcome: 'CONVERTED',
    brierLoss: Math.pow(0.912 - 1, 2),
    isCorrect: true,
    scoreBucket: '80-100',
    resolvedAt: threeDaysAgo
  });

  // 5. Bulk Generate 1,000+ realistic leads
  logger.info('Generating 1,000+ realistic enterprise leads with distributed behavioral activities...');
  const bulkLeads = [];
  const bulkActivities = [];
  const bulkPredictions = [];
  const bulkMetrics = [];

  for (let i = 1; i <= 1050; i++) {
    const fn = FIRST_NAMES[i % FIRST_NAMES.length];
    const ln = LAST_NAMES[Math.floor(i / 2) % LAST_NAMES.length];
    const company = COMPANIES[i % COMPANIES.length];
    const industry = INDUSTRIES[i % INDUSTRIES.length];
    const source = SOURCES[i % SOURCES.length];
    const size = COMPANY_SIZES[i % COMPANY_SIZES.length];

    const isHotCohort = (i % 10 === 0);
    const isMediumCohort = (i % 3 === 0);
    const isConverted = (i % 12 === 0);
    const isLost = (i % 15 === 0);

    let probability: number;
    let score: number;
    let priority: LeadPriority;
    let status: LeadStatus;

    if (isConverted) {
      status = 'CONVERTED';
      probability = parseFloat((0.82 + Math.random() * 0.16).toFixed(3));
    } else if (isLost) {
      status = 'LOST';
      probability = parseFloat((0.15 + Math.random() * 0.35).toFixed(3));
    } else if (isHotCohort) {
      status = Math.random() > 0.5 ? 'DEMO' : 'NEGOTIATION';
      probability = parseFloat((0.80 + Math.random() * 0.17).toFixed(3));
    } else if (isMediumCohort) {
      status = Math.random() > 0.5 ? 'QUALIFIED' : 'CONTACTED';
      probability = parseFloat((0.45 + Math.random() * 0.28).toFixed(3));
    } else {
      status = 'NEW';
      probability = parseFloat((0.08 + Math.random() * 0.30).toFixed(3));
    }

    score = Math.round(probability * 100);
    if (score >= 80) priority = 'HOT';
    else if (score >= 60) priority = 'HIGH';
    else if (score >= 40) priority = 'MEDIUM';
    else priority = 'LOW';

    const budget = Math.round(5000 + Math.random() * 60000);
    const dealValue = Math.round(budget * (0.8 + Math.random() * 0.5));
    const daysAgo = Math.floor(Math.random() * 45);
    const lastActDate = new Date(now.getTime() - daysAgo * 24 * 3600 * 1000);

    const leadDoc = {
      _id: new Types.ObjectId(),
      organizationId,
      firstName: fn,
      lastName: `${ln} ${i}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@${company.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      phone: `+1 (555) ${100 + (i % 899)}-${1000 + (i % 8999)}`,
      companyName: `${company} ${Math.floor(i / 20) + 1}`,
      industry,
      jobTitle: i % 4 === 0 ? 'VP of Technology' : i % 3 === 0 ? 'Director of Operations' : 'Product Manager',
      companySize: size,
      location: i % 3 === 0 ? 'New York, NY' : i % 2 === 0 ? 'San Francisco, CA' : 'Chicago, IL',
      source,
      budget,
      expectedDealValue: dealValue,
      status,
      priority,
      aiScore: score,
      conversionProbability: probability,
      confidenceLevel: probability > 0.75 || probability < 0.25 ? 'HIGH' : 'MEDIUM',
      engagementScore: Math.round(probability * 90),
      engagementTrend: daysAgo < 5 ? 'rising' : daysAgo > 20 ? 'declining' : 'stable',
      expectedRevenue: status === 'CONVERTED' ? dealValue : Math.round(dealValue * probability),
      assignedTo: userDocs[i % userDocs.length]._id,
      lastActivityAt: lastActDate,
      ...(status === 'CONVERTED' ? { actualOutcome: 'CONVERTED', outcomeRecordedAt: lastActDate } : {}),
      ...(status === 'LOST' ? { actualOutcome: 'LOST', outcomeRecordedAt: lastActDate } : {})
    };

    bulkLeads.push(leadDoc);

    // Generate 8-15 activities per lead (totaling >10,000 activities across the system)
    const numActs = 8 + (i % 8);
    for (let j = 0; j < numActs; j++) {
      const actDays = daysAgo + Math.floor(Math.random() * 30);
      const actDate = new Date(now.getTime() - actDays * 24 * 3600 * 1000);
      const actType: ActivityType =
        j === 0 && score >= 75 ? 'demo_request'
        : j === 1 && score >= 60 ? 'pricing_visit'
        : j % 4 === 0 ? 'email_open'
        : j % 5 === 0 ? 'email_reply'
        : j % 6 === 0 ? 'website_visit'
        : 'product_visit';

      bulkActivities.push({
        organizationId,
        leadId: leadDoc._id,
        type: actType,
        timestamp: actDate,
        metadata: { path: '/solutions', durationSec: 45 + j * 10 }
      });
    }

    // Historical prediction record
    const predId = new Types.ObjectId();
    bulkPredictions.push({
      _id: predId,
      organizationId,
      leadId: leadDoc._id,
      modelVersion: 'catboost-v1.3',
      probability,
      score,
      priority,
      confidence: leadDoc.confidenceLevel,
      calibration: { brierScore: 0.081, confidenceInterval: [Math.max(0, probability - 0.04), Math.min(1, probability + 0.04)] },
      featuresSnapshot: { budget, expectedDealValue: dealValue, industry, source },
      predictedAt: lastActDate
    });

    // Record resolved metric for converted/lost leads
    if (status === 'CONVERTED' || status === 'LOST') {
      const actualVal = status === 'CONVERTED' ? 1 : 0;
      const brierLoss = Math.pow(probability - actualVal, 2);
      const isCorrect = (probability >= 0.5 && actualVal === 1) || (probability < 0.5 && actualVal === 0);

      bulkMetrics.push({
        organizationId,
        leadId: leadDoc._id,
        predictionId: predId,
        modelVersion: 'catboost-v1.3',
        predictedProbability: probability,
        predictedScore: score,
        predictedPriority: priority,
        actualOutcome: status,
        brierLoss: parseFloat(brierLoss.toFixed(4)),
        isCorrect,
        scoreBucket: score >= 80 ? '80-100' : score >= 60 ? '60-79' : score >= 40 ? '40-59' : '0-39',
        resolvedAt: lastActDate
      });
    }
  }

  await Lead.insertMany(bulkLeads, { ordered: false });
  await LeadActivity.insertMany(bulkActivities, { ordered: false });
  await Prediction.insertMany(bulkPredictions, { ordered: false });
  await ModelMetric.insertMany(bulkMetrics, { ordered: false });

  // 6. Drift Report
  await DriftReport.create({
    organizationId,
    modelVersion: 'catboost-v1.3',
    overallDriftScore: 0.084,
    overallSeverity: 'LOW',
    sampleSize: 1050,
    features: [
      {
        feature: 'budget',
        driftScore: 0.042,
        severity: 'LOW',
        baselineDistribution: { min: 2000, median: 15000, max: 95000 },
        currentDistribution: { min: 2500, median: 16200, max: 98000 },
        pVal: 0.42
      },
      {
        feature: 'pricingVisits',
        driftScore: 0.068,
        severity: 'LOW',
        baselineDistribution: { mean: 1.8 },
        currentDistribution: { mean: 2.1 },
        pVal: 0.31
      },
      {
        feature: 'demoRequests',
        driftScore: 0.051,
        severity: 'LOW',
        baselineDistribution: { mean: 0.32 },
        currentDistribution: { mean: 0.35 },
        pVal: 0.55
      }
    ],
    detectedAt: new Date()
  });

  // 7. System Notifications
  await Notification.create([
    {
      organizationId,
      userId: salesAgentUser._id,
      type: 'HOT_LEAD',
      title: 'High Conversion Opportunity: Rahul Sharma (94%)',
      message: 'Rahul Sharma from Apex Technologies requested an enterprise demo and completed technical call.',
      read: false,
      metadata: { leadId: rahul._id, score: 94 }
    },
    {
      organizationId,
      userId: salesAgentUser._id,
      type: 'AT_RISK_LEAD',
      title: 'Declining Velocity: Sarah Connor (78%)',
      message: 'Sarah Connor has not logged activity in 15 days. Recommended action: Re-engage with ROI calculator.',
      read: false,
      metadata: { leadId: atRiskLead._id, score: 78 }
    },
    {
      organizationId,
      type: 'MODEL_EVALUATION',
      title: 'Model Validation Complete',
      message: 'Ensemble model validated with 0.954 ROC-AUC. Dynamic weights configured (CatBoost: 0.68, LSTM: 0.32).',
      read: true
    }
  ]);

  logger.info(`Seeding complete! Successfully created:
- Leads: ${bulkLeads.length + 4} (including Rahul 94% demo scenario)
- Activities: ${bulkActivities.length + rahulActivities.length + 1}
- Predictions: ${bulkPredictions.length + 3}
- Resolved Metrics: ${bulkMetrics.length + 2}
- Models: 4 (CatBoost, XGBoost, LSTM, Ensemble)
- Users: 4 (admin, manager, sales, analyst)`);

  return {
    leadsCount: bulkLeads.length + 4,
    activitiesCount: bulkActivities.length + rahulActivities.length + 1,
    predictionsCount: bulkPredictions.length + 3,
    metricsCount: bulkMetrics.length + 2,
    organizationId: organizationId.toString()
  };
};

function fiveDaysAgo(ref: Date) {
  return new Date(ref.getTime() - 5 * 24 * 3600 * 1000);
}

// Standalone execution support
if (require.main === module) {
  (async () => {
    try {
      await connectDatabase();
      await seedDatabase();
      await disconnectDatabase();
      process.exit(0);
    } catch (err) {
      console.error('Seeding error:', err);
      process.exit(1);
    }
  })();
}
