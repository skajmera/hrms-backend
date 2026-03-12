import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';
export declare class EmployeeDashboardService {
    getMyDashboard(userId: string, userRole: string, userDepartment: string): Promise<{
        attendance: any;
        checkInSummary: any;
        leaveBalance: import("../../../../shared/interfaces/leave.interface").ILeaveBalance | null;
        pendingLeaves: number;
        announcements: import("../../../../shared/interfaces/announcement.interface").IAnnouncement[];
    }>;
    getBirthdays(userId: string, userRole: string, deptId: string): Promise<{
        announcements: import("../../../../shared/interfaces/announcement.interface").IAnnouncement[];
        total: number;
    }>;
    getAnniversary(userId: string, userRole: string, deptId: string): Promise<{
        announcements: import("../../../../shared/interfaces/announcement.interface").IAnnouncement[];
        total: number;
    }>;
    getNewHires(userId: string, userRole: string, deptId: string): Promise<{
        announcements: import("../../../../shared/interfaces/announcement.interface").IAnnouncement[];
        total: number;
    }>;
    private getAllAnnouncementsByType;
    getAllAnnouncements(userId: string, userRole: string, deptId: string, options: IPaginationOptions): Promise<{
        announcements: import("../../../../shared/interfaces/announcement.interface").IAnnouncement[];
        total: number;
    }>;
}
export declare const employeeDashboardService: EmployeeDashboardService;
//# sourceMappingURL=dashboard.service.d.ts.map