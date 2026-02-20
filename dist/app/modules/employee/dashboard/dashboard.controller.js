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
}
exports.EmployeeDashboardController = EmployeeDashboardController;
exports.employeeDashboardController = new EmployeeDashboardController();
//# sourceMappingURL=dashboard.controller.js.map