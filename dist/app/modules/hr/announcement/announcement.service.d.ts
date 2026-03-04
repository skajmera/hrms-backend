import { IAnnouncementCreateInput } from '../../../../shared/interfaces/announcement.interface';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';
export declare class AnnouncementService {
    createAnnouncement(announcementData: IAnnouncementCreateInput & {
        createdBy: string;
    }): Promise<import("../../../../shared/interfaces/announcement.interface").IAnnouncement>;
    getAnnouncementById(id: string, userId?: string): Promise<any>;
    getAllAnnouncements(filters: any, options: IPaginationOptions, userId?: string): Promise<{
        announcements: import("../../../../shared/interfaces/announcement.interface").IAnnouncement[];
        total: number;
    }>;
    updateAnnouncement(id: string, updateData: any, userId: string): Promise<any>;
    deleteAnnouncement(id: string): Promise<import("../../../../shared/interfaces/announcement.interface").IAnnouncement>;
    markAsViewed(id: string, userId: string): Promise<void>;
    togglePin(id: string, userId: string): Promise<any>;
    getActiveAnnouncementsForUser(userId: string, userRole: string, userDepartment: string): Promise<any[]>;
    toggleLikeAnnouncement(id: string, userId: string): Promise<any>;
    toggleCommentLikeAnnouncement(id: string, commentId: string, userId: string): Promise<any>;
    addComment(id: string, userId: string, content: string): Promise<any>;
    deleteComment(id: string, commentId: string, userId: string): Promise<any>;
    /**
     * Inject runtime 'liked' field for frontend consumption
     */
    private injectLikedField;
}
export declare const announcementService: AnnouncementService;
//# sourceMappingURL=announcement.service.d.ts.map