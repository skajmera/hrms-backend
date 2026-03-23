"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.announcementController = exports.AnnouncementController = void 0;
const announcement_service_1 = require("./announcement.service");
const response_1 = require("../../../../shared/utils/response");
const constants_1 = require("../../../../config/constants");
const imageCompressor_1 = require("../../../../shared/utils/imageCompressor");
const parseJsonIfString = (value) => {
    if (typeof value !== 'string')
        return value;
    try {
        return JSON.parse(value);
    }
    catch {
        return value;
    }
};
const toArray = (value) => {
    const parsed = parseJsonIfString(value);
    if (Array.isArray(parsed))
        return parsed;
    if (parsed === undefined || parsed === null || parsed === '')
        return [];
    return [parsed];
};
class AnnouncementController {
    async createAnnouncement(req, res, next) {
        try {
            const payload = { ...req.body, createdBy: req.user._id };
            if (req.files && Array.isArray(req.files)) {
                await Promise.all(req.files.map((f) => (0, imageCompressor_1.compressImageIfNeeded)(f.path, f.mimetype)));
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
            console.log('[HRAnnouncement][GetById][Response]', {
                announcementId: req.params.id,
                requestedBy: req.user?._id?.toString?.(),
                likesCount: Array.isArray(announcement?.likes) ? announcement.likes.length : 0,
                commentsCount: Array.isArray(announcement?.comments) ? announcement.comments.length : 0,
                data: announcement
            });
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
            console.log('[HRAnnouncement][GetAll][Response]', {
                requestedBy: req.user?._id?.toString?.(),
                page: Number(page),
                limit: Number(limit),
                count: Array.isArray(result?.announcements) ? result.announcements.length : 0,
                total: result?.total ?? 0,
                data: result?.announcements
            });
            (0, response_1.sendPaginatedResponse)(res, result.announcements, result.total, Number(page), Number(limit), 'Announcements retrieved successfully');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async updateAnnouncement(req, res, next) {
        try {
            const payload = { ...req.body };
            const files = req.files && Array.isArray(req.files) ? req.files : [];
            const uploadedAttachments = files.map((file) => ({
                name: file.originalname,
                url: `/uploads/announcements/${file.filename}`,
                type: file.mimetype,
                size: file.size
            }));
            if (files.length) {
                await Promise.all(files.map((f) => (0, imageCompressor_1.compressImageIfNeeded)(f.path, f.mimetype)));
            }
            // If no new files are uploaded, do not touch existing attachments at all.
            if (uploadedAttachments.length === 0) {
                delete payload.attachments;
                delete payload.retainAttachmentUrls;
            }
            else {
                const current = await announcement_service_1.announcementService.getAnnouncementById(req.params.id, req.user._id.toString());
                const existingAttachments = Array.isArray(current?.attachments) ? current.attachments : [];
                // Frontend can send either:
                // - retainAttachmentUrls: string[] of existing URLs to keep
                // - attachments: array of existing attachment objects/urls to keep
                // By default (if none sent), keep all existing attachments.
                const retainUrls = new Set(toArray(payload.retainAttachmentUrls)
                    .map((x) => (typeof x === 'string' ? x : x?.url))
                    .filter(Boolean));
                const requestedAttachments = toArray(payload.attachments);
                const requestedUrls = new Set(requestedAttachments
                    .map((x) => (typeof x === 'string' ? x : x?.url))
                    .filter(Boolean));
                const hasExplicitRetain = retainUrls.size > 0 || requestedUrls.size > 0;
                const keptAttachments = hasExplicitRetain
                    ? existingAttachments.filter((a) => retainUrls.has(a?.url) || requestedUrls.has(a?.url))
                    : existingAttachments;
                payload.attachments = [...keptAttachments, ...uploadedAttachments];
                delete payload.retainAttachmentUrls;
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