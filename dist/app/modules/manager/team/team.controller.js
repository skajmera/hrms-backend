"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.managerTeamController = exports.ManagerTeamController = void 0;
const team_service_1 = require("./team.service");
const response_1 = require("../../../../shared/utils/response");
const constants_1 = require("../../../../config/constants");
class ManagerTeamController {
    async getTeamMembers(req, res, next) {
        try {
            const team = await team_service_1.managerTeamService.getTeamMembers(req.user._id.toString());
            (0, response_1.sendSuccessResponse)(res, 'Team members retrieved successfully', team);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getTeamAttendanceToday(req, res, next) {
        try {
            const attendance = await team_service_1.managerTeamService.getTeamAttendanceToday(req.user._id.toString());
            (0, response_1.sendSuccessResponse)(res, 'Team attendance retrieved successfully', attendance);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getTeamLeaveRequests(req, res, next) {
        try {
            const leaves = await team_service_1.managerTeamService.getTeamLeaveRequests(req.user._id.toString());
            (0, response_1.sendSuccessResponse)(res, 'Team leave requests retrieved successfully', leaves);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getTeamMemberDetails(req, res, next) {
        try {
            const member = await team_service_1.managerTeamService.getTeamMemberDetails(req.user._id.toString(), req.params.userId);
            (0, response_1.sendSuccessResponse)(res, 'Team member details retrieved successfully', member);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.NOT_FOUND);
        }
    }
}
exports.ManagerTeamController = ManagerTeamController;
exports.managerTeamController = new ManagerTeamController();
//# sourceMappingURL=team.controller.js.map