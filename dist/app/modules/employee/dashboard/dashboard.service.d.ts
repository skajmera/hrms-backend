export declare class EmployeeDashboardService {
    getMyDashboard(userId: string, userRole: string, userDepartment: string): Promise<{
        attendance: any;
        checkInSummary: any;
        leaveBalance: import("../../../../shared/interfaces/leave.interface").ILeaveBalance | null;
        pendingLeaves: number;
        announcements: import("../../../../shared/interfaces/announcement.interface").IAnnouncement[];
    }>;
    getBirthdays(): Promise<import("../../../../shared/interfaces/user.interface").IUser[]>;
    getAnniversary(): Promise<import("../../../../shared/interfaces/user.interface").IUser[]>;
    getNewHires(days?: number, date?: string): Promise<any[]>;
}
export declare const employeeDashboardService: EmployeeDashboardService;
//# sourceMappingURL=dashboard.service.d.ts.map