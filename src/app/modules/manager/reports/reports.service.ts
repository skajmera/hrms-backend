import { userDAL } from '../../../../shared/dal/user.dal';
import { attendanceDAL } from '../../../../shared/dal/attendance.dal';
import { leaveDAL } from '../../../../shared/dal/leave.dal';
import { payrollDAL } from '../../../../shared/dal/payroll.dal';

export class ReportsService {
  /**
   * Generate attendance report
   */
  async generateAttendanceReport(startDate: Date, endDate: Date, departmentId?: string) {
    const filters: any = {
      date: { $gte: startDate, $lte: endDate }
    };

    const attendance = await attendanceDAL.findAll(filters, { limit: 10000 });

    // Group by user
    const userStats: any = {};
    
    attendance.records.forEach((record: any) => {
      const userId = record.userId._id.toString();
      
      if (!userStats[userId]) {
        userStats[userId] = {
          user: record.userId,
          present: 0,
          absent: 0,
          late: 0,
          wfh: 0,
          halfDay: 0,
          totalHours: 0
        };
      }

      if (record.status === 'PRESENT') userStats[userId].present++;
      if (record.status === 'ABSENT') userStats[userId].absent++;
      if (record.status === 'LATE') userStats[userId].late++;
      if (record.status === 'WFH') userStats[userId].wfh++;
      if (record.status === 'HALF_DAY') userStats[userId].halfDay++;
      
      userStats[userId].totalHours += record.workingHours || 0;
    });

    return Object.values(userStats);
  }

  /**
   * Generate leave report
   */
  async generateLeaveReport(year: number, departmentId?: string) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const leaves = await leaveDAL.findAll({
      startDate: { $gte: startDate },
      endDate: { $lte: endDate }
    }, { limit: 10000 });

    // Group by user and leave type
    const userLeaveStats: any = {};

    leaves.leaves.forEach((leave: any) => {
      const userId = leave.userId._id.toString();
      
      if (!userLeaveStats[userId]) {
        userLeaveStats[userId] = {
          user: leave.userId,
          casual: { total: 0, approved: 0, pending: 0, rejected: 0 },
          sick: { total: 0, approved: 0, pending: 0, rejected: 0 },
          earned: { total: 0, approved: 0, pending: 0, rejected: 0 }
        };
      }

      const type = leave.leaveType.toLowerCase();
      if (userLeaveStats[userId][type]) {
        userLeaveStats[userId][type].total += leave.numberOfDays;
        if (leave.status === 'APPROVED') userLeaveStats[userId][type].approved += leave.numberOfDays;
        if (leave.status === 'PENDING') userLeaveStats[userId][type].pending += leave.numberOfDays;
        if (leave.status === 'REJECTED') userLeaveStats[userId][type].rejected += leave.numberOfDays;
      }
    });

    return Object.values(userLeaveStats);
  }

  /**
   * Generate payroll report
   */
  async generatePayrollReport(month: number, year: number) {
    const payrolls = await payrollDAL.findByMonthYear(month, year);

    const totalGross = payrolls.reduce((sum, p) => sum + p.grossSalary, 0);
    const totalNet = payrolls.reduce((sum, p) => sum + p.netSalary, 0);
    const totalDeductions = payrolls.reduce((sum, p) => sum + p.totalDeductions, 0);

    return {
      payrolls,
      summary: {
        totalEmployees: payrolls.length,
        totalGrossSalary: totalGross,
        totalNetSalary: totalNet,
        totalDeductions: totalDeductions,
        averageSalary: totalNet / payrolls.length || 0
      }
    };
  }

  /**
   * Generate employee headcount report
   */
  async generateHeadcountReport() {
    const users = await userDAL.findAll({ isActive: true }, { limit: 10000 });

    const byDepartment: any = {};
    const byRole: any = {};
    const byEmploymentStatus: any = {};

    users.users.forEach((user: any) => {
      // By department
      const dept = user.professionalDetails.department?.name || 'Unassigned';
      byDepartment[dept] = (byDepartment[dept] || 0) + 1;

      // By role
      byRole[user.role] = (byRole[user.role] || 0) + 1;

      // By employment status
      const status = user.professionalDetails.employmentStatus;
      byEmploymentStatus[status] = (byEmploymentStatus[status] || 0) + 1;
    });

    return {
      total: users.total,
      byDepartment,
      byRole,
      byEmploymentStatus
    };
  }
}

export const reportsService = new ReportsService();