"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationDAL = exports.NotificationDAL = void 0;
const notification_model_1 = require("../models/notification.model");
const notification_settings_model_1 = require("../models/notification-settings.model");
class NotificationDAL {
    /**
     * Create a new notification
     */
    async create(data) {
        return await notification_model_1.NotificationModel.create(data);
    }
    /**
     * Find all notifications for a user with pagination and optional targetApp filter
     */
    async findAllForUser(userId, options) {
        const page = options.page || 1;
        const limit = options.limit || 10;
        const skip = (page - 1) * limit;
        const targetApp = options.targetApp;
        const query = { userId };
        if (targetApp) {
            query.targetApp = targetApp;
        }
        const [notifications, total, unreadCount] = await Promise.all([
            notification_model_1.NotificationModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            notification_model_1.NotificationModel.countDocuments(query),
            notification_model_1.NotificationModel.countDocuments({ ...query, isRead: false })
        ]);
        return { notifications, total, unreadCount };
    }
    /**
     * Mark a notification as read
     */
    async markAsRead(id, userId) {
        return await notification_model_1.NotificationModel.findOneAndUpdate({ _id: id, userId }, { $set: { isRead: true } }, { new: true });
    }
    /**
     * Mark all notifications as read for a user, optionally filtered by targetApp
     */
    async markAllAsRead(userId, targetApp) {
        const query = { userId, isRead: false };
        if (targetApp) {
            query.targetApp = targetApp;
        }
        return await notification_model_1.NotificationModel.updateMany(query, { $set: { isRead: true } });
    }
    /**
     * Get user notification settings
     */
    async getSettings(userId) {
        return await notification_settings_model_1.NotificationSettingsModel.findOne({ userId });
    }
    /**
     * Update user notification settings
     */
    async updateSettings(userId, settings) {
        return await notification_settings_model_1.NotificationSettingsModel.findOneAndUpdate({ userId }, { $set: settings }, { new: true, upsert: true });
    }
}
exports.NotificationDAL = NotificationDAL;
exports.notificationDAL = new NotificationDAL();
//# sourceMappingURL=notification.dal.js.map