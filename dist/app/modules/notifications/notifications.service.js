"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationsService = exports.NotificationsService = void 0;
const user_model_1 = require("../../../shared/models/user.model");
const notification_dal_1 = require("../../../shared/dal/notification.dal");
const email_1 = require("../../../shared/utils/email");
const firebase_service_1 = require("../../../shared/services/firebase.service");
const notification_interface_1 = require("../../../shared/interfaces/notification.interface");
class NotificationsService {
    pickUserId(raw) {
        const s = raw?._id?.toString?.() ?? raw?.id?.toString?.() ?? raw?.toString?.() ?? String(raw ?? '');
        const m = s.match(/[a-fA-F0-9]{24}/);
        if (!m)
            throw new Error('Invalid notification userId');
        return m[0];
    }
    /**
     * Get paginated notifications for the authenticated user and platform
     */
    async getUserNotifications(userId, targetApp, page = 1, limit = 10) {
        const options = { page, limit, targetApp };
        return await notification_dal_1.notificationDAL.findAllForUser(userId, options);
    }
    /**
     * Mark a single notification as read
     */
    async markAsRead(notificationId, userId) {
        const notification = await notification_dal_1.notificationDAL.markAsRead(notificationId, userId);
        if (!notification)
            throw new Error('Notification not found');
        return notification;
    }
    /**
     * Mark all of a user's unread notifications as read for a platform
     */
    async markAllAsRead(userId, targetApp) {
        return await notification_dal_1.notificationDAL.markAllAsRead(userId, targetApp);
    }
    /**
     * Send notification
     */
    async sendNotification(notification) {
        const user = await user_model_1.UserModel.findById(this.pickUserId(notification.userId));
        if (!user) {
            throw new Error('User not found');
        }
        // --- CHECK USER PREFERENCES BEFORE SENDING OVERRIDE ---
        const prefs = await notification_dal_1.notificationDAL.getSettings(user._id);
        if (prefs) {
            const typeStr = String(notification.type);
            if (typeStr === notification_interface_1.NotificationType.LEAVE_APPROVED && prefs.leaves?.approval === false)
                return;
            if (typeStr === notification_interface_1.NotificationType.LEAVE_REJECTED && prefs.leaves?.rejection === false)
                return;
            if (typeStr === notification_interface_1.NotificationType.LEAVE_REQUESTED && prefs.leaves?.application === false)
                return; // Added for new type
            if (typeStr === notification_interface_1.NotificationType.PAYROLL_GENERATED && prefs.payroll?.payslipGenerated === false)
                return;
            if (typeStr === notification_interface_1.NotificationType.ANNOUNCEMENT && prefs.announcements?.newAnnouncement === false)
                return;
            if (typeStr === notification_interface_1.NotificationType.BIRTHDAY && prefs.reminders?.birthdays === false)
                return;
            if (typeStr === notification_interface_1.NotificationType.WORK_ANNIVERSARY && prefs.reminders?.anniversaries === false)
                return;
            if (typeStr === notification_interface_1.NotificationType.NEW_HIRE && prefs.reminders?.newHiring === false)
                return;
        }
        // 1. Store notification natively in database via DAL
        await notification_dal_1.notificationDAL.create({
            userId: user._id,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            targetApp: notification.targetApp || 'EMPLOYEE',
            data: notification.data || {}
        });
        // 2. Mobile Firebase Push Notification Trigger
        if (user.fcmTokens && user.fcmTokens.length > 0) {
            try {
                await firebase_service_1.firebaseService.sendPushNotification(user.fcmTokens, notification.title, notification.message, {
                    type: notification.type,
                    targetApp: notification.targetApp || 'EMPLOYEE',
                    dataPayload: JSON.stringify(notification.data || {}) // stringified for firebase
                });
            }
            catch (error) {
                console.error('Failed to send Firebase Push notification:', error);
            }
        }
        // 3. Fallback Email sending
        try {
            await (0, email_1.sendEmail)({
                to: user.email,
                subject: notification.title,
                html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #007bff;">${notification.title}</h2>
            <p>${notification.message}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <small style="color: #ed213a;">This is an automated notification from HRMS.</small>
          </div>
        `
            });
        }
        catch (error) {
            console.error('Failed to send notification email:', error);
        }
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