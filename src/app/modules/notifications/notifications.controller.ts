import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../shared/middlewares/auth.middleware';
import { sendSuccessResponse, sendErrorResponse } from '../../../shared/utils/response';
import { HTTP_STATUS } from '../../../config/constants';
import { notificationsService } from './notifications.service';

export class NotificationsController {
    /**
     * Get employee platform notifications
     */
    async getEmployeeNotifications(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.getNotificationsByApp(req, res, 'EMPLOYEE');
        } catch (error: any) {
            sendErrorResponse(res, error.message);
        }
    }

    /**
     * Get HR platform notifications
     */
    async getHRNotifications(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.getNotificationsByApp(req, res, 'HR');
        } catch (error: any) {
            sendErrorResponse(res, error.message);
        }
    }

    /**
     * Internal helper to fetch notifications by targetApp
     */
    private async getNotificationsByApp(req: AuthRequest, res: Response, targetApp: 'EMPLOYEE' | 'HR'): Promise<void> {
        const userId = req.user._id.toString();
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const { notifications, total, unreadCount } = await notificationsService.getUserNotifications(userId, targetApp, page, limit);

        res.status(HTTP_STATUS.OK).json({
            status: 'success',
            message: `${targetApp} notifications retrieved successfully`,
            data: notifications,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            },
            unreadCount
        });
    }

    /**
     * Get all notifications (legacy/generic)
     */
    async getNotifications(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user._id.toString();
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const targetApp = req.query.targetApp as 'EMPLOYEE' | 'HR';

            const { notifications, total, unreadCount } = await notificationsService.getUserNotifications(userId, targetApp, page, limit);

            res.status(HTTP_STATUS.OK).json({
                status: 'success',
                message: 'Notifications retrieved successfully',
                data: notifications,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                },
                unreadCount
            });
        } catch (error: any) {
            sendErrorResponse(res, error.message);
        }
    }

    /**
     * Mark a specific notification as read
     */
    async markAsRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const notificationId = req.params.id;
            const userId = req.user._id.toString();

            await notificationsService.markAsRead(notificationId, userId);
            sendSuccessResponse(res, 'Notification marked as read');
        } catch (error: any) {
            sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
        }
    }

    /**
     * Mark all employee notifications as read
     */
    async markAllEmployeeAsRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user._id.toString();
            await notificationsService.markAllAsRead(userId, 'EMPLOYEE');
            sendSuccessResponse(res, 'All employee notifications marked as read');
        } catch (error: any) {
            sendErrorResponse(res, error.message);
        }
    }

    /**
     * Mark all HR notifications as read
     */
    async markAllHRAsRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user._id.toString();
            await notificationsService.markAllAsRead(userId, 'HR');
            sendSuccessResponse(res, 'All HR notifications marked as read');
        } catch (error: any) {
            sendErrorResponse(res, error.message);
        }
    }

    /**
     * Mark all notifications as read (legacy)
     */
    async markAllAsRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user._id.toString();
            await notificationsService.markAllAsRead(userId);
            sendSuccessResponse(res, 'All notifications marked as read');
        } catch (error: any) {
            sendErrorResponse(res, error.message);
        }
    }
}

export const notificationsController = new NotificationsController();
