import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';
export declare class EmployeeDashboardService {
    getMyDashboard(userId: string, userRole: string, userDepartment: string, organizationId?: string): Promise<{
        attendance: {
            total: number;
            present: any;
            absent: any;
            late: any;
            wfh: any;
            halfDay: any;
            onLeave: any;
            workingDays: number;
        };
        checkInSummary: {
            total: any;
            onTime: any;
            late: any;
            remaining: number;
            workingDays: number;
            checkin: any;
            ontime: any;
        };
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
        announcements: any[];
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