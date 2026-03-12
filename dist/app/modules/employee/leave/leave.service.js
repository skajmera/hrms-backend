"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeLeaveService = exports.EmployeeLeaveService = void 0;
const leave_dal_1 = require("../../../../shared/dal/leave.dal");
const user_dal_1 = require("../../../../shared/dal/user.dal");
const notifications_service_1 = require("../../notifications/notifications.service");
const notification_interface_1 = require("../../../../shared/interfaces/notification.interface");
const constants_1 = require("../../../../config/constants");
class EmployeeLeaveService {
    /**
     * Apply for leave
     */
    async applyLeave(userId, leaveData) {
        // Check leave balance
        const year = new Date(leaveData.startDate).getFullYear();
        const balance = await leave_dal_1.leaveDAL.getLeaveBalance(userId, year);
        if (balance) {
            const leaveType = leaveData.leaveType.toLowerCase() + 'Leave';
            const currentBalance = balance[leaveType];
            const daysDiff = Math.ceil((new Date(leaveData.endDate).getTime() - new Date(leaveData.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
            if (currentBalance && currentBalance.remaining < daysDiff) {
                throw new Error(`Insufficient ${leaveData.leaveType} leave balance. Available: ${currentBalance.remaining} days`);
            }
        }
        const leave = await leave_dal_1.leaveDAL.create({
            ...leaveData,
            userId
        });
        // --- TRIGGER NOTIFICATION ---
        try {
            const employee = await user_dal_1.userDAL.findById(userId);
            if (employee && employee.professionalDetails?.reportingManager) {
                const managerId = employee.professionalDetails.reportingManager.toString();
                await notifications_service_1.notificationsService.sendNotification({
                    userId: managerId,
                    type: notification_interface_1.NotificationType.LEAVE_REQUESTED,
                    title: 'New Leave Request',
                    message: `${employee.fullName} has applied for ${leaveData.leaveType} leave from ${new Date(leaveData.startDate).toDateString()} to ${new Date(leaveData.endDate).toDateString()}.`,
                    targetApp: 'HR',
                    data: { leaveId: leave._id }
                });
            }
            // Also notify HR Admin for global visibility
            const hrAdmins = await user_dal_1.userDAL.findAll({ role: constants_1.USER_ROLES.HR_ADMIN }, { limit: 100, page: 1 });
            if (hrAdmins.users.length > 0) {
                const hrPromises = hrAdmins.users.map(hr => notifications_service_1.notificationsService.sendNotification({
                    userId: hr._id.toString(),
                    type: notification_interface_1.NotificationType.LEAVE_REQUESTED,
                    title: 'New Leave Request (HR Copy)',
                    message: `${employee?.fullName || 'An employee'} applied for leave.`,
                    targetApp: 'HR',
                    data: { leaveId: leave._id }
                }));
                await Promise.allSettled(hrPromises);
            }
        }
        catch (error) {
            console.error('[EmployeeLeaveService] Failed to send leave application notification:', error);
        }
        return leave;
    }
    /**
     * Get own leaves
     */
    async getMyLeaves(userId, filters = {}, options = {}) {
        const query = { userId };
        if (filters.startDate && filters.endDate) {
            const start = new Date(filters.startDate);
            const end = new Date(filters.endDate);
            end.setHours(23, 59, 59, 999);
            query.$or = [
                { startDate: { $gte: start, $lte: end } },
                { endDate: { $gte: start, $lte: end } },
                {
                    $and: [
                        { startDate: { $lte: start } },
                        { endDate: { $gte: end } }
                    ]
                }
            ];
        }
        if (filters.leaveType) {
            query.leaveType = Array.isArray(filters.leaveType) ? { $in: filters.leaveType } : filters.leaveType;
        }
        if (filters.status) {
            query.status = Array.isArray(filters.status) ? { $in: filters.status } : filters.status;
        }
        return await leave_dal_1.leaveDAL.findAll(query, options);
    }
    /**
     * Get leave balance
     */
    async getMyLeaveBalance(userId, year) {
        return await leave_dal_1.leaveDAL.getLeaveBalance(userId, year);
    }
    /**
     * Cancel leave
     */
    async cancelLeave(userId, leaveId) {
        const leave = await leave_dal_1.leaveDAL.findById(leaveId);
        if (!leave) {
            throw new Error('Leave not found');
        }
        if (leave.userId.toString() !== userId) {
            throw new Error('Unauthorized to cancel this leave');
        }
        if (leave.status !== 'PENDING') {
            throw new Error('Only pending leaves can be cancelled');
        }
        return await leave_dal_1.leaveDAL.update(leaveId, { status: 'CANCELLED' });
    }
}
exports.EmployeeLeaveService = EmployeeLeaveService;
exports.employeeLeaveService = new EmployeeLeaveService();
//# sourceMappingURL=leave.service.js.map