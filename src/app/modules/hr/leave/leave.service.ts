import { leaveDAL } from '../../../../shared/dal/leave.dal';
import { userDAL } from '../../../../shared/dal/user.dal';
import { ILeaveCreateInput } from '../../../../shared/interfaces/leave.interface';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';
import { sendLeaveApprovalEmail } from '../../../../shared/utils/email';
import { notificationsService } from '../../notifications/notifications.service';
import { NotificationType } from '../../../../shared/interfaces/notification.interface';

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

    const leave = await leaveDAL.create(leaveData);

    // --- TRIGGER NOTIFICATION ---
    try {
      const employee = await userDAL.findById(leaveData.userId);
      if (employee && employee.professionalDetails?.reportingManager) {
        await notificationsService.sendNotification({
          userId: employee.professionalDetails.reportingManager.toString(),
          type: NotificationType.LEAVE_REQUESTED,
          title: 'New Leave Request',
          message: `${employee.fullName} has a new leave request for ${leaveData.leaveType}.`,
          targetApp: 'HR',
          data: { leaveId: leave._id }
        });
      }
    } catch (error) {
      console.error('[HRLeaveService] Failed to send leave application notification:', error);
    }

    return leave;
  }

  async getLeaveById(id: string) {
    const leave = await leaveDAL.findById(id);
    if (!leave) {
      throw new Error('Leave request not found');
    }
    return leave;
  }

  async getAllLeaves(query: any, options: IPaginationOptions) {
    const { userId, status, leaveType, startDate, endDate } = query;

    const filters: any = {};
    if (userId) filters.userId = userId;
    if (status) filters.status = status;
    if (leaveType) filters.leaveType = leaveType;

    // Overlap range: find leaves that fall within OR overlap the given date window
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (end) end.setHours(23, 59, 59, 999);
      if (start) filters.endDate = { $gte: start };
      if (end) filters.startDate = { ...filters.startDate, $lte: end };
    }

    return await leaveDAL.findAll(filters, options);
  }

  async approveLeave(id: string, approvedBy: string) {
    const leave = await leaveDAL.approve(id, approvedBy);
    if (!leave) {
      throw new Error('Leave request not found');
    }

    // Update leave balance
    await leaveDAL.updateLeaveBalanceAfterApproval(leave);

    // --- TRIGGER NOTIFICATION ---
    try {
      await notificationsService.sendNotification({
        userId: leave.userId.toString(),
        type: NotificationType.LEAVE_APPROVED,
        title: 'Leave Approved',
        message: `Your leave request for ${leave.leaveType} has been approved by HR.`,
        targetApp: 'EMPLOYEE',
        data: { leaveId: leave._id }
      });
    } catch (error) {
      console.error('[HRLeaveService] Failed to send approval notification:', error);
    }

    return leave;
  }

  async rejectLeave(id: string, rejectedBy: string, rejectionReason: string) {
    const leave = await leaveDAL.reject(id, rejectedBy, rejectionReason);
    if (!leave) {
      throw new Error('Leave request not found');
    }

    // --- TRIGGER NOTIFICATION ---
    try {
      await notificationsService.sendNotification({
        userId: leave.userId.toString(),
        type: NotificationType.LEAVE_REJECTED,
        title: 'Leave Rejected',
        message: `Your leave request for ${leave.leaveType} has been rejected by HR. Reason: ${rejectionReason}`,
        targetApp: 'EMPLOYEE',
        data: { leaveId: leave._id }
      });
    } catch (error) {
      console.error('[HRLeaveService] Failed to send rejection notification:', error);
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