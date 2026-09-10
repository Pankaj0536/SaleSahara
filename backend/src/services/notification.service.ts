import { Notification, INotification } from '../models/Notification';
import { Types } from 'mongoose';

export class NotificationService {
  static async getNotifications(
    organizationId: string,
    userId?: string,
    limit: number = 50
  ): Promise<any[]> {
    const query: any = { organizationId: new Types.ObjectId(organizationId) };
    if (userId) {
      query.$or = [{ userId: new Types.ObjectId(userId) }, { userId: { $exists: false } }];
    }

    return Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  static async markAsRead(id: string, organizationId: string): Promise<boolean> {
    const res = await Notification.updateOne(
      { _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) },
      { $set: { read: true } }
    );
    return res.modifiedCount > 0;
  }

  static async markAllAsRead(organizationId: string, userId?: string): Promise<number> {
    const query: any = { organizationId: new Types.ObjectId(organizationId), read: false };
    if (userId) {
      query.userId = new Types.ObjectId(userId);
    }
    const res = await Notification.updateMany(query, { $set: { read: true } });
    return res.modifiedCount;
  }
}
