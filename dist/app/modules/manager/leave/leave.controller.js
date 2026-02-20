"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.managerLeaveController = exports.ManagerLeaveController = void 0;
const leave_service_1 = require("./leave.service");
const response_1 = require("../../../../shared/utils/response");
const constants_1 = require("../../../../config/constants");
class ManagerLeaveController {
    async approveLeave(req, res, next) {
        try {
            const leave = await leave_service_1.managerLeaveService.approveTeamLeave(req.user._id.toString(), req.params.id);
            (0, response_1.sendSuccessResponse)(res, 'Leave approved successfully', leave);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
    async rejectLeave(req, res, next) {
        try {
            const { rejectionReason } = req.body;
            const leave = await leave_service_1.managerLeaveService.rejectTeamLeave(req.user._id.toString(), req.params.id, rejectionReason);
            (0, response_1.sendSuccessResponse)(res, 'Leave rejected successfully', leave);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
}
exports.ManagerLeaveController = ManagerLeaveController;
exports.managerLeaveController = new ManagerLeaveController();
//# sourceMappingURL=leave.controller.js.map