interface AttendanceStats {
    avgAttendanceRate: number;
    avgWorkingHours: number;
    totalOvertimeHours: number;
    leavesTaken: number;
    previousMonthComparison: {
        attendanceChange: number;
        workingHoursChange: number;
        overtimeChange: number;
        leavesChange: number;
    };
}
export declare class AnalyticsService {
    /**
     * Get comprehensive attendance statistics
     */
    getAttendanceStatistics(month: number, year: number, departmentId?: string): Promise<AttendanceStats>;
    /**
     * Calculate statistics for a specific month
     */
    private calculateMonthStats;
    /**
     * Calculate percentage change
     */
    private calculatePercentageChange;
    /**
     * Calculate absolute change
     */
    private calculateAbsoluteChange;
    /**
     * Get working days in a month (excluding weekends)
     */
    private getWorkingDaysInMonth;
    /**
     * Get department-wise analytics
     */
    getDepartmentWiseAnalytics(month: number, year: number): Promise<any[]>;
    /**
     * Get employee performance analytics
     */
    getEmployeePerformanceAnalytics(userId: string, month: number, year: number): Promise<{
        workingDays: number;
        presentDays: number;
        absentDays: number;
        lateDays: number;
        leaveDays: number;
        attendanceRate: number;
        avgWorkingHours: number;
        totalOvertimeHours: number;
        punctualityScore: number;
    }>;
    /**
     * Get trend data for charts
     */
    getAttendanceTrend(year: number, departmentId?: string): Promise<{
        avgAttendanceRate: number;
        avgWorkingHours: number;
        totalOvertimeHours: number;
        avgMinimumHours: number;
        leavesTaken: number;
        month: number;
        monthName: string;
    }[]>;
    /**
     * Get leave statistics
     */
    getLeaveStatistics(month: number, year: number, departmentId?: string): Promise<{
        totalLeaves: number;
        totalLeaveDays: number;
        leavesByType: any;
        leavesByStatus: any;
        employeesOnLeave: number;
        leavePercentage: number;
    }>;
    /**
     * Get real-time dashboard stats
     */
    getRealTimeDashboardStats(): Promise<{
        today: {
            date: string;
            totalEmployees: number;
            present: number;
            absent: number;
            late: number;
            attendanceRate: number;
        };
        currentMonth: {
            avgAttendanceRate: number;
            avgWorkingHours: number;
            totalOvertimeHours: number;
            leavesTaken: number;
            previousMonthComparison: {
                attendanceChange: number;
                workingHoursChange: number;
                overtimeChange: number;
                leavesChange: number;
            };
            month: number;
            year: number;
        };
        pendingActions: {
            pendingLeaveApprovals: number;
        };
    }>;
}
export declare const analyticsService: AnalyticsService;
export {};
//# sourceMappingURL=analytics.service.d.ts.map