import { userDAL } from '../../../../shared/dal/user.dal';
import { attendanceDAL } from '../../../../shared/dal/attendance.dal';
import { leaveDAL } from '../../../../shared/dal/leave.dal';
import { announcementDAL } from '../../../../shared/dal/announcement.dal';
import { LeaveModel, LeaveBalanceModel } from '../../../../shared/models/leave.model';

export class DashboardService {
  async getDashboardStats() {
    const totalUsers = await userDAL.findAll({ isActive: true });
    const todayAttendance = await attendanceDAL.getTodayAttendance();
    const pendingLeaves = await leaveDAL.getPendingLeaves();
    const employeesOnLeave = await leaveDAL.getEmployeesOnLeaveToday();
    const getYetToCheckInCount = await userDAL.getYetToCheckInCount();

    const presentCount = todayAttendance.filter(a => a.status === 'PRESENT').length;
    const absentCount = todayAttendance.filter(a => a.status === 'ABSENT').length;
    const lateCount = todayAttendance.filter(a => a.isLate).length;
    const wfhCount = todayAttendance.filter(a => a.status === 'WFH').length;

    const newHires = await userDAL.getNewHires(30);
    return {
      totalEmployees: totalUsers.total,
      attendance: {
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        wfh: wfhCount,
        onLeave: employeesOnLeave.length,
        getYetToCheckInCount: getYetToCheckInCount
      },
      leaves: {
        pending: pendingLeaves.length,
        onLeaveToday: employeesOnLeave.length
      },
      newHires: newHires.length
    };
  }

  async getBirthdays() {
    return await userDAL.getBirthdaysToday();
  }

  async getNewHires(days: number = 30) {
    return await userDAL.getNewHires(days);
  }

  async getRecentAnnouncements(userId: string, userRole: string, userDepartment: string) {
    return await announcementDAL.getActiveAnnouncementsForUser(userId, userRole, userDepartment);
  }


  async getAnniversary() {
    return await userDAL.getAnniversaryToday();
  }


  /**
   * ✅ NEW - Get complete leave statistics for all users
   */
  async getLeaveStatistics() {
    const currentYear = new Date().getFullYear();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // Total leave requests (all time or current year)
    const totalLeaveRequests = await LeaveModel.countDocuments({
      appliedDate: { $gte: new Date(currentYear, 0, 1) }
    });

    // Approved leaves
    const approvedLeaves = await LeaveModel.countDocuments({
      status: 'APPROVED',
      appliedDate: { $gte: new Date(currentYear, 0, 1) }
    });

    // Pending approvals
    const pendingApprovals = await LeaveModel.countDocuments({
      status: 'PENDING'
    });

    // Last month's requests for comparison
    const lastMonthRequests = await LeaveModel.countDocuments({
      appliedDate: {
        $gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
        $lt: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 1)
      }
    });

    // Current month's requests
    const currentMonth = new Date();
    const currentMonthRequests = await LeaveModel.countDocuments({
      appliedDate: {
        $gte: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
        $lt: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
      }
    });

    // Calculate percentage change
    const percentageChange : any = lastMonthRequests > 0
      ? (((currentMonthRequests - lastMonthRequests) / lastMonthRequests) * 100).toFixed(1)
      : '+0';

    // Approval rate
    const approvalRate = totalLeaveRequests > 0
      ? ((approvedLeaves / totalLeaveRequests) * 100).toFixed(0)
      : '0';

    // Total leave balance remaining across all employees
    const leaveBalances = await LeaveBalanceModel.aggregate([
      {
        $match: { year: currentYear }
      },
      {
        $group: {
          _id: null,
          totalCasualRemaining: { $sum: '$casualLeave.remaining' },
          totalSickRemaining: { $sum: '$sickLeave.remaining' },
          totalEarnedRemaining: { $sum: '$earnedLeave.remaining' },
          totalCasualUsed: { $sum: '$casualLeave.used' },
          totalSickUsed: { $sum: '$sickLeave.used' },
          totalEarnedUsed: { $sum: '$earnedLeave.used' }
        }
      }
    ]);

