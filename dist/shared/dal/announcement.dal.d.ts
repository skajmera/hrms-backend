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
}
export declare const announcementDAL: AnnouncementDAL;
//# sourceMappingURL=announcement.dal.d.ts.map