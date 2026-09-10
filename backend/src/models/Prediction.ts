import mongoose, { Document, Schema, Types } from 'mongoose';
import { LeadPriority } from './Lead';

export interface IPrediction extends Document {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  leadId: Types.ObjectId;
  modelVersion: string;
  probability: number;
  score: number;
  priority: LeadPriority;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  calibration?: {
    brierScore?: number;
    confidenceInterval?: [number, number];
  };
  featuresSnapshot: Record<string, any>;
  inferenceTimeMs?: number;
  predictedAt: Date;
  createdAt: Date;
}

const PredictionSchema = new Schema<IPrediction>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    modelVersion: { type: String, required: true, default: 'catboost-v1' },
    probability: { type: Number, required: true },
    score: { type: Number, required: true },
    priority: { type: String, enum: ['HOT', 'HIGH', 'MEDIUM', 'LOW'], required: true },
    confidence: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], default: 'HIGH' },
    calibration: {
      brierScore: { type: Number },
      confidenceInterval: [{ type: Number }]
    },
    featuresSnapshot: { type: Schema.Types.Mixed, default: {} },
    inferenceTimeMs: { type: Number, default: 0 },
    predictedAt: { type: Date, default: Date.now }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

PredictionSchema.index({ organizationId: 1, leadId: 1, predictedAt: -1 });

export const Prediction = mongoose.model<IPrediction>('Prediction', PredictionSchema);
