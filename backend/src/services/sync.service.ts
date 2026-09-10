import { SyncOperation, ISyncOperation } from '../models/SyncOperation';
import { Lead } from '../models/Lead';
import { Types } from 'mongoose';
import { logger } from '../utils/logger';

export interface SyncPushItem {
  operationId: string;
  entity: 'lead' | 'activity';
  entityId?: string;
  action: 'create' | 'update' | 'delete';
  payload: Record<string, any>;
  clientTimestamp: string | Date;
}

export class SyncService {
  static async pushOperations(
    organizationId: string,
    userId: string,
    operations: SyncPushItem[]
  ): Promise<{
    processed: number;
    synced: number;
    conflicts: any[];
    errors: any[];
  }> {
    const results = {
      processed: operations.length,
      synced: 0,
      conflicts: [] as any[],
      errors: [] as any[]
    };

    for (const op of operations) {
      try {
        // Idempotency check
        const existingOp = await SyncOperation.findOne({ operationId: op.operationId });
        if (existingOp) {
          logger.info(`Skipping duplicate sync operation: ${op.operationId}`);
          results.synced++;
          continue;
        }

        const clientDate = new Date(op.clientTimestamp);

        if (op.entity === 'lead') {
          if (op.action === 'create') {
            const lead = await Lead.create({
              ...op.payload,
              organizationId: new Types.ObjectId(organizationId)
            });

            await SyncOperation.create({
              organizationId: new Types.ObjectId(organizationId),
              userId: new Types.ObjectId(userId),
              operationId: op.operationId,
              entity: 'lead',
              entityId: lead._id.toString(),
              action: 'create',
              payload: op.payload,
              clientTimestamp: clientDate,
              status: 'SYNCED'
            });
            results.synced++;
          } else if (op.action === 'update' && op.entityId) {
            const serverLead = await Lead.findOne({
              _id: op.entityId,
              organizationId
            });

            if (!serverLead) {
              results.errors.push({ operationId: op.operationId, error: 'Lead not found.' });
              continue;
            }

            // Conflict detection: if server updatedAt is significantly ahead of clientTimestamp
            if (serverLead.updatedAt && serverLead.updatedAt.getTime() > clientDate.getTime() + 2000) {
              results.conflicts.push({
                operationId: op.operationId,
                status: 'CONFLICT',
                entityId: op.entityId,
                serverVersion: serverLead.toObject(),
                clientVersion: op.payload
              });

              await SyncOperation.create({
                organizationId: new Types.ObjectId(organizationId),
                userId: new Types.ObjectId(userId),
                operationId: op.operationId,
                entity: 'lead',
                entityId: op.entityId,
                action: 'update',
                payload: op.payload,
                clientTimestamp: clientDate,
                status: 'FAILED',
                conflictDetails: { serverUpdatedAt: serverLead.updatedAt, clientDate }
              });
              continue;
            }

            // Last-write-wins update
            Object.assign(serverLead, op.payload);
            await serverLead.save();

            await SyncOperation.create({
              organizationId: new Types.ObjectId(organizationId),
              userId: new Types.ObjectId(userId),
              operationId: op.operationId,
              entity: 'lead',
              entityId: op.entityId,
              action: 'update',
              payload: op.payload,
              clientTimestamp: clientDate,
              status: 'SYNCED'
            });
            results.synced++;
          } else if (op.action === 'delete' && op.entityId) {
            await Lead.deleteOne({ _id: op.entityId, organizationId });
            await SyncOperation.create({
              organizationId: new Types.ObjectId(organizationId),
              userId: new Types.ObjectId(userId),
              operationId: op.operationId,
              entity: 'lead',
              entityId: op.entityId,
              action: 'delete',
              payload: {},
              clientTimestamp: clientDate,
              status: 'SYNCED'
            });
            results.synced++;
          }
        }
      } catch (err: any) {
        logger.error(`Error processing sync operation ${op.operationId}:`, err);
        results.errors.push({ operationId: op.operationId, error: err.message });
      }
    }

    return results;
  }

  static async pullChanges(organizationId: string, since?: string | Date) {
    const query: any = { organizationId: new Types.ObjectId(organizationId) };
    if (since) {
      query.updatedAt = { $gt: new Date(since) };
    }

    const leads = await Lead.find(query).lean();
    return {
      serverTimestamp: new Date(),
      count: leads.length,
      leads
    };
  }

  static async getStatus(organizationId: string) {
    const lastOp = await SyncOperation.findOne({ organizationId }).sort({ serverTimestamp: -1 }).lean();
    return {
      status: 'healthy',
      lastSyncedAt: lastOp?.serverTimestamp || null,
      lastOperationId: lastOp?.operationId || null
    };
  }
}
