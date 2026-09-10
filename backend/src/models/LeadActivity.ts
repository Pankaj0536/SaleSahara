import mongoose, { Document, Schema, Types } from 'mongoose';

export type ActivityType =
  | 'website_visit'
  | 'pricing_visit'
  | 'product_visit'
  | 'email_open'
  | 'email_click'
  | 'email_reply'
  | 'demo_request'
  | 'form_submission'
  | 'phone_call'
  | 'meeting'
  | 'document_download'
  | 'whatsapp_click';

export interface ILeadActivity extends Document {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  leadId: Types.ObjectId;
  type: ActivityType;
  timestamp: Date;
  metadata: Record<string, any>;
  createdAt: Date;
}

const LeadActivitySchema = new Schema<ILeadActivity>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    type: {
      type: String,
      required: true,
      enum: [
        'website_visit',
        'pricing_visit',
        'product_visit',
        'email_open',
        'email_click',
        'email_reply',
        'demo_request',
        'form_submission',
        'phone_call',
        'meeting',
        'document_download',
        'whatsapp_click'
      ]
    },
    timestamp: { type: Date, default: Date.now, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

LeadActivitySchema.index({ organizationId: 1, leadId: 1, timestamp: -1 });

export const LeadActivity = mongoose.model<ILeadActivity>('LeadActivity', LeadActivitySchema);
