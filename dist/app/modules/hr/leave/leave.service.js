"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveService = exports.LeaveService = void 0;
const leave_dal_1 = require("../../../../shared/dal/leave.dal");
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
        return await leave_dal_1.leaveDAL.create(leaveData);
    }
    async getLeaveById(id) {
        const leave = await leave_dal_1.leaveDAL.findById(id);
        if (!leave) {
            throw new Error('Leave request not found');
        }
        return leave;
    }
    async getAllLeaves(filters, options) {
        return await leave_dal_1.leaveDAL.findAll(filters, options);
    }
    async approveLeave(id, approvedBy) {
        const leave = await leave_dal_1.leaveDAL.approve(id, approvedBy);
        if (!leave) {
            throw new Error('Leave request not found');
        }
        // Update leave balance
        await leave_dal_1.leaveDAL.updateLeaveBalanceAfterApproval(leave);
        return leave;
    }
    async rejectLeave(id, rejectedBy, rejectionReason) {
        const leave = await leave_dal_1.leaveDAL.reject(id, rejectedBy, rejectionReason);
        if (!leave) {
            throw new Error('Leave request not found');
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