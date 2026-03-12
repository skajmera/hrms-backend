import { Response, NextFunction } from 'express';
import { announcementService } from './announcement.service';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
import { sendSuccessResponse, sendErrorResponse, sendPaginatedResponse } from '../../../../shared/utils/response';
import { HTTP_STATUS } from '../../../../config/constants';

export class AnnouncementController {
  async createAnnouncement(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = { ...req.body, createdBy: req.user._id };

      if (req.files && Array.isArray(req.files)) {
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
      const announcement = await announcementService.getAnnouncementById(req.params.id, req.user._id.toString());
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
      sendPaginatedResponse(res, result.announcements, result.total, Number(page), Number(limit), 'Announcements retrieved successfully');
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async updateAnnouncement(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = { ...req.body };

      if (req.files && Array.isArray(req.files)) {
        payload.attachments = req.files.map((file: Express.Multer.File) => ({
          name: file.originalname,
          url: `/uploads/announcements/${file.filename}`,
          type: file.mimetype,
          size: file.size
        }));
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