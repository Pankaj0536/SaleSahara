import mongoose, { Document, Schema, Types } from 'mongoose';

export type ImportStatus = 'UPLOADING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface IImportError {
  row: number;
  email?: string;
  field?: string;
  message: string;
}

export interface IImportJob extends Document {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  userId: Types.ObjectId;
  filename: string;
  fileType: string;
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  duplicateRows: number;
  status: ImportStatus;
  importErrors: IImportError[];
  createdAt: Date;
  completedAt?: Date;
}

const ImportJobSchema = new Schema<IImportJob>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    filename: { type: String, required: true },
    fileType: { type: String, required: true },
    totalRows: { type: Number, default: 0 },
    successfulRows: { type: Number, default: 0 },
    failedRows: { type: Number, default: 0 },
    duplicateRows: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['UPLOADING', 'PROCESSING', 'COMPLETED', 'FAILED'],
      default: 'UPLOADING'
    },
    importErrors: [
      {
        row: { type: Number, required: true },
        email: { type: String },
        field: { type: String },
        message: { type: String, required: true }
      }
    ],
    completedAt: { type: Date }
  },
  { timestamps: true }
);

ImportJobSchema.index({ organizationId: 1, createdAt: -1 });

export const ImportJob = mongoose.model<IImportJob>('ImportJob', ImportJobSchema);
