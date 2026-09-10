import csv from 'csv-parser';
import * as xlsx from 'xlsx';
import { Readable } from 'stream';
import { Lead } from '../models/Lead';
import { ImportJob, IImportError } from '../models/ImportJob';
import { Types } from 'mongoose';
import { logger } from '../utils/logger';

const COLUMN_ALIASES: Record<string, string> = {
  first_name: 'firstName',
  'first name': 'firstName',
  firstname: 'firstName',
  last_name: 'lastName',
  'last name': 'lastName',
  lastname: 'lastName',
  email_address: 'email',
  'email address': 'email',
  contact_email: 'email',
  mail: 'email',
  company: 'companyName',
  'company name': 'companyName',
  company_name: 'companyName',
  organization: 'companyName',
  phone_number: 'phone',
  'phone number': 'phone',
  mobile: 'phone',
  deal_value: 'expectedDealValue',
  'deal value': 'expectedDealValue',
  expected_deal_value: 'expectedDealValue',
  expected_value: 'expectedDealValue',
  budget_amount: 'budget',
  job_title: 'jobTitle',
  'job title': 'jobTitle',
  title: 'jobTitle',
  company_size: 'companySize',
  'company size': 'companySize',
  sector: 'industry'
};

export class ImportService {
  private static normalizeRow(rawRow: Record<string, any>): Record<string, any> {
    const normalized: Record<string, any> = {};
    for (const key of Object.keys(rawRow)) {
      const cleanKey = key.trim().toLowerCase();
      const targetField = COLUMN_ALIASES[cleanKey] || key.trim();
      normalized[targetField] = typeof rawRow[key] === 'string' ? rawRow[key].trim() : rawRow[key];
    }
    return normalized;
  }

  static async parseFile(buffer: Buffer, fileType: string): Promise<Record<string, any>[]> {
    if (fileType.includes('csv') || fileType.endsWith('csv')) {
      return new Promise((resolve, reject) => {
        const rows: Record<string, any>[] = [];
        const stream = Readable.from(buffer);
        stream
          .pipe(csv())
          .on('data', (data) => rows.push(data))
          .on('end', () => resolve(rows))
          .on('error', (err) => reject(err));
      });
    } else {
      const workbook = xlsx.read(buffer, { type: 'buffer' });
      const firstSheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[firstSheetName];
      return xlsx.utils.sheet_to_json(sheet);
    }
  }

  static async processImport(
    organizationId: string,
    userId: string,
    filename: string,
    fileType: string,
    buffer: Buffer
  ) {
    const rawRows = await this.parseFile(buffer, fileType);
    const totalRows = rawRows.length;

    const importJob = await ImportJob.create({
      organizationId: new Types.ObjectId(organizationId),
      userId: new Types.ObjectId(userId),
      filename,
      fileType,
      totalRows,
      status: 'PROCESSING'
    });

    const existingLeads = await Lead.find({ organizationId }).select('email').lean();
    const existingEmails = new Set(existingLeads.map((l) => l.email.toLowerCase()));
    const seenEmailsInFile = new Set<string>();

    const validLeadsToInsert: any[] = [];
    const errors: IImportError[] = [];
    let duplicateRows = 0;

    rawRows.forEach((raw, idx) => {
      const rowNumber = idx + 1;
      const row = this.normalizeRow(raw);

      // Email validation
      const email = row.email ? String(row.email).toLowerCase() : '';
      if (!email || !email.includes('@')) {
        errors.push({
          row: rowNumber,
          email,
          field: 'email',
          message: 'Missing or invalid email address.'
        });
        return;
      }

      if (existingEmails.has(email) || seenEmailsInFile.has(email)) {
        duplicateRows++;
        errors.push({
          row: rowNumber,
          email,
          field: 'email',
          message: 'Duplicate email address.'
        });
        return;
      }

      seenEmailsInFile.add(email);

      // Validate required name / company
      const firstName = row.firstName || row.name?.split(' ')[0] || 'Unknown';
      const lastName = row.lastName || row.name?.split(' ').slice(1).join(' ') || 'Lead';
      const companyName = row.companyName || 'Unknown Corp';

      const budget = parseFloat(row.budget) || 0;
      const expectedDealValue = parseFloat(row.expectedDealValue) || parseFloat(row.dealValue) || 0;

      validLeadsToInsert.push({
        organizationId: new Types.ObjectId(organizationId),
        firstName,
        lastName,
        email,
        phone: row.phone || '',
        companyName,
        industry: row.industry || 'Technology',
        jobTitle: row.jobTitle || 'Manager',
        companySize: row.companySize || '51-200',
        location: row.location || 'United States',
        source: row.source || 'import',
        budget,
        expectedDealValue,
        status: 'NEW',
        priority: 'LOW',
        aiScore: 0,
        conversionProbability: 0,
        engagementScore: 0,
        engagementTrend: 'stable',
        confidenceLevel: 'LOW',
        notes: `Imported via ${filename}`
      });
    });

    if (validLeadsToInsert.length > 0) {
      await Lead.insertMany(validLeadsToInsert, { ordered: false });
    }

    const successfulRows = validLeadsToInsert.length;
    const failedRows = errors.length;

    importJob.successfulRows = successfulRows;
    importJob.failedRows = failedRows;
    importJob.duplicateRows = duplicateRows;
    importJob.importErrors = errors.slice(0, 100); // cap logged errors
    importJob.status = 'COMPLETED';
    importJob.completedAt = new Date();
    await importJob.save();

    return {
      jobId: importJob._id,
      totalRows,
      validRows: successfulRows,
      duplicateRows,
      invalidRows: failedRows - duplicateRows,
      errors: importJob.importErrors
    };
  }

  static async getImportStatus(jobId: string, organizationId: string) {
    return ImportJob.findOne({ _id: jobId, organizationId }).lean();
  }
}
