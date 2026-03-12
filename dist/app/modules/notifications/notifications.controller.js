"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationsController = exports.NotificationsController = void 0;
const response_1 = require("../../../shared/utils/response");
const constants_1 = require("../../../config/constants");
const notifications_service_1 = require("./notifications.service");
class NotificationsController {
    /**
     * Get employee platform notifications
     */
    async getEmployeeNotifications(req, res, next) {
        try {
            await this.getNotificationsByApp(req, res, 'EMPLOYEE');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    /**
     * Get HR platform notifications
     */
    async getHRNotifications(req, res, next) {
        try {
            await this.getNotificationsByApp(req, res, 'HR');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    /**
     * Internal helper to fetch notifications by targetApp
     */
    async getNotificationsByApp(req, res, targetApp) {
        const userId = req.user._id.toString();
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { notifications, total, unreadCount } = await notifications_service_1.notificationsService.getUserNotifications(userId, targetApp, page, limit);
        res.status(constants_1.HTTP_STATUS.OK).json({
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
    async getNotifications(req, res, next) {
        try {
            const userId = req.user._id.toString();
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const targetApp = req.query.targetApp;
            const { notifications, total, unreadCount } = await notifications_service_1.notificationsService.getUserNotifications(userId, targetApp, page, limit);
            res.status(constants_1.HTTP_STATUS.OK).json({
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
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    /**
     * Mark a specific notification as read
     */
    async markAsRead(req, res, next) {
        try {
            const notificationId = req.params.id;
            const userId = req.user._id.toString();
            await notifications_service_1.notificationsService.markAsRead(notificationId, userId);
            (0, response_1.sendSuccessResponse)(res, 'Notification marked as read');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
    /**
     * Mark all employee notifications as read
     */
    async markAllEmployeeAsRead(req, res, next) {
        try {
            const userId = req.user._id.toString();
            await notifications_service_1.notificationsService.markAllAsRead(userId, 'EMPLOYEE');
            (0, response_1.sendSuccessResponse)(res, 'All employee notifications marked as read');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    /**
     * Mark all HR notifications as read
     */
    async markAllHRAsRead(req, res, next) {
        try {
            const userId = req.user._id.toString();
            await notifications_service_1.notificationsService.markAllAsRead(userId, 'HR');
            (0, response_1.sendSuccessResponse)(res, 'All HR notifications marked as read');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    /**
     * Mark all notifications as read (legacy)
     */
    async markAllAsRead(req, res, next) {
        try {
            const userId = req.user._id.toString();
            await notifications_service_1.notificationsService.markAllAsRead(userId);
            (0, response_1.sendSuccessResponse)(res, 'All notifications marked as read');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
}
exports.NotificationsController = NotificationsController;
exports.notificationsController = new NotificationsController();
//# sourceMappingURL=notifications.controller.js.map