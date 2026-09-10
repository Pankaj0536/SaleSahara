import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IModelMetric extends Document {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  leadId: Types.ObjectId;
  predictionId?: Types.ObjectId;
  modelVersion: string;
  predictedProbability: number;
  predictedScore: number;
  predictedPriority: string;
  actualOutcome: 'CONVERTED' | 'LOST';
  brierLoss: number;
  isCorrect: boolean;
  scoreBucket: '0-39' | '40-59' | '60-79' | '80-100';
  resolvedAt: Date;
  createdAt: Date;
}

const ModelMetricSchema = new Schema<IModelMetric>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    predictionId: { type: Schema.Types.ObjectId, ref: 'Prediction' },
    modelVersion: { type: String, required: true },
    predictedProbability: { type: Number, required: true },
    predictedScore: { type: Number, required: true },
    predictedPriority: { type: String, required: true },
    actualOutcome: { type: String, enum: ['CONVERTED', 'LOST'], required: true },
    brierLoss: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true },
    scoreBucket: { type: String, enum: ['0-39', '40-59', '60-79', '80-100'], required: true },
    resolvedAt: { type: Date, default: Date.now }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ModelMetricSchema.index({ organizationId: 1, resolvedAt: -1 });

export const ModelMetric = mongoose.model<IModelMetric>('ModelMetric', ModelMetricSchema);