    const balanceData = leaveBalances[0] || {
      totalCasualRemaining: 0,
      totalSickRemaining: 0,
      totalEarnedRemaining: 0,
      totalCasualUsed: 0,
      totalSickUsed: 0,
      totalEarnedUsed: 0
    };

    const totalLeaveRemaining = 
      balanceData.totalCasualRemaining + 
      balanceData.totalSickRemaining + 
      balanceData.totalEarnedRemaining;

    // Leave type breakdown
    const leaveTypeBreakdown = await LeaveModel.aggregate([
      {
        $match: {
          status: 'APPROVED',
          startDate: { $gte: new Date(currentYear, 0, 1) }
        }
      },
      {
        $group: {
          _id: '$leaveType',
          count: { $sum: 1 },
          totalDays: { $sum: '$numberOfDays' }
        }
      }
    ]);

    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrend = await LeaveModel.aggregate([
      {
        $match: {
          appliedDate: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$appliedDate' },
            month: { $month: '$appliedDate' }
          },
          count: { $sum: 1 },
          approved: {
            $sum: { $cond: [{ $eq: ['$status', 'APPROVED'] }, 1, 0] }
          },
          rejected: {
            $sum: { $cond: [{ $eq: ['$status', 'REJECTED'] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Department-wise leave statistics
    const departmentStats = await LeaveModel.aggregate([
      {
        $match: {
          status: 'APPROVED',
          startDate: { $gte: new Date(currentYear, 0, 1) }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $lookup: {
          from: 'departments',
          localField: 'user.professionalDetails.department',
          foreignField: '_id',
          as: 'department'
        }
      },
      {
        $unwind: { path: '$department', preserveNullAndEmptyArrays: true }
      },
      {
        $group: {
          _id: '$department.name',
          totalLeaves: { $sum: 1 },
          totalDays: { $sum: '$numberOfDays' }
        }
      },
      {
        $sort: { totalDays: -1 }
      }
    ]);

    return {
      summary: {
        totalLeaveRequests,
        approvedLeaves,
        pendingApprovals,
        totalLeaveRemaining,
        percentageChange: `${percentageChange >= 0 ? '+' : ''}${percentageChange}%`,
        approvalRate: `${approvalRate}%`
      },
      balance: {
        casual: {
          remaining: balanceData.totalCasualRemaining,
          used: balanceData.totalCasualUsed
        },
        sick: {
          remaining: balanceData.totalSickRemaining,
          used: balanceData.totalSickUsed
        },
        earned: {
          remaining: balanceData.totalEarnedRemaining,
          used: balanceData.totalEarnedUsed
        },
        total: totalLeaveRemaining
      },
      leaveTypeBreakdown,
      monthlyTrend,
      departmentStats
    };
  }

  /**
   * ✅ NEW - Get top leave takers
   */
  async getTopLeaveTakers(limit: number = 10) {
    const currentYear = new Date().getFullYear();

    return await LeaveModel.aggregate([
      {
        $match: {
          status: 'APPROVED',
          startDate: { $gte: new Date(currentYear, 0, 1) }
        }
      },
      {
        $group: {
          _id: '$userId',
          totalDays: { $sum: '$numberOfDays' },
          leaveCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 1,
          totalDays: 1,
          leaveCount: 1,
          name: {
            $concat: ['$user.firstName', ' ', '$user.lastName']
          },
          email: '$user.email',
          employeeId: '$user.professionalDetails.employeeId',
          department: '$user.professionalDetails.department'
        }
      },
      {
        $lookup: {
          from: 'departments',
          localField: 'department',
          foreignField: '_id',
          as: 'departmentInfo'
        }
      },
      {
        $unwind: { path: '$departmentInfo', preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          totalDays: 1,
          leaveCount: 1,
          name: 1,
          email: 1,
          employeeId: 1,
          departmentName: '$departmentInfo.name'
        }
      },
      {
        $sort: { totalDays: -1 }
      },
      {
        $limit: limit
      }
    ]);
  }
}

export const dashboardService = new DashboardService();
