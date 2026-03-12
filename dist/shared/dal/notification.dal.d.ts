import { INotification } from '../interfaces/notification.interface';
import { IPaginationOptions } from '../interfaces/common.interface';
import { Types } from 'mongoose';
export declare class NotificationDAL {
    /**
     * Create a new notification
     */
    create(data: Partial<INotification>): Promise<INotification>;
    /**
     * Find all notifications for a user with pagination and optional targetApp filter
     */
    findAllForUser(userId: string, options: IPaginationOptions & {
        targetApp?: 'EMPLOYEE' | 'HR';
    }): Promise<{
        notifications: (import("mongoose").FlattenMaps<INotification> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        unreadCount: number;
    }>;
    /**
     * Mark a notification as read
     */
    markAsRead(id: string, userId: string): Promise<INotification | null>;
    /**
     * Mark all notifications as read for a user, optionally filtered by targetApp
     */
    markAllAsRead(userId: string, targetApp?: 'EMPLOYEE' | 'HR'): Promise<import("mongoose").UpdateWriteOpResult>;
    /**
     * Get user notification settings
     */
    getSettings(userId: string | Types.ObjectId): Promise<(import("mongoose").Document<unknown, {}, import("../interfaces/settings.interface").INotificationSettings, {}, {}> & import("../interfaces/settings.interface").INotificationSettings & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    /**
     * Update user notification settings
     */
    updateSettings(userId: string | Types.ObjectId, settings: any): Promise<import("mongoose").Document<unknown, {}, import("../interfaces/settings.interface").INotificationSettings, {}, {}> & import("../interfaces/settings.interface").INotificationSettings & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
export declare const notificationDAL: NotificationDAL;
//# sourceMappingURL=notification.dal.d.ts.map