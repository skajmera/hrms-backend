"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeDashboardController = exports.EmployeeDashboardController = void 0;
const dashboard_service_1 = require("./dashboard.service");
const response_1 = require("../../../../shared/utils/response");
class EmployeeDashboardController {
    async getMyDashboard(req, res, next) {
        try {
            const dashboard = await dashboard_service_1.employeeDashboardService.getMyDashboard(req.user._id.toString(), req.user.role, req.user.professionalDetails.department._id.toString());
            (0, response_1.sendSuccessResponse)(res, 'Dashboard retrieved successfully', dashboard);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getBirthdays(req, res, next) {
        try {
            const birthdays = await dashboard_service_1.employeeDashboardService.getBirthdays();
            (0, response_1.sendSuccessResponse)(res, 'Birthdays retrieved successfully', birthdays);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getAnniversary(req, res, next) {
        try {
            const anniversaries = await dashboard_service_1.employeeDashboardService.getAnniversary();
            (0, response_1.sendSuccessResponse)(res, 'Anniversaries retrieved successfully', anniversaries);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getNewHires(req, res, next) {
        try {
            const { days = 30, date } = req.query;
            const newHires = await dashboard_service_1.employeeDashboardService.getNewHires(Number(days), date);
            (0, response_1.sendSuccessResponse)(res, 'New hires retrieved successfully', newHires);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
}
exports.EmployeeDashboardController = EmployeeDashboardController;
exports.employeeDashboardController = new EmployeeDashboardController();
//# sourceMappingURL=dashboard.controller.js.map