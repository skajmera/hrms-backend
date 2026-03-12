import { LeaveModel, LeaveBalanceModel } from '../models/leave.model';
import { ILeave, ILeaveBalance, ILeaveCreateInput } from '../interfaces/leave.interface';
import { IQueryFilters, IPaginationOptions } from '../interfaces/common.interface';
import { LEAVE_STATUS } from '../../config/constants';

export class LeaveDAL {
  /**
   * Create leave request
   */
  async create(leaveData: ILeaveCreateInput): Promise<ILeave> {
    return await LeaveModel.create(leaveData);
  }

  /**
   * Find leave by ID
   */
  async findById(id: string): Promise<ILeave | null> {
    return await LeaveModel.findById(id)
      .populate('userId', 'firstName lastName email profilePicture professionalDetails.employeeId professionalDetails.department')
      .populate('approvedBy', 'firstName lastName profilePicture')
      .populate('rejectedBy', 'firstName lastName profilePicture')
      .populate('handoverTo', 'firstName lastName email profilePicture');
  }

  /**
   * Find all leaves
   */
  async findAll(
    filters: IQueryFilters = {},
    options: IPaginationOptions = {}
  ): Promise<{ leaves: ILeave[]; total: number }> {
    const { page = 1, limit = 10, sortBy = 'appliedDate', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;

    const leaves = await LeaveModel.find(filters)
      .populate('userId', 'firstName lastName email profilePicture professionalDetails.employeeId')
      .populate('approvedBy', 'firstName lastName profilePicture')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    const total = await LeaveModel.countDocuments(filters);

    return { leaves, total };
  }

  /**
   * Update leave
   */
  async update(id: string, updateData: Partial<ILeave>): Promise<ILeave | null> {
    return await LeaveModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('userId', 'firstName lastName email profilePicture');
  }

  /**
   * Delete leave
   */
  async delete(id: string): Promise<ILeave | null> {
    return await LeaveModel.findByIdAndDelete(id);
  }

  /**
   * Get pending leave requests
   */
  async getPendingLeaves(): Promise<ILeave[]> {
    return await LeaveModel.find({ status: LEAVE_STATUS.PENDING })
      .populate('userId', 'firstName lastName email profilePicture professionalDetails.employeeId professionalDetails.department')
      .sort({ appliedDate: 1 });
  }

  /**
   * Get user leaves by date range
   */
  async findByUserAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ILeave[]> {
    return await LeaveModel.find({
      userId,
      $or: [
        { startDate: { $gte: startDate, $lte: endDate } },
        { endDate: { $gte: startDate, $lte: endDate } },
        {
          $and: [
            { startDate: { $lte: startDate } },
            { endDate: { $gte: endDate } }
          ]
        }
      ]
    }).sort({ startDate: 1 });
  }

  /**
   * Get employees on leave today
   */
  async getEmployeesOnLeaveToday(): Promise<ILeave[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await LeaveModel.find({
      status: LEAVE_STATUS.APPROVED,
      startDate: { $lte: today },
      endDate: { $gte: today }
    })
      .populate('userId', 'firstName lastName email profilePicture professionalDetails.employeeId professionalDetails.department');
  }

  /**
   * Approve leave
   */
  async approve(id: string, approvedBy: string): Promise<ILeave | null> {
    return await LeaveModel.findByIdAndUpdate(
      id,
      {
        $set: {
          status: LEAVE_STATUS.APPROVED,
          approvedBy,
          approvedDate: new Date()
        }
      },
      { new: true }
    )
      .populate('userId', 'firstName lastName email profilePicture');
  }

  /**
   * Reject leave
   */
  async reject(id: string, rejectedBy: string, rejectionReason: string): Promise<ILeave | null> {
    return await LeaveModel.findByIdAndUpdate(
      id,
      {
        $set: {
          status: LEAVE_STATUS.REJECTED,
          rejectedBy,
          rejectedDate: new Date(),
          rejectionReason
        }
      },
      { new: true }
    )
      .populate('userId', 'firstName lastName email profilePicture');
  }

  /**
   * Get leave balance
   */
  async getLeaveBalance(userId: string, year: number): Promise<ILeaveBalance | null> {
    return await LeaveBalanceModel.findOne({ userId, year });
  }

  /**
   * Create or update leave balance
   */
  async upsertLeaveBalance(userId: string, year: number, balanceData: Partial<ILeaveBalance>): Promise<ILeaveBalance> {
    return await LeaveBalanceModel.findOneAndUpdate(
      { userId, year },
      { $set: balanceData },
      { new: true, upsert: true }
    );
  }

  /**
   * Update leave balance after approval
   */
  async updateLeaveBalanceAfterApproval(leave: ILeave): Promise<void> {
    const year = leave.startDate.getFullYear();

    // Safely get userId string
    const userId = leave.userId?._id ? leave.userId._id.toString() : leave.userId?.toString();

    if (!userId) {
      console.error(`Cannot update leave balance: userId is missing for leave ${leave._id}`);
      return;
    }

    const balance = await this.getLeaveBalance(userId, year);

    if (balance) {
      const leaveType = leave.leaveType.toLowerCase() + 'Leave';
      const currentBalance = balance[leaveType as keyof ILeaveBalance] as any;

      if (currentBalance) {
        currentBalance.used += leave.numberOfDays;
        currentBalance.remaining = currentBalance.total - currentBalance.used;
        await balance.save();
      }
    } else {
      console.warn(`No leave balance found for user ${userId} in year ${year}`);
    }
  }
  /**
 * Get leaves by date range
 * Returns all leaves that overlap with the given date range
 */
  async findByDateRange(startDate: Date, endDate: Date): Promise<ILeave[]> {
    return await LeaveModel.find({
      $or: [
        // Leave starts within the range
        { startDate: { $gte: startDate, $lte: endDate } },
        // Leave ends within the range
        { endDate: { $gte: startDate, $lte: endDate } },
        // Leave spans the entire range
        {
          startDate: { $lte: startDate },
          endDate: { $gte: endDate }
        }
      ],
      status: LEAVE_STATUS.APPROVED // Only count approved leaves
    })
      .populate('userId', 'firstName lastName email professionalDetails.employeeId profilePicture')
      .populate('approvedBy', 'firstName lastName profilePicture')
      .sort({ startDate: 1 });
  }
}

export const leaveDAL = new LeaveDAL();