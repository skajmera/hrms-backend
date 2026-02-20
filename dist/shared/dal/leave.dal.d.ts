import { ILeave, ILeaveBalance, ILeaveCreateInput } from '../interfaces/leave.interface';
import { IQueryFilters, IPaginationOptions } from '../interfaces/common.interface';
export declare class LeaveDAL {
    /**
     * Create leave request
     */
    create(leaveData: ILeaveCreateInput): Promise<ILeave>;
    /**
     * Find leave by ID
     */
    findById(id: string): Promise<ILeave | null>;
    /**
     * Find all leaves
     */
    findAll(filters?: IQueryFilters, options?: IPaginationOptions): Promise<{
        leaves: ILeave[];
        total: number;
    }>;
    /**
     * Update leave
     */
    update(id: string, updateData: Partial<ILeave>): Promise<ILeave | null>;
    /**
     * Delete leave
     */
    delete(id: string): Promise<ILeave | null>;
    /**
     * Get pending leave requests
     */
    getPendingLeaves(): Promise<ILeave[]>;
    /**
     * Get user leaves by date range
     */
    findByUserAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<ILeave[]>;
    /**
     * Get employees on leave today
     */
    getEmployeesOnLeaveToday(): Promise<ILeave[]>;
    /**
     * Approve leave
     */
    approve(id: string, approvedBy: string): Promise<ILeave | null>;
    /**
     * Reject leave
     */
    reject(id: string, rejectedBy: string, rejectionReason: string): Promise<ILeave | null>;
    /**
     * Get leave balance
     */
    getLeaveBalance(userId: string, year: number): Promise<ILeaveBalance | null>;
    /**
     * Create or update leave balance
     */
    upsertLeaveBalance(userId: string, year: number, balanceData: Partial<ILeaveBalance>): Promise<ILeaveBalance>;
    /**
     * Update leave balance after approval
     */
    updateLeaveBalanceAfterApproval(leave: ILeave): Promise<void>;
    /**
   * Get leaves by date range
   * Returns all leaves that overlap with the given date range
   */
    findByDateRange(startDate: Date, endDate: Date): Promise<ILeave[]>;
}
export declare const leaveDAL: LeaveDAL;
//# sourceMappingURL=leave.dal.d.ts.map