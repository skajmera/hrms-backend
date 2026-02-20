export declare class EmployeeDashboardService {
    getMyDashboard(userId: string, userRole: string, userDepartment: string): Promise<{
        attendance: any;
        leaveBalance: import("../../../../shared/interfaces/leave.interface").ILeaveBalance | null;
        pendingLeaves: number;
        announcements: import("../../../../shared/interfaces/announcement.interface").IAnnouncement[];
    }>;
}
export declare const employeeDashboardService: EmployeeDashboardService;
//# sourceMappingURL=dashboard.service.d.ts.map