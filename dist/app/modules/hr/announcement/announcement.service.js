"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.announcementService = exports.AnnouncementService = void 0;
const announcement_dal_1 = require("../../../../shared/dal/announcement.dal");
const user_dal_1 = require("../../../../shared/dal/user.dal");
const notifications_service_1 = require("../../notifications/notifications.service");
const notification_interface_1 = require("../../../../shared/interfaces/notification.interface");
class AnnouncementService {
    async createAnnouncement(announcementData) {
        const announcement = await announcement_dal_1.announcementDAL.create(announcementData);
        // --- TRIGGER NOTIFICATIONS FOR TARGET AUDIENCE ---
        try {
            if (announcement.isActive) {
                let targetUserIds = [];
                if (announcement.targetAudience.isGlobal) {
                    // Notify everyone (active users)
                    const allUsers = await user_dal_1.userDAL.findAll({ isActive: true }, { limit: 2000, page: 1 });
                    targetUserIds = allUsers.users.map(u => u._id.toString());
                }
                else {
                    // Notify specific audience
                    const filters = { isActive: true, $or: [] };
                    if (announcement.targetAudience.roles?.length) {
                        filters.$or.push({ role: { $in: announcement.targetAudience.roles } });
                    }
                    if (announcement.targetAudience.departments?.length) {
                        filters.$or.push({ 'professionalDetails.department': { $in: announcement.targetAudience.departments } });
                    }
                    if (announcement.targetAudience.specificUsers?.length) {
                        filters.$or.push({ _id: { $in: announcement.targetAudience.specificUsers } });
                    }
                    if (filters.$or.length > 0) {
                        const users = await user_dal_1.userDAL.findAll(filters, { limit: 1000, page: 1 });
                        targetUserIds = users.users.map(u => u._id.toString());
                    }
                }
                if (targetUserIds.length > 0) {
                    const notificationPayloads = targetUserIds.map(userId => ({
                        userId,
                        type: notification_interface_1.NotificationType.ANNOUNCEMENT,
                        title: 'New Announcement',
                        message: announcement.title,
                        targetApp: 'EMPLOYEE',
                        data: { announcementId: announcement._id }
                    }));
                    await notifications_service_1.notificationsService.sendBulkNotifications(notificationPayloads);
                }
            }
        }
        catch (error) {
            console.error('[AnnouncementService] Failed to send announcement notifications:', error);
        }
        return announcement;
    }
    async getAnnouncementById(id, userId) {
        const announcement = await announcement_dal_1.announcementDAL.findById(id);
        if (!announcement) {
            throw new Error('Announcement not found');
        }
        return userId ? this.injectLikedField(announcement, userId) : announcement;
    }
    async getAllAnnouncements(filters, options, userId, role) {
        const { startDate, expiryDate, announcementType, ...rest } = filters || {};
        const queryFilters = { ...rest };
        if (startDate)
            queryFilters.startDate = { $gte: new Date(startDate) };
        if (expiryDate)
            queryFilters.expiryDate = { $lte: new Date(expiryDate) };
        if (announcementType)
            queryFilters.announcementType = announcementType;
        // Employees/Managers only see active, valid-date announcements
        const isEmployee = role && !['SUPER_ADMIN', 'HR_ADMIN'].includes(role);
        if (isEmployee)
            Object.assign(queryFilters, announcement_dal_1.announcementDAL.getActiveFilter());
        const result = await announcement_dal_1.announcementDAL.findAll(queryFilters, options);
        if (userId) {
            result.announcements = result.announcements.map(a => this.injectLikedField(a, userId));
        }
        return result;
    }
    async updateAnnouncement(id, updateData, userId) {
        const announcement = await announcement_dal_1.announcementDAL.update(id, updateData);
        if (!announcement) {
            throw new Error('Announcement not found');
        }
        return this.injectLikedField(announcement, userId);
    }
    async deleteAnnouncement(id) {
        const announcement = await announcement_dal_1.announcementDAL.delete(id);
        if (!announcement) {
            throw new Error('Announcement not found');
        }
        return announcement;
    }
    async markAsViewed(id, userId) {
        await announcement_dal_1.announcementDAL.markAsViewed(id, userId);
    }
    async togglePin(id, userId) {
        const announcement = await announcement_dal_1.announcementDAL.togglePin(id);
        if (!announcement) {
            throw new Error('Announcement not found');
        }
        return this.injectLikedField(announcement, userId);
    }
    async getActiveAnnouncementsForUser(userId, userRole, userDepartment) {
        const announcements = await announcement_dal_1.announcementDAL.getActiveAnnouncementsForUser(userId, userRole, userDepartment);
        return announcements.map(a => this.injectLikedField(a, userId));
    }
    async getTypedAnnouncements(type, options, userId, role) {
        const isEmployee = !['SUPER_ADMIN', 'HR_ADMIN'].includes(role);
        const result = await announcement_dal_1.announcementDAL.findTypedWithUsers(type, options, isEmployee);
        if (userId) {
            result.announcements = result.announcements.map(a => this.injectLikedField(a, userId));
        }
        return result;
    }
    async toggleLikeAnnouncement(id, userId) {
        const announcement = await announcement_dal_1.announcementDAL.toggleLike(id, userId);
        if (!announcement) {
            throw new Error('Announcement not found');
        }
        return this.injectLikedField(announcement, userId);
    }
    async toggleCommentLikeAnnouncement(id, commentId, userId) {
        const announcement = await announcement_dal_1.announcementDAL.toggleCommentLike(id, commentId, userId);
        if (!announcement) {
            throw new Error('Announcement or comment not found');
        }
        return this.injectLikedField(announcement, userId);
    }
    async addComment(id, userId, content) {
        const announcement = await announcement_dal_1.announcementDAL.addComment(id, userId, content);
        if (!announcement) {
            throw new Error('Announcement not found');
        }
        return this.injectLikedField(announcement, userId);
    }
    async addReplyToComment(id, commentId, userId, content) {
        const announcement = await announcement_dal_1.announcementDAL.addReply(id, commentId, userId, content);
        if (!announcement) {
            throw new Error('Announcement or comment not found');
        }
        return this.injectLikedField(announcement, userId);
    }
    async deleteComment(id, commentId, userId) {
        const announcement = await announcement_dal_1.announcementDAL.deleteComment(id, commentId, userId);
        if (!announcement) {
            throw new Error('Announcement not found or unauthorized to delete this comment');
        }
        return this.injectLikedField(announcement, userId);
    }
    /**
     * Inject runtime 'liked' field for frontend consumption
     */
    injectLikedField(announcement, userId) {
        const a = announcement.toObject ? announcement.toObject() : announcement;
        a.likes = Array.isArray(a.likes) ? a.likes : [];
        a.comments = Array.isArray(a.comments) ? a.comments : [];
        // Announcement liked status
        a.liked = a.likes.some((id) => (id._id || id).toString() === userId.toString());
        // Comments liked status
        a.comments = a.comments.map((c) => {
            const commentLikes = Array.isArray(c?.likes) ? c.likes : [];
            const replies = Array.isArray(c?.replies) ? c.replies : [];
            return {
                ...c,
                likes: commentLikes,
                liked: commentLikes.some((id) => (id?._id || id).toString() === userId.toString()),
                replies: replies.map((r) => {
                    const replyLikes = Array.isArray(r?.likes) ? r.likes : [];
                    return {
                        ...r,
                        likes: replyLikes,
                        liked: replyLikes.some((id) => (id?._id || id).toString() === userId.toString())
                    };
                })
            };
        });
        return a;
    }
}
exports.AnnouncementService = AnnouncementService;
exports.announcementService = new AnnouncementService();
//# sourceMappingURL=announcement.service.js.map