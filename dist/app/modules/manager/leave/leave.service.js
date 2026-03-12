"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.managerLeaveService = exports.ManagerLeaveService = void 0;
const leave_dal_1 = require("../../../../shared/dal/leave.dal");
const user_dal_1 = require("../../../../shared/dal/user.dal");
const email_1 = require("../../../../shared/utils/email");
const constants_1 = require("../../../../config/constants");
const notifications_service_1 = require("../../notifications/notifications.service");
const notification_interface_1 = require("../../../../shared/interfaces/notification.interface");
class ManagerLeaveService {
    /**
     * Approve team member leave
     */
    async approveTeamLeave(managerId, leaveId, callerRole) {
        console.log(`[ManagerLeaveService] approveTeamLeave - managerId: ${managerId}, leaveId: ${leaveId}`);
        const leave = await leave_dal_1.leaveDAL.findById(leaveId);
        if (!leave) {
            console.error(`[ManagerLeaveService] Leave not found: ${leaveId}`);
            throw new Error('Leave not found');
        }
        // userId may be populated (object) or plain ID — safely extract string
        const userId = leave.userId?._id?.toString() ?? leave.userId?.toString();
        console.log(`[ManagerLeaveService] Leave found. userId: ${userId}, status: ${leave.status}`);
        const user = await user_dal_1.userDAL.findById(userId);
        if (!user) {
            console.error(`[ManagerLeaveService] User not found for userId: ${userId}`);
            throw new Error('Leave owner not found');
        }
        // SUPER_ADMIN and HR_ADMIN bypass the reporting manager ownership check
        const isPrivileged = callerRole === constants_1.USER_ROLES.SUPER_ADMIN || callerRole === constants_1.USER_ROLES.HR_ADMIN;
        if (!isPrivileged) {
            const reportingManagerId = user.professionalDetails?.reportingManager?.toString();
            console.log(`[ManagerLeaveService] reportingManager on user: ${reportingManagerId}, current managerId: ${managerId}`);
            if (reportingManagerId !== managerId) {
                console.error(`[ManagerLeaveService] Auth check failed — manager ${managerId} is not reporting manager ${reportingManagerId}`);
                throw new Error('Unauthorized to approve this leave');
            }
        }
        const approvedLeave = await leave_dal_1.leaveDAL.approve(leaveId, managerId);
        // Update leave balance
        if (approvedLeave) {
            await leave_dal_1.leaveDAL.updateLeaveBalanceAfterApproval(approvedLeave);
            // --- TRIGGER NOTIFICATION ---
            try {
                await notifications_service_1.notificationsService.sendNotification({
                    userId: user._id.toString(),
                    type: notification_interface_1.NotificationType.LEAVE_APPROVED,
                    title: 'Leave Approved',
                    message: `Your leave request for ${leave.leaveType} from ${leave.startDate.toDateString()} to ${leave.endDate.toDateString()} has been approved.`,
                    targetApp: 'EMPLOYEE',
                    data: { leaveId: approvedLeave._id }
                });
            }
            catch (error) {
                console.error('[ManagerLeaveService] Failed to send approval notification:', error);
            }
            // Send email notification
            try {
                await (0, email_1.sendLeaveApprovalEmail)(user.email, user.getFullName(), leave.leaveType, leave.startDate.toDateString(), leave.endDate.toDateString());
            }
            catch (error) {
                console.error('[ManagerLeaveService] Failed to send approval email:', error);
            }
        }
        console.log(`[ManagerLeaveService] Leave approved successfully: ${leaveId}`);
        return approvedLeave;
    }
    /**
     * Reject team member leave
     */
    async rejectTeamLeave(managerId, leaveId, rejectionReason, callerRole) {
        console.log(`[ManagerLeaveService] rejectTeamLeave - managerId: ${managerId}, leaveId: ${leaveId}`);
        const leave = await leave_dal_1.leaveDAL.findById(leaveId);
        if (!leave) {
            console.error(`[ManagerLeaveService] Leave not found: ${leaveId}`);
            throw new Error('Leave not found');
        }
        // userId may be populated (object) or plain ID — safely extract string
        const userId = leave.userId?._id?.toString() ?? leave.userId?.toString();
        console.log(`[ManagerLeaveService] Leave found. userId: ${userId}, status: ${leave.status}`);
        const user = await user_dal_1.userDAL.findById(userId);
        if (!user) {
            console.error(`[ManagerLeaveService] User not found for userId: ${userId}`);
            throw new Error('Leave owner not found');
        }
        // SUPER_ADMIN and HR_ADMIN bypass the reporting manager ownership check
        const isPrivileged = callerRole === constants_1.USER_ROLES.SUPER_ADMIN || callerRole === constants_1.USER_ROLES.HR_ADMIN;
        if (!isPrivileged) {
            const reportingManagerId = user.professionalDetails?.reportingManager?.toString();
            console.log(`[ManagerLeaveService] reportingManager on user: ${reportingManagerId}, current managerId: ${managerId}`);
            if (reportingManagerId !== managerId) {
                console.error(`[ManagerLeaveService] Auth check failed — manager ${managerId} is not reporting manager ${reportingManagerId}`);
                throw new Error('Unauthorized to reject this leave');
            }
        }
        const rejectedLeave = await leave_dal_1.leaveDAL.reject(leaveId, managerId, rejectionReason);
        // --- TRIGGER NOTIFICATION ---
        if (rejectedLeave) {
            try {
                await notifications_service_1.notificationsService.sendNotification({
                    userId: user._id.toString(),
                    type: notification_interface_1.NotificationType.LEAVE_REJECTED,
                    title: 'Leave Rejected',
                    message: `Your leave request for ${leave.leaveType} has been rejected. Reason: ${rejectionReason}`,
                    targetApp: 'EMPLOYEE',
                    data: { leaveId: rejectedLeave._id }
                });
            }
            catch (error) {
                console.error('[ManagerLeaveService] Failed to send rejection notification:', error);
            }
        }
        console.log(`[ManagerLeaveService] Leave rejected successfully: ${leaveId}`);
        return rejectedLeave;
    }
}
exports.ManagerLeaveService = ManagerLeaveService;
exports.managerLeaveService = new ManagerLeaveService();
//# sourceMappingURL=leave.service.js.map