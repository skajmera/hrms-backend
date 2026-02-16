import { attendanceDAL } from '../../../../shared/dal/attendance.dal';
import { leaveDAL } from '../../../../shared/dal/leave.dal';
import { userDAL } from '../../../../shared/dal/user.dal';
import { AttendanceModel } from '../../../../shared/models/attendance.model';
import { LeaveModel } from '../../../../shared/models/leave.model';

interface AttendanceStats {
  avgAttendanceRate: number;
  avgWorkingHours: number;
  totalOvertimeHours: number;
  leavesTaken: number;
  previousMonthComparison: {
    attendanceChange: number;
    workingHoursChange: number;
    overtimeChange: number;
    leavesChange: number;
  };
}

export class AnalyticsService {
  /**
   * Get comprehensive attendance statistics
   */
  async getAttendanceStatistics(
    month: number,
    year: number,
    departmentId?: string
  ): Promise<AttendanceStats> {
    // Current month stats
    const currentStats = await this.calculateMonthStats(month, year, departmentId);

    // Previous month stats for comparison
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const previousStats = await this.calculateMonthStats(prevMonth, prevYear, departmentId);

    // Calculate percentage changes
    const attendanceChange = this.calculatePercentageChange(
      previousStats.avgAttendanceRate,
      currentStats.avgAttendanceRate
    );

    const workingHoursChange = this.calculateAbsoluteChange(
      previousStats.avgWorkingHours,
      currentStats.avgWorkingHours
    );

    const overtimeChange = this.calculatePercentageChange(
      previousStats.totalOvertimeHours,
      currentStats.totalOvertimeHours
    );

    const leavesChange = this.calculatePercentageChange(
      previousStats.leavesTaken,
      currentStats.leavesTaken
    );

    return {
      avgAttendanceRate: currentStats.avgAttendanceRate,
      avgWorkingHours: currentStats.avgWorkingHours,
      totalOvertimeHours: currentStats.totalOvertimeHours,
      leavesTaken: currentStats.leavesTaken,
      previousMonthComparison: {
        attendanceChange,
        workingHoursChange,
        overtimeChange,
        leavesChange
      }
    };
  }

  /**
   * Calculate statistics for a specific month
   */
  private async calculateMonthStats(
    month: number,
    year: number,
    departmentId?: string
  ) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Get all active employees
    const employeeFilters: any = { isActive: true };
    if (departmentId) {
      employeeFilters['professionalDetails.department'] = departmentId;
    }

    const employees = await userDAL.findAll(employeeFilters, { limit: 10000 });
    const totalEmployees = employees.total;

    // Get attendance records for the month
    const attendanceFilters: any = {
      date: { $gte: startDate, $lte: endDate }
    };

    const attendanceRecords = await AttendanceModel.find(attendanceFilters);

    // Calculate working days in month
    const workingDays = this.getWorkingDaysInMonth(year, month);

    // Calculate metrics
    const totalPossibleAttendance = totalEmployees * workingDays;
    const totalPresent = attendanceRecords.filter(
      r => ['PRESENT', 'LATE', 'WFH'].includes(r.status)
    ).length;

    // Avg Attendance Rate
    const avgAttendanceRate = (totalPresent / totalPossibleAttendance) * 100;

    // Avg Working Hours
    const totalWorkingHours = attendanceRecords.reduce(
      (sum, record) => sum + (record.workingHours || 0),
      0
    );
    const avgWorkingHours = totalWorkingHours / (totalPresent || 1);
    // Get average shift minimum hours for comparison
    const users = await userDAL.findAll(
      departmentId ? { 'professionalDetails.department': departmentId, isActive: true } : { isActive: true },
      { limit: 10000 }
    );

