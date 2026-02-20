"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.managerTeamService = exports.ManagerTeamService = void 0;
const user_dal_1 = require("../../../../shared/dal/user.dal");
const attendance_dal_1 = require("../../../../shared/dal/attendance.dal");
const leave_dal_1 = require("../../../../shared/dal/leave.dal");
class ManagerTeamService {
    /**
     * Get team members
     */
    async getTeamMembers(managerId) {
        return await user_dal_1.userDAL.findAll({ 'professionalDetails.reportingManager': managerId, isActive: true }, {});
    }
    /**
     * Get team attendance today
     */
    async getTeamAttendanceToday(managerId) {
        const team = await this.getTeamMembers(managerId);
        const teamIds = team.users.map(u => u._id.toString());
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const attendance = await attendance_dal_1.attendanceDAL.findAll({
            userId: { $in: teamIds },
            date: { $gte: today, $lt: tomorrow }
        }, {});
        return attendance.records;
    }
    /**
     * Get team leave requests (pending)
     */
    async getTeamLeaveRequests(managerId) {
        const team = await this.getTeamMembers(managerId);
        const teamIds = team.users.map(u => u._id.toString());
        return await leave_dal_1.leaveDAL.findAll({ userId: { $in: teamIds }, status: 'PENDING' }, {});
    }
    /**
     * Get team member details
     */
    async getTeamMemberDetails(managerId, userId) {
        const user = await user_dal_1.userDAL.findById(userId);
        if (!user || user.professionalDetails.reportingManager?.toString() !== managerId) {
            throw new Error('Team member not found');
        }
        return user;
    }
}
exports.ManagerTeamService = ManagerTeamService;
exports.managerTeamService = new ManagerTeamService();
//# sourceMappingURL=team.service.js.map