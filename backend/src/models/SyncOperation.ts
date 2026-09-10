import mongoose, { Document, Schema, Types } from 'mongoose';

export type SyncStatus = 'PENDING' | 'SYNCED' | 'FAILED';

export interface ISyncOperation extends Document {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  userId: Types.ObjectId;
  operationId: string;
  entity: string;
  entityId?: string;
  action: 'create' | 'update' | 'delete';
  payload: Record<string, any>;
  clientTimestamp: Date;
  serverTimestamp: Date;
  status: SyncStatus;
  conflictDetails?: Record<string, any>;
  createdAt: Date;
}

const SyncOperationSchema = new Schema<ISyncOperation>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    operationId: { type: String, required: true, unique: true, index: true },
    entity: { type: String, required: true },
    entityId: { type: String },
    action: { type: String, enum: ['create', 'update', 'delete'], required: true },
    payload: { type: Schema.Types.Mixed, default: {} },
    clientTimestamp: { type: Date, required: true },
    serverTimestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['PENDING', 'SYNCED', 'FAILED'], default: 'SYNCED' },
    conflictDetails: { type: Schema.Types.Mixed }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

SyncOperationSchema.index({ organizationId: 1, serverTimestamp: -1 });

export const SyncOperation = mongoose.model<ISyncOperation>('SyncOperation', SyncOperationSchema);
