import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
export declare class AnnouncementController {
    createAnnouncement(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getAnnouncementById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getAllAnnouncements(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    updateAnnouncement(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    deleteAnnouncement(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getMyAnnouncements(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    markAsViewed(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    togglePin(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    toggleLike(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    toggleCommentLike(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    addComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    replyToComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    deleteComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getTypedAnnouncements(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const announcementController: AnnouncementController;
//# sourceMappingURL=announcement.controller.d.ts.map