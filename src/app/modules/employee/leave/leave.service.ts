import { leaveDAL } from '../../../../shared/dal/leave.dal';
import { ILeaveCreateInput } from '../../../../shared/interfaces/leave.interface';

export class EmployeeLeaveService {
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

    return await leaveDAL.create({
      ...leaveData,
      userId
    });
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

    if (filters.leaveType) {
      query.leaveType = Array.isArray(filters.leaveType) ? { $in: filters.leaveType } : filters.leaveType;
    }

    if (filters.status) {
      query.status = Array.isArray(filters.status) ? { $in: filters.status } : filters.status;
    }

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