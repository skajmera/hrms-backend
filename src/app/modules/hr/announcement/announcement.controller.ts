import { Response, NextFunction } from 'express';
import { announcementService } from './announcement.service';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
import { sendSuccessResponse, sendErrorResponse, sendPaginatedResponse } from '../../../../shared/utils/response';
import { HTTP_STATUS } from '../../../../config/constants';
import { compressImageIfNeeded } from '../../../../shared/utils/imageCompressor';

const parseJsonIfString = (value: any) => {
  if (typeof value !== 'string') return value;
  try { return JSON.parse(value); } catch { return value; }
};

const toArray = (value: any): any[] => {
  const parsed = parseJsonIfString(value);
  if (Array.isArray(parsed)) return parsed;
  if (parsed === undefined || parsed === null || parsed === '') return [];
  return [parsed];
};

export class AnnouncementController {
  async createAnnouncement(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = { ...req.body, createdBy: req.user._id };

      if (req.files && Array.isArray(req.files)) {
        await Promise.all(
          req.files.map((f: Express.Multer.File) => compressImageIfNeeded(f.path, f.mimetype))
        );
        payload.attachments = req.files.map((file: Express.Multer.File) => ({
          name: file.originalname,
          url: `/uploads/announcements/${file.filename}`,
          type: file.mimetype,
          size: file.size
        }));
      }

      const announcement = await announcementService.createAnnouncement(payload);
      sendSuccessResponse(res, 'Announcement created successfully', announcement, HTTP_STATUS.CREATED);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  async getAnnouncementById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const announcement: any = await announcementService.getAnnouncementById(req.params.id, req.user._id.toString());
      if (announcement && !Array.isArray(announcement.attachments)) announcement.attachments = announcement.attachments ? [announcement.attachments] : [];
      console.log('[HRAnnouncement][GetById][Response]', {
        announcementId: req.params.id,
        requestedBy: req.user?._id?.toString?.(),
        likesCount: Array.isArray(announcement?.likes) ? announcement.likes.length : 0,
        commentsCount: Array.isArray(announcement?.comments) ? announcement.comments.length : 0,
        data: announcement
      });
      sendSuccessResponse(res, 'Announcement retrieved successfully', announcement);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
  }

  async getAllAnnouncements(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = req.query;

      const result = await announcementService.getAllAnnouncements(filters, {
        page: Number(page),
        limit: Number(limit),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      }, req.user._id.toString(), req.user.role);
      console.log('[HRAnnouncement][GetAll][Response]', {
        requestedBy: req.user?._id?.toString?.(),
        page: Number(page),
        limit: Number(limit),
        count: Array.isArray(result?.announcements) ? result.announcements.length : 0,
        total: result?.total ?? 0,
        data: result?.announcements
      });
      sendPaginatedResponse(res, result.announcements, result.total, Number(page), Number(limit), 'Announcements retrieved successfully');
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async updateAnnouncement(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = { ...req.body };
      const files = req.files && Array.isArray(req.files) ? req.files : [];
      const uploadedAttachments = files.map((file: Express.Multer.File) => ({
        name: file.originalname,
        url: `/uploads/announcements/${file.filename}`,
        type: file.mimetype,
        size: file.size
      }));
      if (files.length) {
        await Promise.all(
          files.map((f: Express.Multer.File) => compressImageIfNeeded(f.path, f.mimetype))
        );
      }

      // If no new files are uploaded, do not touch existing attachments at all.
      if (uploadedAttachments.length === 0) {
        delete (payload as any).attachments;
        delete (payload as any).retainAttachmentUrls;
      } else {
        const current: any = await announcementService.getAnnouncementById(req.params.id, req.user._id.toString());
        const existingAttachments = Array.isArray(current?.attachments) ? current.attachments : [];

      // Frontend can send either:
      // - retainAttachmentUrls: string[] of existing URLs to keep
      // - attachments: array of existing attachment objects/urls to keep
      // By default (if none sent), keep all existing attachments.
        const retainUrls = new Set(
          toArray(payload.retainAttachmentUrls)
            .map((x: any) => (typeof x === 'string' ? x : x?.url))
            .filter(Boolean)
        );
        const requestedAttachments = toArray(payload.attachments);
        const requestedUrls = new Set(
          requestedAttachments
            .map((x: any) => (typeof x === 'string' ? x : x?.url))
            .filter(Boolean)
        );
        const hasExplicitRetain = retainUrls.size > 0 || requestedUrls.size > 0;
        const keptAttachments = hasExplicitRetain
          ? existingAttachments.filter((a: any) => retainUrls.has(a?.url) || requestedUrls.has(a?.url))
          : existingAttachments;

        payload.attachments = [...keptAttachments, ...uploadedAttachments];
        delete (payload as any).retainAttachmentUrls;
      }

      const announcement = await announcementService.updateAnnouncement(req.params.id, payload, req.user._id.toString());
      sendSuccessResponse(res, 'Announcement updated successfully', announcement);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  async deleteAnnouncement(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await announcementService.deleteAnnouncement(req.params.id);
      sendSuccessResponse(res, 'Announcement deleted successfully');
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
  }

  async getMyAnnouncements(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const department = req.user.professionalDetails.department;
      const departmentId = department?._id ? department._id.toString() : department?.toString();

      const announcements = await announcementService.getActiveAnnouncementsForUser(
        req.user._id.toString(),
        req.user.role,
        departmentId
      );
      sendSuccessResponse(res, 'Your announcements retrieved successfully', announcements);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async markAsViewed(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await announcementService.markAsViewed(req.params.id, req.user._id.toString());
      sendSuccessResponse(res, 'Announcement marked as viewed');
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async togglePin(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const announcement = await announcementService.togglePin(req.params.id, req.user._id.toString());
      sendSuccessResponse(res, 'Announcement pin status updated', announcement);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async toggleLike(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const announcement = await announcementService.toggleLikeAnnouncement(req.params.id, req.user._id.toString());
      sendSuccessResponse(res, 'Announcement like toggled', announcement);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async toggleCommentLike(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, commentId } = req.params;
      const announcement = await announcementService.toggleCommentLikeAnnouncement(id, commentId, req.user._id.toString());
      sendSuccessResponse(res, 'Comment like toggled', announcement);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async addComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { content } = req.body;
      const announcement = await announcementService.addComment(req.params.id, req.user._id.toString(), content);
      sendSuccessResponse(res, 'Comment added successfully', announcement);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async replyToComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, commentId } = req.params;
      const { content } = req.body;
      const announcement = await announcementService.addReplyToComment(id, commentId, req.user._id.toString(), content);
      sendSuccessResponse(res, 'Reply added successfully', announcement);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async deleteComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, commentId } = req.params;
      const announcement = await announcementService.deleteComment(id, commentId, req.user._id.toString());
      sendSuccessResponse(res, 'Comment deleted successfully', announcement);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getTypedAnnouncements(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
      const { announcementType } = req.params;

      const result = await announcementService.getTypedAnnouncements(
        announcementType,
        { page: Number(page), limit: Number(limit), sortBy: sortBy as string, sortOrder: sortOrder as 'asc' | 'desc' },
        req.user._id.toString(),
        req.user.role
      );
      sendPaginatedResponse(res, result.announcements, result.total, Number(page), Number(limit), `${announcementType} announcements retrieved successfully`);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }
}

export const announcementController = new AnnouncementController();