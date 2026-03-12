import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../shared/middlewares/auth.middleware';
export declare class NotificationsController {
    /**
     * Get employee platform notifications
     */
    getEmployeeNotifications(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get HR platform notifications
     */
    getHRNotifications(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Internal helper to fetch notifications by targetApp
     */
    private getNotificationsByApp;
    /**
     * Get all notifications (legacy/generic)
     */
    getNotifications(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Mark a specific notification as read
     */
    markAsRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Mark all employee notifications as read
     */
    markAllEmployeeAsRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Mark all HR notifications as read
     */
    markAllHRAsRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Mark all notifications as read (legacy)
     */
    markAllAsRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const notificationsController: NotificationsController;
//# sourceMappingURL=notifications.controller.d.ts.map