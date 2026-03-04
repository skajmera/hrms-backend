import { ILeaveCreateInput } from '../../../../shared/interfaces/leave.interface';
export declare class EmployeeLeaveService {
    /**
     * Apply for leave
     */
    applyLeave(userId: string, leaveData: Omit<ILeaveCreateInput, 'userId'>): Promise<import("../../../../shared/interfaces/leave.interface").ILeave>;
    /**
     * Get own leaves
     */
    getMyLeaves(userId: string, filters?: any, options?: any): Promise<{
        leaves: import("../../../../shared/interfaces/leave.interface").ILeave[];
        total: number;
    }>;
    /**
     * Get leave balance
     */
    getMyLeaveBalance(userId: string, year: number): Promise<import("../../../../shared/interfaces/leave.interface").ILeaveBalance | null>;
    /**
     * Cancel leave
     */
    cancelLeave(userId: string, leaveId: string): Promise<import("../../../../shared/interfaces/leave.interface").ILeave | null>;
}
export declare const employeeLeaveService: EmployeeLeaveService;
//# sourceMappingURL=leave.service.d.ts.map