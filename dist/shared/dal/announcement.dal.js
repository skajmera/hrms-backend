"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.announcementDAL = exports.AnnouncementDAL = void 0;
const announcement_model_1 = require("../models/announcement.model");
class AnnouncementDAL {
    /**
     * Create announcement
     */
    async create(announcementData) {
        // Sanitize junk frontend data if announcement is global to prevent CastErrors
        if (announcementData.targetAudience?.isGlobal) {
            announcementData.targetAudience.departments = [];
            announcementData.targetAudience.roles = [];
            announcementData.targetAudience.specificUsers = [];
        }
        return await announcement_model_1.AnnouncementModel.create(announcementData);
    }
    /**
     * Find announcement by ID
     */
    async findById(id) {
        return await announcement_model_1.AnnouncementModel.findById(id)
            .populate('createdBy', 'firstName lastName email profilePicture')
            .populate('targetAudience.departments', 'name code')
            .populate('targetAudience.specificUsers', 'firstName lastName email')
            .populate('likes', 'firstName lastName profilePicture')
            .populate('comments.userId', 'firstName lastName profilePicture')
            .populate('comments.likes', 'firstName lastName profilePicture');
    }
    /**
     * Find all announcements
     */
    async findAll(filters = {}, options = {}) {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
        const skip = (page - 1) * limit;
        const announcements = await announcement_model_1.AnnouncementModel.find(filters)
            .populate('createdBy', 'firstName lastName profilePicture')
            .populate('targetAudience.departments', 'name code')
            .populate('likes', 'firstName lastName profilePicture')
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
            .populate('createdBy', 'firstName lastName profilePicture');
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
            .populate('createdBy', 'firstName lastName profilePicture')
            .populate('likes', 'firstName lastName profilePicture')
            .populate('comments.userId', 'firstName lastName profilePicture')
            .populate('comments.likes', 'firstName lastName profilePicture')
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
            .populate('createdBy', 'firstName lastName profilePicture')
            .populate('likes', 'firstName lastName profilePicture')
            .sort({ createdAt: -1 });
    }
    /**
     * Toggle Like on announcement (Add if not present, remove if present)
     */
    async toggleLike(id, userId) {
        const announcement = await announcement_model_1.AnnouncementModel.findById(id);
        if (!announcement)
            return null;
        const isLiked = announcement.likes.some(id => id.toString() === userId.toString());
        const update = isLiked
            ? { $pull: { likes: userId } }
            : { $addToSet: { likes: userId } };
        return await announcement_model_1.AnnouncementModel.findByIdAndUpdate(id, update, { new: true })
            .populate('likes', 'firstName lastName profilePicture')
            .populate('comments.userId', 'firstName lastName profilePicture')
            .populate('comments.likes', 'firstName lastName profilePicture');
    }
    /**
     * Toggle Like on a comment
     */
    async toggleCommentLike(announcementId, commentId, userId) {
        const announcement = await announcement_model_1.AnnouncementModel.findById(announcementId);
        if (!announcement)
            return null;
        const comment = announcement.comments.find(c => c._id.toString() === commentId.toString());
        if (!comment)
            throw new Error('Comment not found');
        const isLiked = comment.likes.some(id => id.toString() === userId.toString());
        const update = isLiked
            ? { $pull: { "comments.$.likes": userId } }
            : { $addToSet: { "comments.$.likes": userId } };
        return await announcement_model_1.AnnouncementModel.findOneAndUpdate({ _id: announcementId, "comments._id": commentId }, update, { new: true })
            .populate('likes', 'firstName lastName profilePicture')
            .populate('comments.userId', 'firstName lastName profilePicture')
            .populate('comments.likes', 'firstName lastName profilePicture');
    }
    /**
     * Add comment to announcement
     */
    async addComment(id, userId, content) {
        return await announcement_model_1.AnnouncementModel.findByIdAndUpdate(id, {
            $push: {
                comments: {
                    userId,
                    content,
                    likes: [],
                    createdAt: new Date()
                }
            }
        }, { new: true })
            .populate('likes', 'firstName lastName profilePicture')
            .populate('comments.userId', 'firstName lastName profilePicture')
            .populate('comments.likes', 'firstName lastName profilePicture');
    }
    /**
     * Delete comment from announcement
     */
    async deleteComment(id, commentId, userId) {
        return await announcement_model_1.AnnouncementModel.findByIdAndUpdate(id, {
            $pull: {
                comments: {
                    _id: commentId,
                    userId: userId // Ensure user can only delete their own comment
                }
            }
        }, { new: true })
            .populate('likes', 'firstName lastName profilePicture')
            .populate('comments.userId', 'firstName lastName profilePicture')
            .populate('comments.likes', 'firstName lastName profilePicture');
    }
    /**
     * Add a reply to a comment
     */
    async addReply(id, commentId, userId, content) {
        return await announcement_model_1.AnnouncementModel.findOneAndUpdate({ _id: id, "comments._id": commentId }, {
            $push: {
                "comments.$.replies": {
                    userId,
                    content,
                    likes: [],
                    createdAt: new Date()
                }
            }
        }, { new: true })
            .populate('likes', 'firstName lastName profilePicture')
            .populate('comments.userId', 'firstName lastName profilePicture')
            .populate('comments.likes', 'firstName lastName profilePicture')
            .populate('comments.replies.userId', 'firstName lastName profilePicture')
            .populate('comments.replies.likes', 'firstName lastName profilePicture');
    }
}
exports.AnnouncementDAL = AnnouncementDAL;
exports.announcementDAL = new AnnouncementDAL();
//# sourceMappingURL=announcement.dal.js.map