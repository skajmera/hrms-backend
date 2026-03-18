import { NotificationType } from '../../../shared/interfaces/notification.interface';
import { Types } from 'mongoose';
interface INotificationPayload {
    userId: string | Types.ObjectId;
    type: NotificationType | string;
    title: string;
    message: string;
    targetApp?: 'EMPLOYEE' | 'HR';
    data?: any;
}
export declare class NotificationsService {
    private pickUserId;
    /**
     * Get paginated notifications for the authenticated user and platform
     */
    getUserNotifications(userId: string, targetApp?: 'EMPLOYEE' | 'HR', page?: number, limit?: number): Promise<{
        notifications: (import("mongoose").FlattenMaps<import("../../../shared/interfaces/notification.interface").INotification> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        unreadCount: number;
    }>;
    /**
     * Mark a single notification as read
     */
    markAsRead(notificationId: string, userId: string): Promise<import("../../../shared/interfaces/notification.interface").INotification>;
    /**
     * Mark all of a user's unread notifications as read for a platform
     */
    markAllAsRead(userId: string, targetApp?: 'EMPLOYEE' | 'HR'): Promise<import("mongoose").UpdateWriteOpResult>;
    /**
     * Send notification
     */
    sendNotification(notification: INotificationPayload): Promise<void>;
    /**
     * Send bulk notifications
     */
    sendBulkNotifications(notifications: INotificationPayload[]): Promise<void>;
}
export declare const notificationsService: NotificationsService;
export {};
//# sourceMappingURL=notifications.service.d.ts.map