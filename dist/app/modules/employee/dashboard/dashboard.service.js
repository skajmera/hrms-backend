"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeDashboardService = exports.EmployeeDashboardService = void 0;
const attendance_dal_1 = require("../../../../shared/dal/attendance.dal");
const leave_dal_1 = require("../../../../shared/dal/leave.dal");
const announcement_dal_1 = require("../../../../shared/dal/announcement.dal");
const workingDays_1 = require("../../../../shared/utils/workingDays");
class EmployeeDashboardService {
    async getMyDashboard(userId, userRole, userDepartment, organizationId) {
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        const [attendanceStatsRaw, checkInSummaryRaw, leaveBalance, myLeaves, announcements, workingDays] = await Promise.all([
            attendance_dal_1.attendanceDAL.getUserAttendanceStats(userId, currentMonth, currentYear),
            attendance_dal_1.attendanceDAL.getUserMonthlyCheckInSummary(userId, currentMonth, currentYear),
            leave_dal_1.leaveDAL.getLeaveBalance(userId, currentYear),
            leave_dal_1.leaveDAL.findAll({ userId, status: 'PENDING' }, {}),
            announcement_dal_1.announcementDAL.getActiveAnnouncementsForUser(userId, userRole, userDepartment),
            (0, workingDays_1.getWorkingDaysForMonth)(currentYear, currentMonth, organizationId)
        ]);
        const attendanceStats = (attendanceStatsRaw || []).reduce((acc, row) => {
            acc[row._id] = row.count;
            return acc;
        }, {});
        const checkInSummary = {
            total: checkInSummaryRaw?.checkin || 0,
            onTime: checkInSummaryRaw?.ontime || 0,
            late: checkInSummaryRaw?.late || 0,
            remaining: Math.max(workingDays - (checkInSummaryRaw?.checkin || 0), 0),
            workingDays,
            // backward compatible keys (older apps)
            checkin: checkInSummaryRaw?.checkin || 0,
            ontime: checkInSummaryRaw?.ontime || 0
        };
        return {
            attendance: {
                total: workingDays,
                present: attendanceStats.PRESENT || 0,
                absent: attendanceStats.ABSENT || 0,
                late: attendanceStats.LATE || 0,
                wfh: attendanceStats.WFH || 0,
                halfDay: attendanceStats.HALF_DAY || 0,
                onLeave: attendanceStats.ON_LEAVE || 0,
                workingDays
            },
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
        const { announcements, total } = await announcement_dal_1.announcementDAL.findTypedWithUsers('NEWHIRE', options, true);
        const visible = (announcements || []).filter((a) => {
            const ta = a.targetAudience || {};
            const roles = ta.roles || [];
            const departments = ta.departments || [];
            const specificUsers = ta.specificUsers || [];
            return (ta.isGlobal === true ||
                roles.includes(userRole) ||
                departments.some(d => (d?._id || d)?.toString?.() === deptId) ||
                specificUsers.some(u => (u?._id || u)?.toString?.() === userId));
        });
        return { announcements: visible, total: visible.length };
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
    async getAllAnnouncements(userId, userRole, deptId, options, queryFilters = {}) {
        // Use active filter + audience targeting for employee-visible announcements
        const activeFilter = announcement_dal_1.announcementDAL.getActiveFilter();
        if (queryFilters.date) {
            const refDate = new Date(queryFilters.date);
            if (!Number.isNaN(refDate.getTime())) {
                activeFilter.startDate = { $lte: refDate };
                activeFilter.$or = [{ expiryDate: { $exists: false } }, { expiryDate: { $gte: refDate } }];
            }
        }
        const filters = {
            ...activeFilter,
            $or: [
                { 'targetAudience.isGlobal': true },
                { 'targetAudience.roles': userRole },
                { 'targetAudience.departments': deptId },
                { 'targetAudience.specificUsers': userId }
            ]
        };
        if (queryFilters.announcementType) {
            filters.announcementType = queryFilters.announcementType;
        }
        return await announcement_dal_1.announcementDAL.findAll(filters, options);
    }
}
exports.EmployeeDashboardService = EmployeeDashboardService;
exports.employeeDashboardService = new EmployeeDashboardService();
//# sourceMappingURL=dashboard.service.js.map