import { leaveDAL } from '../../../../shared/dal/leave.dal';
import { ILeaveCreateInput } from '../../../../shared/interfaces/leave.interface';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';
import { sendLeaveApprovalEmail } from '../../../../shared/utils/email';

export class LeaveService {
  async applyLeave(leaveData: ILeaveCreateInput) {
    // Check leave balance
    const balance = await leaveDAL.getLeaveBalance(leaveData.userId, new Date(leaveData.startDate).getFullYear());
    
    if (balance) {
      const leaveType = leaveData.leaveType.toLowerCase() + 'Leave';
      const currentBalance = balance[leaveType as keyof typeof balance] as any;
      
      if (currentBalance && currentBalance.remaining < (leaveData.endDate.getTime() - leaveData.startDate.getTime()) / (1000 * 60 * 60 * 24) + 1) {
        throw new Error('Insufficient leave balance');
      }
    }

    return await leaveDAL.create(leaveData);
  }

  async getLeaveById(id: string) {
    const leave = await leaveDAL.findById(id);
    if (!leave) {
      throw new Error('Leave request not found');
    }
    return leave;
  }

  async getAllLeaves(filters: any, options: IPaginationOptions) {
    return await leaveDAL.findAll(filters, options);
  }

  async approveLeave(id: string, approvedBy: string) {
    const leave = await leaveDAL.approve(id, approvedBy);
    if (!leave) {
      throw new Error('Leave request not found');
    }

    // Update leave balance
    await leaveDAL.updateLeaveBalanceAfterApproval(leave);

    return leave;
  }

  async rejectLeave(id: string, rejectedBy: string, rejectionReason: string) {
    const leave = await leaveDAL.reject(id, rejectedBy, rejectionReason);
    if (!leave) {
      throw new Error('Leave request not found');
    }
    return leave;
  }

  async getPendingLeaves() {
    return await leaveDAL.getPendingLeaves();
  }

  async getEmployeesOnLeaveToday() {
    return await leaveDAL.getEmployeesOnLeaveToday();
  }

  async getLeaveBalance(userId: string, year: number) {
    return await leaveDAL.getLeaveBalance(userId, year);
  }
}

export const leaveService = new LeaveService();