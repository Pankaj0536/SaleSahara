import mongoose, { Document, Schema, Types } from 'mongoose';

export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'CREATE_LEAD'
  | 'UPDATE_LEAD'
  | 'DELETE_LEAD'
  | 'IMPORT_DATA'
  | 'RUN_PREDICTION'
  | 'GENERATE_AI_ACTION'
  | 'EXPORT_DATA'
  | 'SYNC_DATA'
  | 'MODEL_RETRAIN';

export interface IAuditLog extends Document {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  userId?: Types.ObjectId;
  action: AuditAction;
  entity: string;
  entityId?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: String },
    metadata: { type: Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now, index: true }
  },
  { timestamps: false }
);

AuditLogSchema.index({ organizationId: 1, timestamp: -1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
