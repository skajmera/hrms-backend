export declare class DashboardService {
    getDashboardStats(organizationId?: string): Promise<{
        totalEmployees: number;
        attendance: {
            present: number;
            absent: number;
            late: number;
            wfh: number;
            onLeave: number;
            yetToCheckIn: number;
            workingDays: number;
        };
        checkInSummary: {
            totalEmployees: number;
            checkedIn: number;
            onTime: number;
            late: number;
            yetToCheckIn: number;
            workingDays: number;
        };
        leaves: {
            pending: number;
            onLeaveToday: number;
        };
        newHires: number;
    }>;
    private getWorkingDaysForMonth;
    getBirthdays(): Promise<import("../../../../shared/interfaces/user.interface").IUser[]>;
    getNewHires(days?: number, date?: string): Promise<any[]>;
    getRecentAnnouncements(userId: string, userRole: string, userDepartment: string): Promise<import("../../../../shared/interfaces/announcement.interface").IAnnouncement[]>;
    getAnniversary(): Promise<import("../../../../shared/interfaces/user.interface").IUser[]>;
    /**
     * ✅ NEW - Get complete leave statistics for all users
     */
    getLeaveStatistics(): Promise<{
        summary: {
            totalLeaveRequests: number;
            approvedLeaves: number;
            pendingApprovals: number;
            totalLeaveRemaining: any;
            percentageChange: string;
            approvalRate: string;
        };
        balance: {
            casual: {
                remaining: any;
                used: any;
            };
            sick: {
                remaining: any;
                used: any;
            };
            earned: {
                remaining: any;
                used: any;
            };
            total: any;
        };
        leaveTypeBreakdown: any[];
        monthlyTrend: any[];
        departmentStats: any[];
    }>;
    /**
     * ✅ NEW - Get top leave takers
     */
    getTopLeaveTakers(limit?: number): Promise<any[]>;
}
export declare const dashboardService: DashboardService;
//# sourceMappingURL=dashboard.service.d.ts.map