"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeDashboardService = exports.EmployeeDashboardService = void 0;
const attendance_dal_1 = require("../../../../shared/dal/attendance.dal");
const leave_dal_1 = require("../../../../shared/dal/leave.dal");
const announcement_dal_1 = require("../../../../shared/dal/announcement.dal");
class EmployeeDashboardService {
    async getMyDashboard(userId, userRole, userDepartment) {
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        const attendanceStats = await attendance_dal_1.attendanceDAL.getUserAttendanceStats(userId, currentMonth, currentYear);
        const checkInSummary = await attendance_dal_1.attendanceDAL.getUserMonthlyCheckInSummary(userId, currentMonth, currentYear);
        const leaveBalance = await leave_dal_1.leaveDAL.getLeaveBalance(userId, currentYear);
        const myLeaves = await leave_dal_1.leaveDAL.findAll({ userId, status: 'PENDING' }, {});
        const announcements = await announcement_dal_1.announcementDAL.getActiveAnnouncementsForUser(userId, userRole, userDepartment);
        return {
            attendance: attendanceStats,
            checkInSummary,
            leaveBalance,
            pendingLeaves: myLeaves.total,
            announcements: announcements.slice(0, 5)
        };
    }
    async getBirthdays(userId, userRole, deptId) {
        const options = { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' };
        return await this.getAllAnnouncementsByType('BIRTHDAY', userId, userRole, deptId, options);
    }
    async getAnniversary(userId, userRole, deptId) {
        const options = { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' };
        return await this.getAllAnnouncementsByType('ANNIVERSARY', userId, userRole, deptId, options);
    }
    async getNewHires(userId, userRole, deptId) {
        const options = { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' };
        return await this.getAllAnnouncementsByType('NEWHIRE', userId, userRole, deptId, options);
    }
    async getAllAnnouncementsByType(type, userId, userRole, deptId, options) {
        const filters = {
            ...announcement_dal_1.announcementDAL.getActiveFilter(),
            announcementType: type,
            $or: [
                { 'targetAudience.isGlobal': true },
                { 'targetAudience.roles': userRole },
                { 'targetAudience.departments': deptId },
                { 'targetAudience.specificUsers': userId }
            ]
        };
        return await announcement_dal_1.announcementDAL.findAll(filters, options);
    }
    async getAllAnnouncements(userId, userRole, deptId, options) {
        // Use active filter + audience targeting for employee-visible announcements
        const filters = {
            ...announcement_dal_1.announcementDAL.getActiveFilter(),
            $or: [
                { 'targetAudience.isGlobal': true },
                { 'targetAudience.roles': userRole },
                { 'targetAudience.departments': deptId },
                { 'targetAudience.specificUsers': userId }
            ]
        };
        return await announcement_dal_1.announcementDAL.findAll(filters, options);
    }
}
exports.EmployeeDashboardService = EmployeeDashboardService;
exports.employeeDashboardService = new EmployeeDashboardService();
//# sourceMappingURL=dashboard.service.js.map