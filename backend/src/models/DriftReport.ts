import mongoose, { Document, Schema, Types } from 'mongoose';

export type DriftSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface IDriftFeature {
  feature: string;
  baselineDistribution: Record<string, number>;
  currentDistribution: Record<string, number>;
  driftScore: number; // e.g. PSI or KS statistic
  severity: DriftSeverity;
  pVal?: number;
}

export interface IDriftReport extends Document {
  _id: Types.ObjectId;
  organizationId?: Types.ObjectId;
  modelVersion: string;
  overallDriftScore: number;
  overallSeverity: DriftSeverity;
  sampleSize: number;
  features: IDriftFeature[];
  detectedAt: Date;
  createdAt: Date;
}

const DriftFeatureSchema = new Schema<IDriftFeature>(
  {
    feature: { type: String, required: true },
    baselineDistribution: { type: Schema.Types.Mixed, default: {} },
    currentDistribution: { type: Schema.Types.Mixed, default: {} },
    driftScore: { type: Number, required: true },
    severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], required: true },
    pVal: { type: Number }
  },
  { _id: false }
);

const DriftReportSchema = new Schema<IDriftReport>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
    modelVersion: { type: String, required: true },
    overallDriftScore: { type: Number, required: true },
    overallSeverity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], required: true },
    sampleSize: { type: Number, required: true },
    features: [DriftFeatureSchema],
    detectedAt: { type: Date, default: Date.now }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

DriftReportSchema.index({ organizationId: 1, detectedAt: -1 });

export const DriftReport = mongoose.model<IDriftReport>('DriftReport', DriftReportSchema);
