import { leaveDAL } from '../../../../shared/dal/leave.dal';
import { userDAL } from '../../../../shared/dal/user.dal';
import { ILeaveCreateInput } from '../../../../shared/interfaces/leave.interface';
import { notificationsService } from '../../notifications/notifications.service';
import { NotificationType } from '../../../../shared/interfaces/notification.interface';
import { USER_ROLES } from '../../../../config/constants';

export class EmployeeLeaveService {
  private normalizeQueryValues(value: any): string[] {
    if (value === undefined || value === null || value === '') return [];
    const arr = Array.isArray(value) ? value : [value];
    return arr
      .flatMap((v: any) => String(v).split(','))
      .map((v: string) => v.trim().toUpperCase())
      .filter(Boolean);
  }

  /**
   * Apply for leave
   */
  async applyLeave(userId: string, leaveData: Omit<ILeaveCreateInput, 'userId'>) {
    // Check leave balance
    const year = new Date(leaveData.startDate).getFullYear();
    const balance = await leaveDAL.getLeaveBalance(userId, year);

    if (balance) {
      const leaveType = leaveData.leaveType.toLowerCase() + 'Leave';
      const currentBalance = balance[leaveType as keyof typeof balance] as any;

      const daysDiff = Math.ceil((new Date(leaveData.endDate).getTime() - new Date(leaveData.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;

      if (currentBalance && currentBalance.remaining < daysDiff) {
        throw new Error(`Insufficient ${leaveData.leaveType} leave balance. Available: ${currentBalance.remaining} days`);
      }
    }

    const leave = await leaveDAL.create({
      ...leaveData,
      userId
    });

    // --- TRIGGER NOTIFICATION ---
    try {
      const employee = await userDAL.findById(userId);
      if (employee && employee.professionalDetails?.reportingManager) {
        const managerId = employee.professionalDetails.reportingManager.toString();

        await notificationsService.sendNotification({
          userId: managerId,
          type: NotificationType.LEAVE_REQUESTED,
          title: 'New Leave Request',
          message: `${employee.fullName} has applied for ${leaveData.leaveType} leave from ${new Date(leaveData.startDate).toDateString()} to ${new Date(leaveData.endDate).toDateString()}.`,
          targetApp: 'HR',
          data: { leaveId: leave._id }
        });
      }

      // Also notify HR Admin for global visibility
      const hrAdmins = await userDAL.findAll({ role: USER_ROLES.HR_ADMIN }, { limit: 100, page: 1 });
      if (hrAdmins.users.length > 0) {
        const hrPromises = hrAdmins.users.map(hr => notificationsService.sendNotification({
          userId: hr._id.toString(),
          type: NotificationType.LEAVE_REQUESTED,
          title: 'New Leave Request (HR Copy)',
          message: `${employee?.fullName || 'An employee'} applied for leave.`,
          targetApp: 'HR',
          data: { leaveId: leave._id }
        }));
        await Promise.allSettled(hrPromises);
      }
    } catch (error) {
      console.error('[EmployeeLeaveService] Failed to send leave application notification:', error);
    }

    return leave;
  }

  /**
   * Get own leaves
   */
  async getMyLeaves(userId: string, filters: any = {}, options: any = {}) {
    const query: any = { userId };

    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);

      query.$or = [
        { startDate: { $gte: start, $lte: end } },
        { endDate: { $gte: start, $lte: end } },
        {
          $and: [
            { startDate: { $lte: start } },
            { endDate: { $gte: end } }
          ]
        }
      ];
    }

    const leaveTypes = this.normalizeQueryValues(filters.leaveType);
    if (leaveTypes.length === 1) query.leaveType = leaveTypes[0];
    else if (leaveTypes.length > 1) query.leaveType = { $in: leaveTypes };

    const statuses = this.normalizeQueryValues(filters.status);
    if (statuses.length === 1) query.status = statuses[0];
    else if (statuses.length > 1) query.status = { $in: statuses };

    return await leaveDAL.findAll(query, options);
  }

  /**
   * Get leave balance
   */
  async getMyLeaveBalance(userId: string, year: number) {
    return await leaveDAL.getLeaveBalance(userId, year);
  }

  /**
   * Cancel leave
   */
  async cancelLeave(userId: string, leaveId: string) {
    const leave = await leaveDAL.findById(leaveId);

    if (!leave) {
      throw new Error('Leave not found');
    }

    if (leave.userId.toString() !== userId) {
      throw new Error('Unauthorized to cancel this leave');
    }

    if (leave.status !== 'PENDING') {
      throw new Error('Only pending leaves can be cancelled');
    }

    return await leaveDAL.update(leaveId, { status: 'CANCELLED' });
  }
}

export const employeeLeaveService = new EmployeeLeaveService();