    const avgMinimumHours = users.users.reduce((sum, user) => {
      return sum + (user.professionalDetails.shiftTime?.minimumHours || 8);
    }, 0) / (users.total || 1);
    // Total Overtime Hours
    const totalOvertimeHours = attendanceRecords.reduce(
      (sum, record) => sum + (record.overtimeHours || 0),
      0
    );

    // Leaves Taken
    const leaveRecords = await LeaveModel.find({
      startDate: { $gte: startDate, $lte: endDate },
      status: 'APPROVED'
    });

    const leavesTaken = leaveRecords.reduce(
      (sum, leave) => sum + leave.numberOfDays,
      0
    );

    return {
      avgAttendanceRate: parseFloat(avgAttendanceRate.toFixed(2)),
      avgWorkingHours: parseFloat(avgWorkingHours.toFixed(1)),
      totalOvertimeHours: parseFloat(totalOvertimeHours.toFixed(1)),
      avgMinimumHours: parseFloat(avgMinimumHours.toFixed(1)),
      leavesTaken
    };
  }

  /**
   * Calculate percentage change
   */
  private calculatePercentageChange(oldValue: number, newValue: number): number {
    if (oldValue === 0) return 0;
    const change = ((newValue - oldValue) / oldValue) * 100;
    return parseFloat(change.toFixed(1));
  }

  /**
   * Calculate absolute change
   */
  private calculateAbsoluteChange(oldValue: number, newValue: number): number {
    return parseFloat((newValue - oldValue).toFixed(1));
  }

  /**
   * Get working days in a month (excluding weekends)
   */
  private getWorkingDaysInMonth(year: number, month: number): number {
    const totalDays = new Date(year, month, 0).getDate();
    let workingDays = 0;

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay();

      // Exclude Sunday (0) and Saturday (6)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDays++;
      }
    }

    return workingDays;
  }

  /**
   * Get department-wise analytics
   */
  async getDepartmentWiseAnalytics(month: number, year: number) {
    const departments = await userDAL.findAll(
      { isActive: true },
      { limit: 10000 }
    );

    // Group employees by department
    const departmentMap = new Map();

    departments.users.forEach(user => {
      const deptId = user.professionalDetails.department?._id?.toString();
      const deptName = user.professionalDetails.department?.name || 'Unassigned';

      if (!departmentMap.has(deptId)) {
        departmentMap.set(deptId, {
          departmentId: deptId,
          departmentName: deptName,
          employeeCount: 0
        });
      }

      const dept = departmentMap.get(deptId);
      dept.employeeCount++;
    });

    // Get stats for each department
    const departmentStats = [];

    for (const [deptId, deptInfo] of departmentMap.entries()) {
      if (deptId) {
        const stats = await this.getAttendanceStatistics(month, year, deptId);
        departmentStats.push({
          ...deptInfo,
          ...stats
        });
      }
    }

    return departmentStats;
  }

  /**
   * Get employee performance analytics
   */
  async getEmployeePerformanceAnalytics(
    userId: string,
    month: number,
    year: number
  ) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Get attendance records
    const attendanceRecords = await AttendanceModel.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    });

    const workingDays = this.getWorkingDaysInMonth(year, month);

    const presentDays = attendanceRecords.filter(
      r => ['PRESENT', 'LATE', 'WFH'].includes(r.status)
    ).length;

    const lateDays = attendanceRecords.filter(r => r.isLate).length;

    const totalWorkingHours = attendanceRecords.reduce(
      (sum, r) => sum + (r.workingHours || 0),
      0
    );

    const totalOvertimeHours = attendanceRecords.reduce(
      (sum, r) => sum + (r.overtimeHours || 0),
      0
    );

    // Get leaves
    const leaves = await LeaveModel.find({
      userId,
      startDate: { $gte: startDate, $lte: endDate },
      status: 'APPROVED'
    });

    const totalLeaveDays = leaves.reduce((sum, l) => sum + l.numberOfDays, 0);

    return {
      workingDays,
      presentDays,
      absentDays: workingDays - presentDays - totalLeaveDays,
      lateDays,
      leaveDays: totalLeaveDays,
      attendanceRate: (presentDays / workingDays) * 100,
      avgWorkingHours: totalWorkingHours / (presentDays || 1),
      totalOvertimeHours,
      punctualityScore: ((presentDays - lateDays) / presentDays) * 100
    };
  }

  /**
   * Get trend data for charts
   */
  async getAttendanceTrend(year: number, departmentId?: string) {
    const monthlyData = [];

    for (let month = 1; month <= 12; month++) {
      const stats = await this.calculateMonthStats(month, year, departmentId);
      monthlyData.push({
        month,
        monthName: new Date(year, month - 1).toLocaleString('default', { month: 'short' }),
        ...stats
      });
    }

    return monthlyData;
  }

  /**
   * Get leave statistics
   */
  async getLeaveStatistics(month: number, year: number, departmentId?: string) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const filters: any = {
      startDate: { $gte: startDate, $lte: endDate }
    };

    const leaves = await LeaveModel.find(filters)
      .populate('userId', 'professionalDetails.department');

    // Filter by department if specified
    const filteredLeaves = departmentId
      ? leaves.filter(l => (l.userId as any).professionalDetails?.department?.toString() === departmentId)
      : leaves;

    // Group by leave type
    const leavesByType = filteredLeaves.reduce((acc: any, leave) => {
      const type = leave.leaveType;
      if (!acc[type]) {
        acc[type] = { count: 0, days: 0 };
      }
      acc[type].count++;
      acc[type].days += leave.numberOfDays;
      return acc;
    }, {});

    // Group by status
    const leavesByStatus = filteredLeaves.reduce((acc: any, leave) => {
      const status = leave.status;
      if (!acc[status]) {
        acc[status] = { count: 0, days: 0 };
      }
      acc[status].count++;
      acc[status].days += leave.numberOfDays;
      return acc;
    }, {});

    const totalEmployees = await userDAL.findAll(
      departmentId ? { 'professionalDetails.department': departmentId, isActive: true } : { isActive: true },
      {}
    );

    const employeesOnLeave = new Set(filteredLeaves.map(l => l.userId.toString())).size;
    const leavePercentage = (employeesOnLeave / totalEmployees.total) * 100;

    return {
      totalLeaves: filteredLeaves.length,
      totalLeaveDays: filteredLeaves.reduce((sum, l) => sum + l.numberOfDays, 0),
      leavesByType,
      leavesByStatus,
      employeesOnLeave,
      leavePercentage: parseFloat(leavePercentage.toFixed(1))
    };
  }

  /**
   * Get real-time dashboard stats
   */
  async getRealTimeDashboardStats() {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // Today's attendance
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const todayAttendance = await AttendanceModel.find({
      date: { $gte: todayStart, $lte: todayEnd }
    });

    const totalEmployees = await userDAL.findAll({ isActive: true }, {});

    const presentToday = todayAttendance.filter(
      r => ['PRESENT', 'LATE', 'WFH'].includes(r.status)
    ).length;

    const absentToday = totalEmployees.total - presentToday;
    const lateToday = todayAttendance.filter(r => r.isLate).length;

    // Get month stats
    const monthStats = await this.getAttendanceStatistics(currentMonth, currentYear);

    // Get pending approvals
    const pendingLeaves = await LeaveModel.countDocuments({ status: 'PENDING' });

    return {
      today: {
        date: today.toISOString(),
        totalEmployees: totalEmployees.total,
        present: presentToday,
        absent: absentToday,
        late: lateToday,
        attendanceRate: (presentToday / totalEmployees.total) * 100
      },
      currentMonth: {
        month: currentMonth,
        year: currentYear,
        ...monthStats
      },
      pendingActions: {
        pendingLeaveApprovals: pendingLeaves
      }
    };
  }
}

export const analyticsService = new AnalyticsService();