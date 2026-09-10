import mongoose, { Document, Schema, Types } from 'mongoose';

export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'DEMO'
  | 'NEGOTIATION'
  | 'CONVERTED'
  | 'LOST';

export type LeadPriority = 'HOT' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface ILead extends Document {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyName: string;
  industry: string;
  jobTitle?: string;
  companySize?: string;
  location?: string;
  source: string;
  budget: number;
  expectedDealValue: number;
  status: LeadStatus;
  assignedTo?: Types.ObjectId;
  aiScore: number;
  conversionProbability: number;
  priority: LeadPriority;
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  engagementScore: number;
  engagementTrend: 'rising' | 'stable' | 'declining';
  lastActivityAt?: Date;
  expectedRevenue: number;
  actualOutcome?: 'CONVERTED' | 'LOST';
  outcomeRecordedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, trim: true },
    companyName: { type: String, required: true, trim: true },
    industry: { type: String, required: true, default: 'Technology' },
    jobTitle: { type: String, default: 'Manager' },
    companySize: { type: String, default: '51-200' },
    location: { type: String, default: 'United States' },
    source: { type: String, required: true, default: 'website', index: true },
    budget: { type: Number, default: 0 },
    expectedDealValue: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'QUALIFIED', 'DEMO', 'NEGOTIATION', 'CONVERTED', 'LOST'],
      default: 'NEW',
      index: true
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    aiScore: { type: Number, default: 0, index: true },
    conversionProbability: { type: Number, default: 0, index: true },
    priority: {
      type: String,
      enum: ['HOT', 'HIGH', 'MEDIUM', 'LOW'],
      default: 'LOW',
      index: true
    },
    confidenceLevel: {
      type: String,
      enum: ['HIGH', 'MEDIUM', 'LOW'],
      default: 'MEDIUM'
    },
    engagementScore: { type: Number, default: 0 },
    engagementTrend: {
      type: String,
      enum: ['rising', 'stable', 'declining'],
      default: 'stable'
    },
    lastActivityAt: { type: Date },
    expectedRevenue: { type: Number, default: 0 },
    actualOutcome: {
      type: String,
      enum: ['CONVERTED', 'LOST']
    },
    outcomeRecordedAt: { type: Date },
    notes: { type: String }
  },
  { timestamps: true }
);

LeadSchema.index({ organizationId: 1, email: 1 });
LeadSchema.index({ organizationId: 1, status: 1 });
LeadSchema.index({ organizationId: 1, aiScore: -1 });
LeadSchema.index({ organizationId: 1, conversionProbability: -1 });
LeadSchema.index({ organizationId: 1, createdAt: -1 });

export const Lead = mongoose.model<ILead>('Lead', LeadSchema);
