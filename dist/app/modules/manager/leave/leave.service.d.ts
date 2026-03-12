export declare class ManagerLeaveService {
    /**
     * Approve team member leave
     */
    approveTeamLeave(managerId: string, leaveId: string, callerRole?: string): Promise<import("../../../../shared/interfaces/leave.interface").ILeave | null>;
    /**
     * Reject team member leave
     */
    rejectTeamLeave(managerId: string, leaveId: string, rejectionReason: string, callerRole?: string): Promise<import("../../../../shared/interfaces/leave.interface").ILeave | null>;
}
export declare const managerLeaveService: ManagerLeaveService;
//# sourceMappingURL=leave.service.d.ts.map