"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.announcementService = exports.AnnouncementService = void 0;
const announcement_dal_1 = require("../../../../shared/dal/announcement.dal");
class AnnouncementService {
    async createAnnouncement(announcementData) {
        return await announcement_dal_1.announcementDAL.create(announcementData);
    }
    async getAnnouncementById(id) {
        const announcement = await announcement_dal_1.announcementDAL.findById(id);
        if (!announcement) {
            throw new Error('Announcement not found');
        }
        return announcement;
    }
    async getAllAnnouncements(filters, options) {
        return await announcement_dal_1.announcementDAL.findAll(filters, options);
    }
    async updateAnnouncement(id, updateData) {
        const announcement = await announcement_dal_1.announcementDAL.update(id, updateData);
        if (!announcement) {
            throw new Error('Announcement not found');
        }
        return announcement;
    }
    async deleteAnnouncement(id) {
        const announcement = await announcement_dal_1.announcementDAL.delete(id);
        if (!announcement) {
            throw new Error('Announcement not found');
        }
        return announcement;
    }
    async getActiveAnnouncementsForUser(userId, userRole, userDepartment) {
        return await announcement_dal_1.announcementDAL.getActiveAnnouncementsForUser(userId, userRole, userDepartment);
    }
    async markAsViewed(id, userId) {
        await announcement_dal_1.announcementDAL.markAsViewed(id, userId);
    }
    async togglePin(id) {
        const announcement = await announcement_dal_1.announcementDAL.togglePin(id);
        if (!announcement) {
            throw new Error('Announcement not found');
        }
        return announcement;
    }
}
exports.AnnouncementService = AnnouncementService;
exports.announcementService = new AnnouncementService();
//# sourceMappingURL=announcement.service.js.map