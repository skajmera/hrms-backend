"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveController = exports.LeaveController = void 0;
const leave_service_1 = require("./leave.service");
const response_1 = require("../../../../shared/utils/response");
const constants_1 = require("../../../../config/constants");
class LeaveController {
    async applyLeave(req, res, next) {
        try {
            const leave = await leave_service_1.leaveService.applyLeave(req.body);
            (0, response_1.sendSuccessResponse)(res, 'Leave applied successfully', leave, constants_1.HTTP_STATUS.CREATED);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
    async getLeaveById(req, res, next) {
        try {
            const leave = await leave_service_1.leaveService.getLeaveById(req.params.id);
            (0, response_1.sendSuccessResponse)(res, 'Leave retrieved successfully', leave);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.NOT_FOUND);
        }
    }
    async getAllLeaves(req, res, next) {
        try {
            const { page = 1, limit = 10, sortBy = 'appliedDate', sortOrder = 'desc', ...filters } = req.query;
            const result = await leave_service_1.leaveService.getAllLeaves(filters, {
                page: Number(page),
                limit: Number(limit),
                sortBy: sortBy,
                sortOrder: sortOrder
            });
            (0, response_1.sendPaginatedResponse)(res, result.leaves, result.total, Number(page), Number(limit), 'Leaves retrieved successfully');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async approveLeave(req, res, next) {
        try {
            const leave = await leave_service_1.leaveService.approveLeave(req.params.id, req.user._id.toString());
            (0, response_1.sendSuccessResponse)(res, 'Leave approved successfully', leave);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
    async rejectLeave(req, res, next) {
        try {
            const leave = await leave_service_1.leaveService.rejectLeave(req.params.id, req.user._id.toString(), req.body.rejectionReason);
            (0, response_1.sendSuccessResponse)(res, 'Leave rejected successfully', leave);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
    async getPendingLeaves(req, res, next) {
        try {
            const leaves = await leave_service_1.leaveService.getPendingLeaves();
            (0, response_1.sendSuccessResponse)(res, 'Pending leaves retrieved successfully', leaves);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getEmployeesOnLeaveToday(req, res, next) {
        try {
            const employees = await leave_service_1.leaveService.getEmployeesOnLeaveToday();
            (0, response_1.sendSuccessResponse)(res, 'Employees on leave today retrieved successfully', employees);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getLeaveBalance(req, res, next) {
        try {
            const { userId, year } = req.params;
            const balance = await leave_service_1.leaveService.getLeaveBalance(userId, Number(year));
            (0, response_1.sendSuccessResponse)(res, 'Leave balance retrieved successfully', balance);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
}
exports.LeaveController = LeaveController;
exports.leaveController = new LeaveController();
//# sourceMappingURL=leave.controller.js.map