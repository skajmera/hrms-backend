import { NotificationModel } from '../models/notification.model';
import { NotificationSettingsModel } from '../models/notification-settings.model';
import { INotification } from '../interfaces/notification.interface';
import { IPaginationOptions } from '../interfaces/common.interface';
import { Types } from 'mongoose';

export class NotificationDAL {
    /**
     * Create a new notification
     */
    async create(data: Partial<INotification>): Promise<INotification> {
        return await NotificationModel.create(data);
    }

    /**
     * Find all notifications for a user with pagination and optional targetApp filter
     */
    async findAllForUser(userId: string, options: IPaginationOptions & { targetApp?: 'EMPLOYEE' | 'HR' }) {
        const page = options.page || 1;
        const limit = options.limit || 10;
        const skip = (page - 1) * limit;
        const targetApp = options.targetApp;

        const query: any = { userId };
        if (targetApp) {
            query.targetApp = targetApp;
        }

        const [notifications, total, unreadCount] = await Promise.all([
            NotificationModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            NotificationModel.countDocuments(query),
            NotificationModel.countDocuments({ ...query, isRead: false })
        ]);

        return { notifications, total, unreadCount };
    }

    /**
     * Mark a notification as read
     */
    async markAsRead(id: string, userId: string): Promise<INotification | null> {
        return await NotificationModel.findOneAndUpdate(
            { _id: id, userId },
            { $set: { isRead: true } },
            { new: true }
        );
    }

    /**
     * Mark all notifications as read for a user, optionally filtered by targetApp
     */
    async markAllAsRead(userId: string, targetApp?: 'EMPLOYEE' | 'HR') {
        const query: any = { userId, isRead: false };
        if (targetApp) {
            query.targetApp = targetApp;
        }
        return await NotificationModel.updateMany(
            query,
            { $set: { isRead: true } }
        );
    }

    /**
     * Get user notification settings
     */
    async getSettings(userId: string | Types.ObjectId) {
        return await NotificationSettingsModel.findOne({ userId });
    }

    /**
     * Update user notification settings
     */
    async updateSettings(userId: string | Types.ObjectId, settings: any) {
        return await NotificationSettingsModel.findOneAndUpdate(
            { userId },
            { $set: settings },
            { new: true, upsert: true }
        );
    }
}

export const notificationDAL = new NotificationDAL();
