import { ILeaveCreateInput } from '../../../../shared/interfaces/leave.interface';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';
export declare class LeaveService {
    applyLeave(leaveData: ILeaveCreateInput): Promise<import("../../../../shared/interfaces/leave.interface").ILeave>;
    getLeaveById(id: string): Promise<import("../../../../shared/interfaces/leave.interface").ILeave>;
    getAllLeaves(query: any, options: IPaginationOptions): Promise<{
        leaves: import("../../../../shared/interfaces/leave.interface").ILeave[];
        total: number;
    }>;
    approveLeave(id: string, approvedBy: string): Promise<import("../../../../shared/interfaces/leave.interface").ILeave>;
    rejectLeave(id: string, rejectedBy: string, rejectionReason: string): Promise<import("../../../../shared/interfaces/leave.interface").ILeave>;
    getPendingLeaves(): Promise<import("../../../../shared/interfaces/leave.interface").ILeave[]>;
    getEmployeesOnLeaveToday(): Promise<import("../../../../shared/interfaces/leave.interface").ILeave[]>;
    getLeaveBalance(userId: string, year: number): Promise<import("../../../../shared/interfaces/leave.interface").ILeaveBalance | null>;
}
export declare const leaveService: LeaveService;
//# sourceMappingURL=leave.service.d.ts.map