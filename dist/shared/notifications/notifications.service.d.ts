interface INotification {
    userId: string;
    type: 'LEAVE_APPROVED' | 'LEAVE_REJECTED' | 'PAYROLL_GENERATED' | 'ANNOUNCEMENT' | 'BIRTHDAY' | 'WORK_ANNIVERSARY';
    title: string;
    message: string;
    data?: any;
}
export declare class NotificationsService {
    /**
     * Send notification
     */
    sendNotification(notification: INotification): Promise<void>;
    /**
     * Send bulk notifications
     */
    sendBulkNotifications(notifications: INotification[]): Promise<void>;
}
export declare const notificationsService: NotificationsService;
export {};
//# sourceMappingURL=notifications.service.d.ts.map