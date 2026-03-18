"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.announcementController = exports.AnnouncementController = void 0;
const announcement_service_1 = require("./announcement.service");
const response_1 = require("../../../../shared/utils/response");
const constants_1 = require("../../../../config/constants");
class AnnouncementController {
    async createAnnouncement(req, res, next) {
        try {
            const payload = { ...req.body, createdBy: req.user._id };
            if (req.files && Array.isArray(req.files)) {
                payload.attachments = req.files.map((file) => ({
                    name: file.originalname,
                    url: `/uploads/announcements/${file.filename}`,
                    type: file.mimetype,
                    size: file.size
                }));
            }
            const announcement = await announcement_service_1.announcementService.createAnnouncement(payload);
            (0, response_1.sendSuccessResponse)(res, 'Announcement created successfully', announcement, constants_1.HTTP_STATUS.CREATED);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
    async getAnnouncementById(req, res, next) {
        try {
            const announcement = await announcement_service_1.announcementService.getAnnouncementById(req.params.id, req.user._id.toString());
            if (announcement && !Array.isArray(announcement.attachments))
                announcement.attachments = announcement.attachments ? [announcement.attachments] : [];
            (0, response_1.sendSuccessResponse)(res, 'Announcement retrieved successfully', announcement);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.NOT_FOUND);
        }
    }
    async getAllAnnouncements(req, res, next) {
        try {
            const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = req.query;
            const result = await announcement_service_1.announcementService.getAllAnnouncements(filters, {
                page: Number(page),
                limit: Number(limit),
                sortBy: sortBy,
                sortOrder: sortOrder
            }, req.user._id.toString(), req.user.role);
            (0, response_1.sendPaginatedResponse)(res, result.announcements, result.total, Number(page), Number(limit), 'Announcements retrieved successfully');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async updateAnnouncement(req, res, next) {
        try {
            const payload = { ...req.body };
            if (req.files && Array.isArray(req.files)) {
                payload.attachments = req.files.map((file) => ({
                    name: file.originalname,
                    url: `/uploads/announcements/${file.filename}`,
                    type: file.mimetype,
                    size: file.size
                }));
            }
            const announcement = await announcement_service_1.announcementService.updateAnnouncement(req.params.id, payload, req.user._id.toString());
            (0, response_1.sendSuccessResponse)(res, 'Announcement updated successfully', announcement);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
    async deleteAnnouncement(req, res, next) {
        try {
            await announcement_service_1.announcementService.deleteAnnouncement(req.params.id);
            (0, response_1.sendSuccessResponse)(res, 'Announcement deleted successfully');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.NOT_FOUND);
        }
    }
    async getMyAnnouncements(req, res, next) {
        try {
            const department = req.user.professionalDetails.department;
            const departmentId = department?._id ? department._id.toString() : department?.toString();
            const announcements = await announcement_service_1.announcementService.getActiveAnnouncementsForUser(req.user._id.toString(), req.user.role, departmentId);
            (0, response_1.sendSuccessResponse)(res, 'Your announcements retrieved successfully', announcements);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async markAsViewed(req, res, next) {
        try {
            await announcement_service_1.announcementService.markAsViewed(req.params.id, req.user._id.toString());
            (0, response_1.sendSuccessResponse)(res, 'Announcement marked as viewed');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async togglePin(req, res, next) {
        try {
            const announcement = await announcement_service_1.announcementService.togglePin(req.params.id, req.user._id.toString());
            (0, response_1.sendSuccessResponse)(res, 'Announcement pin status updated', announcement);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async toggleLike(req, res, next) {
        try {
            const announcement = await announcement_service_1.announcementService.toggleLikeAnnouncement(req.params.id, req.user._id.toString());
            (0, response_1.sendSuccessResponse)(res, 'Announcement like toggled', announcement);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async toggleCommentLike(req, res, next) {
        try {
            const { id, commentId } = req.params;
            const announcement = await announcement_service_1.announcementService.toggleCommentLikeAnnouncement(id, commentId, req.user._id.toString());
            (0, response_1.sendSuccessResponse)(res, 'Comment like toggled', announcement);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async addComment(req, res, next) {
        try {
            const { content } = req.body;
            const announcement = await announcement_service_1.announcementService.addComment(req.params.id, req.user._id.toString(), content);
            (0, response_1.sendSuccessResponse)(res, 'Comment added successfully', announcement);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async replyToComment(req, res, next) {
        try {
            const { id, commentId } = req.params;
            const { content } = req.body;
            const announcement = await announcement_service_1.announcementService.addReplyToComment(id, commentId, req.user._id.toString(), content);
            (0, response_1.sendSuccessResponse)(res, 'Reply added successfully', announcement);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async deleteComment(req, res, next) {
        try {
            const { id, commentId } = req.params;
            const announcement = await announcement_service_1.announcementService.deleteComment(id, commentId, req.user._id.toString());
            (0, response_1.sendSuccessResponse)(res, 'Comment deleted successfully', announcement);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getTypedAnnouncements(req, res, next) {
        try {
            const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
            const { announcementType } = req.params;
            const result = await announcement_service_1.announcementService.getTypedAnnouncements(announcementType, { page: Number(page), limit: Number(limit), sortBy: sortBy, sortOrder: sortOrder }, req.user._id.toString(), req.user.role);
            (0, response_1.sendPaginatedResponse)(res, result.announcements, result.total, Number(page), Number(limit), `${announcementType} announcements retrieved successfully`);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
}
exports.AnnouncementController = AnnouncementController;
exports.announcementController = new AnnouncementController();
//# sourceMappingURL=announcement.controller.js.map