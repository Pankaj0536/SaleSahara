import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  industry: string;
  companySize?: string;
  currency: string;
  timezone: string;
  logo?: string;
  settings?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true, trim: true },
    industry: { type: String, required: true, trim: true },
    companySize: { type: String, default: '10-50' },
    currency: { type: String, default: 'USD' },
    timezone: { type: String, default: 'UTC' },
    logo: { type: String },
    settings: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

export const Organization = mongoose.model<IOrganization>('Organization', OrganizationSchema);
