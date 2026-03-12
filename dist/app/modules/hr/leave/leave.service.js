"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveService = exports.LeaveService = void 0;
const leave_dal_1 = require("../../../../shared/dal/leave.dal");
const user_dal_1 = require("../../../../shared/dal/user.dal");
const notifications_service_1 = require("../../notifications/notifications.service");
const notification_interface_1 = require("../../../../shared/interfaces/notification.interface");
class LeaveService {
    async applyLeave(leaveData) {
        // Check leave balance
        const balance = await leave_dal_1.leaveDAL.getLeaveBalance(leaveData.userId, new Date(leaveData.startDate).getFullYear());
        if (balance) {
            const leaveType = leaveData.leaveType.toLowerCase() + 'Leave';
            const currentBalance = balance[leaveType];
            if (currentBalance && currentBalance.remaining < (leaveData.endDate.getTime() - leaveData.startDate.getTime()) / (1000 * 60 * 60 * 24) + 1) {
                throw new Error('Insufficient leave balance');
            }
        }
        const leave = await leave_dal_1.leaveDAL.create(leaveData);
        // --- TRIGGER NOTIFICATION ---
        try {
            const employee = await user_dal_1.userDAL.findById(leaveData.userId);
            if (employee && employee.professionalDetails?.reportingManager) {
                await notifications_service_1.notificationsService.sendNotification({
                    userId: employee.professionalDetails.reportingManager.toString(),
                    type: notification_interface_1.NotificationType.LEAVE_REQUESTED,
                    title: 'New Leave Request',
                    message: `${employee.fullName} has a new leave request for ${leaveData.leaveType}.`,
                    targetApp: 'HR',
                    data: { leaveId: leave._id }
                });
            }
        }
        catch (error) {
            console.error('[HRLeaveService] Failed to send leave application notification:', error);
        }
        return leave;
    }
    async getLeaveById(id) {
        const leave = await leave_dal_1.leaveDAL.findById(id);
        if (!leave) {
            throw new Error('Leave request not found');
        }
        return leave;
    }
    async getAllLeaves(query, options) {
        const { userId, status, leaveType, startDate, endDate } = query;
        const filters = {};
        if (userId)
            filters.userId = userId;
        if (status)
            filters.status = status;
        if (leaveType)
            filters.leaveType = leaveType;
        // Overlap range: find leaves that fall within OR overlap the given date window
        if (startDate || endDate) {
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            if (end)
                end.setHours(23, 59, 59, 999);
            if (start)
                filters.endDate = { $gte: start };
            if (end)
                filters.startDate = { ...filters.startDate, $lte: end };
        }
        return await leave_dal_1.leaveDAL.findAll(filters, options);
    }
    async approveLeave(id, approvedBy) {
        const leave = await leave_dal_1.leaveDAL.approve(id, approvedBy);
        if (!leave) {
            throw new Error('Leave request not found');
        }
        // Update leave balance
        await leave_dal_1.leaveDAL.updateLeaveBalanceAfterApproval(leave);
        // --- TRIGGER NOTIFICATION ---
        try {
            await notifications_service_1.notificationsService.sendNotification({
                userId: leave.userId.toString(),
                type: notification_interface_1.NotificationType.LEAVE_APPROVED,
                title: 'Leave Approved',
                message: `Your leave request for ${leave.leaveType} has been approved by HR.`,
                targetApp: 'EMPLOYEE',
                data: { leaveId: leave._id }
            });
        }
        catch (error) {
            console.error('[HRLeaveService] Failed to send approval notification:', error);
        }
        return leave;
    }
    async rejectLeave(id, rejectedBy, rejectionReason) {
        const leave = await leave_dal_1.leaveDAL.reject(id, rejectedBy, rejectionReason);
        if (!leave) {
            throw new Error('Leave request not found');
        }
        // --- TRIGGER NOTIFICATION ---
        try {
            await notifications_service_1.notificationsService.sendNotification({
                userId: leave.userId.toString(),
                type: notification_interface_1.NotificationType.LEAVE_REJECTED,
                title: 'Leave Rejected',
                message: `Your leave request for ${leave.leaveType} has been rejected by HR. Reason: ${rejectionReason}`,
                targetApp: 'EMPLOYEE',
                data: { leaveId: leave._id }
            });
        }
        catch (error) {
            console.error('[HRLeaveService] Failed to send rejection notification:', error);
        }
        return leave;
    }
    async getPendingLeaves() {
        return await leave_dal_1.leaveDAL.getPendingLeaves();
    }
    async getEmployeesOnLeaveToday() {
        return await leave_dal_1.leaveDAL.getEmployeesOnLeaveToday();
    }
    async getLeaveBalance(userId, year) {
        return await leave_dal_1.leaveDAL.getLeaveBalance(userId, year);
    }
}
exports.LeaveService = LeaveService;
exports.leaveService = new LeaveService();
//# sourceMappingURL=leave.service.js.map