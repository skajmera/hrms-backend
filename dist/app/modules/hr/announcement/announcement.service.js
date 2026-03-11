"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.announcementService = exports.AnnouncementService = void 0;
const announcement_dal_1 = require("../../../../shared/dal/announcement.dal");
class AnnouncementService {
    async createAnnouncement(announcementData) {
        return await announcement_dal_1.announcementDAL.create(announcementData);
    }
    async getAnnouncementById(id, userId) {
        const announcement = await announcement_dal_1.announcementDAL.findById(id);
        if (!announcement) {
            throw new Error('Announcement not found');
        }
        return userId ? this.injectLikedField(announcement, userId) : announcement;
    }
    async getAllAnnouncements(filters, options, userId) {
        // Normalize and parse query filters here so controller stays thin and consistent
        const { startDate, expiryDate, announcementType, ...rest } = filters || {};
        const queryFilters = { ...rest };
        if (startDate) {
            // fetch announcements starting on/after provided date
            queryFilters.startDate = { $gte: new Date(startDate) };
        }
        if (expiryDate) {
            // fetch announcements expiring on/before provided date
            queryFilters.expiryDate = { $lte: new Date(expiryDate) };
        }
        if (announcementType) {
            queryFilters.announcementType = announcementType;
        }
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
        // Announcement liked status
        a.liked = a.likes?.some((id) => (id._id || id).toString() === userId.toString()) || false;
        // Comments liked status
        if (a.comments) {
            a.comments = a.comments.map((c) => ({
                ...c,
                liked: c.likes?.some((id) => (id._id || id).toString() === userId.toString()) || false,
                replies: c.replies ? c.replies.map((r) => ({
                    ...r,
                    liked: r.likes?.some((id) => (id._id || id).toString() === userId.toString()) || false
                })) : []
            }));
        }
        return a;
    }
}
exports.AnnouncementService = AnnouncementService;
exports.announcementService = new AnnouncementService();
//# sourceMappingURL=announcement.service.js.map