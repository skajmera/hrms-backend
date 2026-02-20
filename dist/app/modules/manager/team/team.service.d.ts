export declare class ManagerTeamService {
    /**
     * Get team members
     */
    getTeamMembers(managerId: string): Promise<{
        users: import("../../../../shared/interfaces/user.interface").IUser[];
        total: number;
    }>;
    /**
     * Get team attendance today
     */
    getTeamAttendanceToday(managerId: string): Promise<import("../../../../shared/interfaces/attendance.interface").IAttendance[]>;
    /**
     * Get team leave requests (pending)
     */
    getTeamLeaveRequests(managerId: string): Promise<{
        leaves: import("../../../../shared/interfaces/leave.interface").ILeave[];
        total: number;
    }>;
    /**
     * Get team member details
     */
    getTeamMemberDetails(managerId: string, userId: string): Promise<import("../../../../shared/interfaces/user.interface").IUser>;
}
export declare const managerTeamService: ManagerTeamService;
//# sourceMappingURL=team.service.d.ts.map