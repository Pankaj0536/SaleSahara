import mongoose, { Document, Schema, Types } from 'mongoose';

export interface INotification extends Document {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  userId?: Types.ObjectId;
  type: string;
  title: string;
  message: string;
  read: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false, index: true },
    metadata: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

NotificationSchema.index({ organizationId: 1, userId: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
