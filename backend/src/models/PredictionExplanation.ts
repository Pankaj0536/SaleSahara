import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IExplanationFactor {
  feature: string;
  displayName?: string;
  impact: number;
  direction: 'positive' | 'negative';
  value?: any;
}

export interface IPredictionExplanation extends Document {
  _id: Types.ObjectId;
  predictionId: Types.ObjectId;
  leadId: Types.ObjectId;
  organizationId: Types.ObjectId;
  factors: IExplanationFactor[];
  baseValue: number;
  generatedAt: Date;
}

const ExplanationFactorSchema = new Schema<IExplanationFactor>(
  {
    feature: { type: String, required: true },
    displayName: { type: String },
    impact: { type: Number, required: true },
    direction: { type: String, enum: ['positive', 'negative'], required: true },
    value: { type: Schema.Types.Mixed }
  },
  { _id: false }
);

const PredictionExplanationSchema = new Schema<IPredictionExplanation>(
  {
    predictionId: { type: Schema.Types.ObjectId, ref: 'Prediction', required: true, index: true },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    factors: [ExplanationFactorSchema],
    baseValue: { type: Number, required: true, default: 0.5 },
    generatedAt: { type: Date, default: Date.now }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

PredictionExplanationSchema.index({ organizationId: 1, leadId: 1, generatedAt: -1 });

export const PredictionExplanation = mongoose.model<IPredictionExplanation>(
  'PredictionExplanation',
  PredictionExplanationSchema
);
