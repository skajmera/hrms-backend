"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.managerLeaveService = exports.ManagerLeaveService = void 0;
const leave_dal_1 = require("../../../../shared/dal/leave.dal");
const user_dal_1 = require("../../../../shared/dal/user.dal");
const email_1 = require("../../../../shared/utils/email");
class ManagerLeaveService {
    /**
     * Approve team member leave
     */
    async approveTeamLeave(managerId, leaveId) {
        const leave = await leave_dal_1.leaveDAL.findById(leaveId);
        if (!leave) {
            throw new Error('Leave not found');
        }
        // Verify this is manager's team member
        const user = await user_dal_1.userDAL.findById(leave.userId.toString());
        if (!user || user.professionalDetails.reportingManager?.toString() !== managerId) {
            throw new Error('Unauthorized to approve this leave');
        }
        const approvedLeave = await leave_dal_1.leaveDAL.approve(leaveId, managerId);
        // Update leave balance
        if (approvedLeave) {
            await leave_dal_1.leaveDAL.updateLeaveBalanceAfterApproval(approvedLeave);
            // Send email notification
            try {
                await (0, email_1.sendLeaveApprovalEmail)(user.email, user.getFullName(), leave.leaveType, leave.startDate.toDateString(), leave.endDate.toDateString());
            }
            catch (error) {
                console.error('Failed to send approval email:', error);
            }
        }
        return approvedLeave;
    }
    /**
     * Reject team member leave
     */
    async rejectTeamLeave(managerId, leaveId, rejectionReason) {
        const leave = await leave_dal_1.leaveDAL.findById(leaveId);
        if (!leave) {
            throw new Error('Leave not found');
        }
        // Verify this is manager's team member
        const user = await user_dal_1.userDAL.findById(leave.userId.toString());
        if (!user || user.professionalDetails.reportingManager?.toString() !== managerId) {
            throw new Error('Unauthorized to reject this leave');
        }
        return await leave_dal_1.leaveDAL.reject(leaveId, managerId, rejectionReason);
    }
}
exports.ManagerLeaveService = ManagerLeaveService;
exports.managerLeaveService = new ManagerLeaveService();
//# sourceMappingURL=leave.service.js.map