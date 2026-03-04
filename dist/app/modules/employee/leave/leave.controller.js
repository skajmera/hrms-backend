"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeLeaveController = exports.EmployeeLeaveController = void 0;
const leave_service_1 = require("./leave.service");
const response_1 = require("../../../../shared/utils/response");
const constants_1 = require("../../../../config/constants");
class EmployeeLeaveController {
    async applyLeave(req, res, next) {
        try {
            const leave = await leave_service_1.employeeLeaveService.applyLeave(req.user._id.toString(), req.body);
            (0, response_1.sendSuccessResponse)(res, 'Leave applied successfully', leave, constants_1.HTTP_STATUS.CREATED);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
    async getMyLeaves(req, res, next) {
        try {
            const { startDate, endDate, page, limit, leaveType, status } = req.query;
            const result = await leave_service_1.employeeLeaveService.getMyLeaves(req.user._id.toString(), {
                startDate: startDate,
                endDate: endDate,
                leaveType: leaveType,
                status: status
            }, { page: Number(page) || 1, limit: Number(limit) || 10 });
            (0, response_1.sendSuccessResponse)(res, 'Leaves retrieved successfully', result);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getMyLeaveBalance(req, res, next) {
        try {
            const { year } = req.params;
            const balance = await leave_service_1.employeeLeaveService.getMyLeaveBalance(req.user._id.toString(), Number(year));
            (0, response_1.sendSuccessResponse)(res, 'Leave balance retrieved successfully', balance);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async cancelLeave(req, res, next) {
        try {
            const leave = await leave_service_1.employeeLeaveService.cancelLeave(req.user._id.toString(), req.params.id);
            (0, response_1.sendSuccessResponse)(res, 'Leave cancelled successfully', leave);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
}
exports.EmployeeLeaveController = EmployeeLeaveController;
exports.employeeLeaveController = new EmployeeLeaveController();
//# sourceMappingURL=leave.controller.js.map