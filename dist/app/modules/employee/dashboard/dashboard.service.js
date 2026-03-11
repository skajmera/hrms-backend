"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeDashboardService = exports.EmployeeDashboardService = void 0;
const attendance_dal_1 = require("../../../../shared/dal/attendance.dal");
const leave_dal_1 = require("../../../../shared/dal/leave.dal");
const announcement_dal_1 = require("../../../../shared/dal/announcement.dal");
const user_dal_1 = require("../../../../shared/dal/user.dal");
class EmployeeDashboardService {
    async getMyDashboard(userId, userRole, userDepartment) {
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        // Get attendance summary
        const attendanceStats = await attendance_dal_1.attendanceDAL.getUserAttendanceStats(userId, currentMonth, currentYear);
        // Get check-in summary (total, late, on-time)
        const checkInSummary = await attendance_dal_1.attendanceDAL.getUserMonthlyCheckInSummary(userId, currentMonth, currentYear);
        // Get leave balance
        const leaveBalance = await leave_dal_1.leaveDAL.getLeaveBalance(userId, currentYear);
        // Get pending leaves
        const myLeaves = await leave_dal_1.leaveDAL.findAll({ userId, status: 'PENDING' }, {});
        // Get announcements
        const announcements = await announcement_dal_1.announcementDAL.getActiveAnnouncementsForUser(userId, userRole, userDepartment);
        return {
            attendance: attendanceStats,
            checkInSummary,
            leaveBalance,
            pendingLeaves: myLeaves.total,
            announcements: announcements.slice(0, 5)
        };
    }
    async getBirthdays() {
        return await user_dal_1.userDAL.getBirthdaysToday();
    }
    async getAnniversary() {
        return await user_dal_1.userDAL.getAnniversaryToday();
    }
    async getNewHires(days = 30, date) {
        return await user_dal_1.userDAL.getNewHires(days, date);
    }
}
exports.EmployeeDashboardService = EmployeeDashboardService;
exports.employeeDashboardService = new EmployeeDashboardService();
//# sourceMappingURL=dashboard.service.js.map