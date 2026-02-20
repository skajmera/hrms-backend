"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveDAL = exports.LeaveDAL = void 0;
const leave_model_1 = require("../models/leave.model");
const constants_1 = require("../../config/constants");
class LeaveDAL {
    /**
     * Create leave request
     */
    async create(leaveData) {
        return await leave_model_1.LeaveModel.create(leaveData);
    }
    /**
     * Find leave by ID
     */
    async findById(id) {
        return await leave_model_1.LeaveModel.findById(id)
            .populate('userId', 'firstName lastName email professionalDetails.employeeId professionalDetails.department')
            .populate('approvedBy', 'firstName lastName')
            .populate('rejectedBy', 'firstName lastName')
            .populate('handoverTo', 'firstName lastName email');
    }
    /**
     * Find all leaves
     */
    async findAll(filters = {}, options = {}) {
        const { page = 1, limit = 10, sortBy = 'appliedDate', sortOrder = 'desc' } = options;
        const skip = (page - 1) * limit;
        const leaves = await leave_model_1.LeaveModel.find(filters)
            .populate('userId', 'firstName lastName email professionalDetails.employeeId')
            .populate('approvedBy', 'firstName lastName')
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit);
        const total = await leave_model_1.LeaveModel.countDocuments(filters);
        return { leaves, total };
    }
    /**
     * Update leave
     */
    async update(id, updateData) {
        return await leave_model_1.LeaveModel.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true })
            .populate('userId', 'firstName lastName email');
    }
    /**
     * Delete leave
     */
    async delete(id) {
        return await leave_model_1.LeaveModel.findByIdAndDelete(id);
    }
    /**
     * Get pending leave requests
     */
    async getPendingLeaves() {
        return await leave_model_1.LeaveModel.find({ status: constants_1.LEAVE_STATUS.PENDING })
            .populate('userId', 'firstName lastName email professionalDetails.employeeId professionalDetails.department')
            .sort({ appliedDate: 1 });
    }
    /**
     * Get user leaves by date range
     */
    async findByUserAndDateRange(userId, startDate, endDate) {
        return await leave_model_1.LeaveModel.find({
            userId,
            $or: [
                { startDate: { $gte: startDate, $lte: endDate } },
                { endDate: { $gte: startDate, $lte: endDate } },
                {
                    $and: [
                        { startDate: { $lte: startDate } },
                        { endDate: { $gte: endDate } }
                    ]
                }
            ]
        }).sort({ startDate: 1 });
    }
    /**
     * Get employees on leave today
     */
    async getEmployeesOnLeaveToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return await leave_model_1.LeaveModel.find({
            status: constants_1.LEAVE_STATUS.APPROVED,
            startDate: { $lte: today },
            endDate: { $gte: today }
        })
            .populate('userId', 'firstName lastName email professionalDetails.employeeId professionalDetails.department');
    }
    /**
     * Approve leave
     */
    async approve(id, approvedBy) {
        return await leave_model_1.LeaveModel.findByIdAndUpdate(id, {
            $set: {
                status: constants_1.LEAVE_STATUS.APPROVED,
                approvedBy,
                approvedDate: new Date()
            }
        }, { new: true })
            .populate('userId', 'firstName lastName email');
    }
    /**
     * Reject leave
     */
    async reject(id, rejectedBy, rejectionReason) {
        return await leave_model_1.LeaveModel.findByIdAndUpdate(id, {
            $set: {
                status: constants_1.LEAVE_STATUS.REJECTED,
                rejectedBy,
                rejectedDate: new Date(),
                rejectionReason
            }
        }, { new: true })
            .populate('userId', 'firstName lastName email');
    }
    /**
     * Get leave balance
     */
    async getLeaveBalance(userId, year) {
        return await leave_model_1.LeaveBalanceModel.findOne({ userId, year });
    }
    /**
     * Create or update leave balance
     */
    async upsertLeaveBalance(userId, year, balanceData) {
        return await leave_model_1.LeaveBalanceModel.findOneAndUpdate({ userId, year }, { $set: balanceData }, { new: true, upsert: true });
    }
    /**
     * Update leave balance after approval
     */
    async updateLeaveBalanceAfterApproval(leave) {
        const year = leave.startDate.getFullYear();
        const balance = await this.getLeaveBalance(leave.userId._id.toString(), year);
        if (balance) {
            const leaveType = leave.leaveType.toLowerCase() + 'Leave';
            const currentBalance = balance[leaveType];
            if (currentBalance) {
                currentBalance.used += leave.numberOfDays;
                currentBalance.remaining = currentBalance.total - currentBalance.used;
                await balance.save();
            }
        }
    }
    /**
   * Get leaves by date range
   * Returns all leaves that overlap with the given date range
   */
    async findByDateRange(startDate, endDate) {
        return await leave_model_1.LeaveModel.find({
            $or: [
                // Leave starts within the range
                { startDate: { $gte: startDate, $lte: endDate } },
                // Leave ends within the range
                { endDate: { $gte: startDate, $lte: endDate } },
                // Leave spans the entire range
                {
                    startDate: { $lte: startDate },
                    endDate: { $gte: endDate }
                }
            ],
            status: constants_1.LEAVE_STATUS.APPROVED // Only count approved leaves
        })
            .populate('userId', 'firstName lastName email professionalDetails.employeeId profilePicture')
            .populate('approvedBy', 'firstName lastName')
            .sort({ startDate: 1 });
    }
}
exports.LeaveDAL = LeaveDAL;
exports.leaveDAL = new LeaveDAL();
//# sourceMappingURL=leave.dal.js.map