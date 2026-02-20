import { IAnnouncementCreateInput } from '../../../../shared/interfaces/announcement.interface';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';
export declare class AnnouncementService {
    createAnnouncement(announcementData: IAnnouncementCreateInput & {
        createdBy: string;
    }): Promise<import("../../../../shared/interfaces/announcement.interface").IAnnouncement>;
    getAnnouncementById(id: string): Promise<import("../../../../shared/interfaces/announcement.interface").IAnnouncement>;
    getAllAnnouncements(filters: any, options: IPaginationOptions): Promise<{
        announcements: import("../../../../shared/interfaces/announcement.interface").IAnnouncement[];
        total: number;
    }>;
    updateAnnouncement(id: string, updateData: any): Promise<import("../../../../shared/interfaces/announcement.interface").IAnnouncement>;
    deleteAnnouncement(id: string): Promise<import("../../../../shared/interfaces/announcement.interface").IAnnouncement>;
    getActiveAnnouncementsForUser(userId: string, userRole: string, userDepartment: string): Promise<import("../../../../shared/interfaces/announcement.interface").IAnnouncement[]>;
    markAsViewed(id: string, userId: string): Promise<void>;
    togglePin(id: string): Promise<import("../../../../shared/interfaces/announcement.interface").IAnnouncement>;
}
export declare const announcementService: AnnouncementService;
//# sourceMappingURL=announcement.service.d.ts.map