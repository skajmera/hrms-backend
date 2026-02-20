"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.announcementDAL = exports.AnnouncementDAL = void 0;
const announcement_model_1 = require("../models/announcement.model");
class AnnouncementDAL {
    /**
     * Create announcement
     */
    async create(announcementData) {
        return await announcement_model_1.AnnouncementModel.create(announcementData);
    }
    /**
     * Find announcement by ID
     */
    async findById(id) {
        return await announcement_model_1.AnnouncementModel.findById(id)
            .populate('createdBy', 'firstName lastName email')
            .populate('targetAudience.departments', 'name code')
            .populate('targetAudience.specificUsers', 'firstName lastName email');
    }
    /**
     * Find all announcements
     */
    async findAll(filters = {}, options = {}) {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
        const skip = (page - 1) * limit;
        const announcements = await announcement_model_1.AnnouncementModel.find(filters)
            .populate('createdBy', 'firstName lastName')
            .populate('targetAudience.departments', 'name code')
            .sort({ isPinned: -1, [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit);
        const total = await announcement_model_1.AnnouncementModel.countDocuments(filters);
        return { announcements, total };
    }
    /**
     * Update announcement
     */
    async update(id, updateData) {
        return await announcement_model_1.AnnouncementModel.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true })
            .populate('createdBy', 'firstName lastName');
    }
    /**
     * Delete announcement
     */
    async delete(id) {
        return await announcement_model_1.AnnouncementModel.findByIdAndDelete(id);
    }
    /**
     * Get active announcements for a user
     */
    async getActiveAnnouncementsForUser(userId, userRole, userDepartmentId) {
        const now = new Date();
        return await announcement_model_1.AnnouncementModel.find({
            isActive: true,
            startDate: { $lte: now },
            $and: [
                {
                    $or: [
                        { expiryDate: { $exists: false } },
                        { expiryDate: { $gte: now } }
                    ]
                },
                {
                    $or: [
                        { "targetAudience.isGlobal": true },
                        { "targetAudience.roles": userRole },
                        { "targetAudience.departments": userDepartmentId },
                        { "targetAudience.specificUsers": userId }
                    ]
                }
            ]
        })
            .populate('createdBy', 'firstName lastName')
            .sort({ isPinned: -1, priority: -1, createdAt: -1 });
    }
    /**
     * Mark announcement as viewed
     */
    async markAsViewed(id, userId) {
        await announcement_model_1.AnnouncementModel.findByIdAndUpdate(id, {
            $addToSet: {
                viewedBy: {
                    userId,
                    viewedAt: new Date()
                }
            }
        });
    }
    /**
     * Pin/Unpin announcement
     */
    async togglePin(id) {
        const announcement = await announcement_model_1.AnnouncementModel.findById(id);
        if (announcement) {
            announcement.isPinned = !announcement.isPinned;
            return await announcement.save();
        }
        return null;
    }
    /**
     * Get pinned announcements
     */
    async getPinnedAnnouncements() {
        return await announcement_model_1.AnnouncementModel.find({ isPinned: true, isActive: true })
            .populate('createdBy', 'firstName lastName')
            .sort({ createdAt: -1 });
    }
}
exports.AnnouncementDAL = AnnouncementDAL;
exports.announcementDAL = new AnnouncementDAL();
//# sourceMappingURL=announcement.dal.js.map