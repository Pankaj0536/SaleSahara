import mongoose, { Document, Schema, Types } from 'mongoose';

export type ModelType = 'CATBOOST' | 'XGBOOST' | 'LSTM' | 'ENSEMBLE';

export interface IModelVersion extends Document {
  _id: Types.ObjectId;
  name: string;
  version: string;
  type: ModelType;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  rocAuc: number;
  brierScore?: number;
  confusionMatrix?: {
    tp: number;
    fp: number;
    tn: number;
    fn: number;
  };
  ensembleWeights?: {
    catboost: number;
    lstm: number;
  };
  trainingDataset?: string;
  trainingSamples?: number;
  trainedAt: Date;
  isActive: boolean;
  createdAt: Date;
}

const ModelVersionSchema = new Schema<IModelVersion>(
  {
    name: { type: String, required: true },
    version: { type: String, required: true },
    type: { type: String, enum: ['CATBOOST', 'XGBOOST', 'LSTM', 'ENSEMBLE'], required: true },
    accuracy: { type: Number, required: true },
    precision: { type: Number, required: true },
    recall: { type: Number, required: true },
    f1: { type: Number, required: true },
    rocAuc: { type: Number, required: true },
    brierScore: { type: Number, default: 0.08 },
    confusionMatrix: {
      tp: { type: Number, default: 0 },
      fp: { type: Number, default: 0 },
      tn: { type: Number, default: 0 },
      fn: { type: Number, default: 0 }
    },
    ensembleWeights: {
      catboost: { type: Number, default: 0.7 },
      lstm: { type: Number, default: 0.3 }
    },
    trainingDataset: { type: String, default: 'CRM Historical Dataset v1' },
    trainingSamples: { type: Number, default: 20000 },
    trainedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: false }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ModelVersionSchema.index({ type: 1, isActive: 1 });

export const ModelVersion = mongoose.model<IModelVersion>('ModelVersion', ModelVersionSchema);
