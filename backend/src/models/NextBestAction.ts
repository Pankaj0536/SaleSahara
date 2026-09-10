import mongoose, { Document, Schema, Types } from 'mongoose';

export interface INextBestAction extends Document {
  _id: Types.ObjectId;
  leadId: Types.ObjectId;
  organizationId: Types.ObjectId;
  action: string;
  channel: string;
  reason: string;
  confidence: number;
  generatedBy: 'rule' | 'ai';
  status: 'pending' | 'completed' | 'dismissed';
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NextBestActionSchema = new Schema<INextBestAction>(
  {
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    action: { type: String, required: true },
    channel: { type: String, required: true, default: 'email' },
    reason: { type: String, required: true },
    confidence: { type: Number, required: true, min: 0, max: 1 },
    generatedBy: { type: String, enum: ['rule', 'ai'], default: 'rule' },
    status: { type: String, enum: ['pending', 'completed', 'dismissed'], default: 'pending' },
    expiresAt: { type: Date }
  },
  { timestamps: true }
);

NextBestActionSchema.index({ organizationId: 1, leadId: 1, status: 1 });

export const NextBestAction = mongoose.model<INextBestAction>('NextBestAction', NextBestActionSchema);
