"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeLeaveService = exports.EmployeeLeaveService = void 0;
const leave_dal_1 = require("../../../../shared/dal/leave.dal");
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
        return await leave_dal_1.leaveDAL.create({
            ...leaveData,
            userId
        });
    }
    /**
     * Get own leaves
     */
    async getMyLeaves(userId) {
        return await leave_dal_1.leaveDAL.findAll({ userId }, {});
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