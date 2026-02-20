"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportsService = exports.ReportsService = void 0;
const user_dal_1 = require("../../../../shared/dal/user.dal");
const attendance_dal_1 = require("../../../../shared/dal/attendance.dal");
const leave_dal_1 = require("../../../../shared/dal/leave.dal");
const payroll_dal_1 = require("../../../../shared/dal/payroll.dal");
class ReportsService {
    /**
     * Generate attendance report
     */
    async generateAttendanceReport(startDate, endDate, departmentId) {
        const filters = {
            date: { $gte: startDate, $lte: endDate }
        };
        const attendance = await attendance_dal_1.attendanceDAL.findAll(filters, { limit: 10000 });
        // Group by user
        const userStats = {};
        attendance.records.forEach((record) => {
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
            if (record.status === 'PRESENT')
                userStats[userId].present++;
            if (record.status === 'ABSENT')
                userStats[userId].absent++;
            if (record.status === 'LATE')
                userStats[userId].late++;
            if (record.status === 'WFH')
                userStats[userId].wfh++;
            if (record.status === 'HALF_DAY')
                userStats[userId].halfDay++;
            userStats[userId].totalHours += record.workingHours || 0;
        });
        return Object.values(userStats);
    }
    /**
     * Generate leave report
     */
    async generateLeaveReport(year, departmentId) {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);
        const leaves = await leave_dal_1.leaveDAL.findAll({
            startDate: { $gte: startDate },
            endDate: { $lte: endDate }
        }, { limit: 10000 });
        // Group by user and leave type
        const userLeaveStats = {};
        leaves.leaves.forEach((leave) => {
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
                if (leave.status === 'APPROVED')
                    userLeaveStats[userId][type].approved += leave.numberOfDays;
                if (leave.status === 'PENDING')
                    userLeaveStats[userId][type].pending += leave.numberOfDays;
                if (leave.status === 'REJECTED')
                    userLeaveStats[userId][type].rejected += leave.numberOfDays;
            }
        });
        return Object.values(userLeaveStats);
    }
    /**
     * Generate payroll report
     */
    async generatePayrollReport(month, year) {
        const payrolls = await payroll_dal_1.payrollDAL.findByMonthYear(month, year);
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
        const users = await user_dal_1.userDAL.findAll({ isActive: true }, { limit: 10000 });
        const byDepartment = {};
        const byRole = {};
        const byEmploymentStatus = {};
        users.users.forEach((user) => {
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
exports.ReportsService = ReportsService;
exports.reportsService = new ReportsService();
//# sourceMappingURL=reports.service.js.map