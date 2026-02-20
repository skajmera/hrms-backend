"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationsService = exports.NotificationsService = void 0;
const user_model_1 = require("../models/user.model");
const email_1 = require("../utils/email");
class NotificationsService {
    /**
     * Send notification
     */
    async sendNotification(notification) {
        const user = await user_model_1.UserModel.findById(notification.userId);
        if (!user) {
            throw new Error('User not found');
        }
        // Send email notification
        try {
            await (0, email_1.sendEmail)({
                to: user.email,
                subject: notification.title,
                html: `
          <h2>${notification.title}</h2>
          <p>${notification.message}</p>
        `
            });
        }
        catch (error) {
            console.error('Failed to send notification email:', error);
        }
        // In a real app, you would also:
        // 1. Store notification in database
        // 2. Send push notification
        // 3. Send in-app notification
        // 4. Send SMS if critical
    }
    /**
     * Send bulk notifications
     */
    async sendBulkNotifications(notifications) {
        const promises = notifications.map(notif => this.sendNotification(notif));
        await Promise.allSettled(promises);
    }
}
exports.NotificationsService = NotificationsService;
exports.notificationsService = new NotificationsService();
//# sourceMappingURL=notifications.service.js.map