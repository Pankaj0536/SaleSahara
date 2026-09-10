import mongoose, { Document, Schema, Types } from 'mongoose';

export type MessageTone = 'professional' | 'friendly' | 'concise' | 'urgent';

export interface IAIMessage extends Document {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  leadId: Types.ObjectId;
  actionId?: Types.ObjectId;
  content: string;
  tone: MessageTone;
  generatedAt: Date;
  createdBy?: Types.ObjectId;
}

const AIMessageSchema = new Schema<IAIMessage>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    actionId: { type: Schema.Types.ObjectId, ref: 'NextBestAction' },
    content: { type: String, required: true },
    tone: {
      type: String,
      enum: ['professional', 'friendly', 'concise', 'urgent'],
      default: 'professional'
    },
    generatedAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AIMessageSchema.index({ organizationId: 1, leadId: 1, generatedAt: -1 });

export const AIMessage = mongoose.model<IAIMessage>('AIMessage', AIMessageSchema);
