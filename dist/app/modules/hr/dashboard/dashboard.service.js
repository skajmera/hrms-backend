"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = exports.DashboardService = void 0;
const user_dal_1 = require("../../../../shared/dal/user.dal");
const attendance_dal_1 = require("../../../../shared/dal/attendance.dal");
const leave_dal_1 = require("../../../../shared/dal/leave.dal");
const announcement_dal_1 = require("../../../../shared/dal/announcement.dal");
const leave_model_1 = require("../../../../shared/models/leave.model");
const organization_dal_1 = require("../../../../shared/dal/organization.dal");
const holiday_dal_1 = require("../../../../shared/dal/holiday.dal");
const constants_1 = require("../../../../config/constants");
class DashboardService {
    async getDashboardStats(organizationId) {
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        const userFilters = { isActive: true, 'professionalDetails.employmentStatus': { $in: [constants_1.EMPLOYMENT_STATUS.ACTIVE, constants_1.EMPLOYMENT_STATUS.PROBATION] }, ...(organizationId ? { organizationId } : {}) };
        const [employeeIds, todayAttendanceRaw, pendingLeaves, employeesOnLeaveRaw, newHires, workingDays] = await Promise.all([
            user_dal_1.userDAL.findIds(userFilters),
            attendance_dal_1.attendanceDAL.getTodayAttendance(),
            leave_dal_1.leaveDAL.getPendingLeaves(),
            leave_dal_1.leaveDAL.getEmployeesOnLeaveToday(),
            user_dal_1.userDAL.getNewHires(30),
            this.getWorkingDaysForMonth(currentYear, currentMonth, organizationId)
        ]);
        const empSet = new Set(employeeIds);
        const todayAttendance = (todayAttendanceRaw || []).filter((a) => empSet.has((a.userId?._id || a.userId)?.toString?.()));
        const employeesOnLeave = (employeesOnLeaveRaw || []).filter((l) => empSet.has((l.userId?._id || l.userId)?.toString?.()));
        const presentCount = todayAttendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
        const absentCount = todayAttendance.filter(a => a.status === 'ABSENT').length;
        const lateCount = todayAttendance.filter((a) => !!a.checkInTime && (a.isLate === true || (a.lateByMinutes ?? 0) > 0)).length;
        const wfhCount = todayAttendance.filter(a => a.status === 'WFH').length;
        const totalEmployees = employeeIds.length;
        const checkedInCount = todayAttendance.filter((a) => !!a.checkInTime).length;
        const onTimeCount = Math.max(checkedInCount - lateCount, 0);
        const expectedToCheckIn = Math.max(totalEmployees - employeesOnLeave.length, 0);
        const yetToCheckIn = Math.max(expectedToCheckIn - checkedInCount, 0);
        return {
            totalEmployees,
            attendance: { present: presentCount, absent: absentCount, late: lateCount, wfh: wfhCount, onLeave: employeesOnLeave.length, yetToCheckIn, workingDays },
            checkInSummary: { totalEmployees, checkedIn: checkedInCount, onTime: onTimeCount, late: lateCount, yetToCheckIn, workingDays },
            leaves: { pending: pendingLeaves.length, onLeaveToday: employeesOnLeave.length },
            newHires: newHires.length
        };
    }
    async getWorkingDaysForMonth(year, month, organizationId) {
        const totalDays = new Date(year, month, 0).getDate();
        let workingDaysConfig = { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: false, sunday: false };
        if (organizationId) {
            const org = await organization_dal_1.OrganizationDAL.findById(organizationId);
            if (org?.settings?.workingDays) {
                workingDaysConfig = {
                    monday: org.settings.workingDays.monday,
                    tuesday: org.settings.workingDays.tuesday,
                    wednesday: org.settings.workingDays.wednesday,
                    thursday: org.settings.workingDays.thursday,
                    friday: org.settings.workingDays.friday,
                    saturday: org.settings.workingDays.saturday,
                    sunday: org.settings.workingDays.sunday
                };
            }
        }
        const allHolidays = await holiday_dal_1.holidayDAL.getHolidaysByYear(year);
        const monthHolidays = allHolidays.filter(h => new Date(h.date).getMonth() + 1 === month);
        const isHoliday = (date) => monthHolidays.some(h => {
            const hd = new Date(h.date);
            return hd.getFullYear() === date.getFullYear() && hd.getMonth() === date.getMonth() && hd.getDate() === date.getDate();
        });
        let workingDays = 0;
        for (let day = 1; day <= totalDays; day++) {
            const date = new Date(year, month - 1, day);
            const dayOfWeek = date.getDay(); // 0 = Sunday
            const key = dayOfWeek === 0
                ? 'sunday'
                : dayOfWeek === 1
                    ? 'monday'
                    : dayOfWeek === 2
                        ? 'tuesday'
                        : dayOfWeek === 3
                            ? 'wednesday'
                            : dayOfWeek === 4
                                ? 'thursday'
                                : dayOfWeek === 5
                                    ? 'friday'
                                    : 'saturday';
            if (workingDaysConfig[key] && !isHoliday(date)) {
                workingDays++;
            }
        }
        return workingDays;
    }
    async getBirthdays() {
        return await user_dal_1.userDAL.getBirthdaysToday();
    }
    async getNewHires(days = 30, date) {
        return await user_dal_1.userDAL.getNewHires(days, date);
    }
    async getRecentAnnouncements(userId, userRole, userDepartment) {
        return await announcement_dal_1.announcementDAL.getActiveAnnouncementsForUser(userId, userRole, userDepartment);
    }
    async getAnniversary() {
        return await user_dal_1.userDAL.getAnniversaryToday();
    }
    /**
     * ✅ NEW - Get complete leave statistics for all users
     */
    async getLeaveStatistics() {
        const currentYear = new Date().getFullYear();
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        // Total leave requests (all time or current year)
        const totalLeaveRequests = await leave_model_1.LeaveModel.countDocuments({ appliedDate: { $gte: new Date(currentYear, 0, 1) } });
        // Approved leaves
        const approvedLeaves = await leave_model_1.LeaveModel.countDocuments({ status: 'APPROVED', appliedDate: { $gte: new Date(currentYear, 0, 1) } });
        // Pending approvals
        const pendingApprovals = await leave_model_1.LeaveModel.countDocuments({ status: 'PENDING' });
        // Last month's requests for comparison
        const lastMonthRequests = await leave_model_1.LeaveModel.countDocuments({
            appliedDate: { $gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1), $lt: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 1) }
        });
        // Current month's requests
        const currentMonth = new Date();
        const currentMonthRequests = await leave_model_1.LeaveModel.countDocuments({
            appliedDate: { $gte: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1), $lt: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1) }
        });
        // Calculate percentage change
        const percentageChange = lastMonthRequests > 0
            ? (((currentMonthRequests - lastMonthRequests) / lastMonthRequests) * 100).toFixed(1)
            : '+0';
        // Approval rate
        const approvalRate = totalLeaveRequests > 0
            ? ((approvedLeaves / totalLeaveRequests) * 100).toFixed(0)
            : '0';
        // Total leave balance remaining across all employees
        const leaveBalances = await leave_model_1.LeaveBalanceModel.aggregate([
            { $match: { year: currentYear } },
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
        const totalLeaveRemaining = balanceData.totalCasualRemaining +
            balanceData.totalSickRemaining +
            balanceData.totalEarnedRemaining;
        // Leave type breakdown
        const leaveTypeBreakdown = await leave_model_1.LeaveModel.aggregate([
            { $match: { status: 'APPROVED', startDate: { $gte: new Date(currentYear, 0, 1) } } },
            { $group: { _id: '$leaveType', count: { $sum: 1 }, totalDays: { $sum: '$numberOfDays' } } }
        ]);
        // Monthly trend (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const monthlyTrend = await leave_model_1.LeaveModel.aggregate([
            { $match: { appliedDate: { $gte: sixMonthsAgo } } },
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
        const departmentStats = await leave_model_1.LeaveModel.aggregate([
            { $match: { status: 'APPROVED', startDate: { $gte: new Date(currentYear, 0, 1) } } },
            { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $lookup: { from: 'departments', localField: 'user.professionalDetails.department', foreignField: '_id', as: 'department' } },
            { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
            { $group: { _id: '$department.name', totalLeaves: { $sum: 1 }, totalDays: { $sum: '$numberOfDays' } } },
            { $sort: { totalDays: -1 } }
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
    async getTopLeaveTakers(limit = 10) {
        const currentYear = new Date().getFullYear();
        return await leave_model_1.LeaveModel.aggregate([
            { $match: { status: 'APPROVED', startDate: { $gte: new Date(currentYear, 0, 1) } } },
            { $group: { _id: '$userId', totalDays: { $sum: '$numberOfDays' }, leaveCount: { $sum: 1 } } },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            {
                $project: {
                    _id: 1,
                    totalDays: 1,
                    leaveCount: 1,
                    name: { $concat: ['$user.firstName', ' ', '$user.lastName'] },
                    email: '$user.email',
                    employeeId: '$user.professionalDetails.employeeId',
                    department: '$user.professionalDetails.department'
                }
            },
            { $lookup: { from: 'departments', localField: 'department', foreignField: '_id', as: 'departmentInfo' } },
            { $unwind: { path: '$departmentInfo', preserveNullAndEmptyArrays: true } },
            { $project: { totalDays: 1, leaveCount: 1, name: 1, email: 1, employeeId: 1, departmentName: '$departmentInfo.name' } },
            { $sort: { totalDays: -1 } },
            { $limit: limit }
        ]);
    }
}
exports.DashboardService = DashboardService;
exports.dashboardService = new DashboardService();
//# sourceMappingURL=dashboard.service.js.map