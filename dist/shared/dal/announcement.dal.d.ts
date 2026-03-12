import { IAnnouncement, IAnnouncementCreateInput } from '../interfaces/announcement.interface';
import { IQueryFilters, IPaginationOptions } from '../interfaces/common.interface';
export declare class AnnouncementDAL {
    /**
     * Create announcement
     */
    create(announcementData: IAnnouncementCreateInput & {
        createdBy: string;
    }): Promise<IAnnouncement>;
    /**
     * Find announcement by ID
     */
    findById(id: string): Promise<IAnnouncement | null>;
    /**
     * Find all announcements
     */
    findAll(filters?: IQueryFilters, options?: IPaginationOptions): Promise<{
        announcements: IAnnouncement[];
        total: number;
    }>;
    /**
     * Update announcement
     */
    update(id: string, updateData: Partial<IAnnouncement>): Promise<IAnnouncement | null>;
    /**
     * Delete announcement
     */
    delete(id: string): Promise<IAnnouncement | null>;
    /**
     * Get active announcements for a user
     */
    getActiveAnnouncementsForUser(userId: string, userRole: string, userDepartmentId: string): Promise<IAnnouncement[]>;
    /**
     * Mark announcement as viewed
     */
    markAsViewed(id: string, userId: string): Promise<void>;
    /**
     * Pin/Unpin announcement
     */
    togglePin(id: string): Promise<IAnnouncement | null>;
    /**
     * Get pinned announcements
     */
    getPinnedAnnouncements(): Promise<IAnnouncement[]>;
    /**
     * Toggle Like on announcement (Add if not present, remove if present)
     */
    toggleLike(id: string, userId: string): Promise<IAnnouncement | null>;
    /**
     * Toggle Like on a comment
     */
    toggleCommentLike(announcementId: string, commentId: string, userId: string): Promise<IAnnouncement | null>;
    /**
     * Add comment to announcement
     */
    addComment(id: string, userId: string, content: string): Promise<IAnnouncement | null>;
    /**
     * Delete comment from announcement
     */
    deleteComment(id: string, commentId: string, userId: string): Promise<IAnnouncement | null>;
    /**
     * Add a reply to a comment
     */
    addReply(id: string, commentId: string, userId: string, content: string): Promise<IAnnouncement | null>;
    /**
     * Reusable active + date validity filter for employee-side visibility
     */
    getActiveFilter(): {
        isActive: boolean;
        startDate: {
            $lte: Date;
        };
        $or: ({
            expiryDate: {
                $exists: boolean;
                $gte?: undefined;
            };
        } | {
            expiryDate: {
                $gte: Date;
                $exists?: undefined;
            };
        })[];
    };
    /**
     * Get typed announcements (NEWHIRE/BIRTHDAY/ANNIVERSARY) with target employee data embedded
     */
    findTypedWithUsers(announcementType: string, options?: IPaginationOptions, applyActiveFilter?: boolean): Promise<{
        announcements: any[];
        total: number;
    }>;
}
export declare const announcementDAL: AnnouncementDAL;
//# sourceMappingURL=announcement.dal.d.ts.map