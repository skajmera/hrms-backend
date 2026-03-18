"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeDashboardController = exports.EmployeeDashboardController = void 0;
const dashboard_service_1 = require("./dashboard.service");
const response_1 = require("../../../../shared/utils/response");
class EmployeeDashboardController {
    async getMyDashboard(req, res, next) {
        try {
            const dept = req.user.professionalDetails?.department;
            const deptId = dept?._id ? dept._id.toString() : dept?.toString() ?? '';
            const organizationId = req.user.organizationId?.toString?.() || undefined;
            const dashboard = await dashboard_service_1.employeeDashboardService.getMyDashboard(req.user._id.toString(), req.user.role, deptId, organizationId);
            (0, response_1.sendSuccessResponse)(res, 'Dashboard retrieved successfully', dashboard);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getBirthdays(req, res, next) {
        try {
            const userId = req.user._id.toString();
            const userRole = req.user.role;
            const dept = req.user.professionalDetails?.department;
            const deptId = dept?._id ? dept._id.toString() : dept?.toString() ?? '';
            const result = await dashboard_service_1.employeeDashboardService.getBirthdays(userId, userRole, deptId);
            (0, response_1.sendPaginatedResponse)(res, result.announcements, result.total, 1, 10, 'Birthdays retrieved successfully');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getAnniversary(req, res, next) {
        try {
            const userId = req.user._id.toString();
            const userRole = req.user.role;
            const dept = req.user.professionalDetails?.department;
            const deptId = dept?._id ? dept._id.toString() : dept?.toString() ?? '';
            const result = await dashboard_service_1.employeeDashboardService.getAnniversary(userId, userRole, deptId);
            (0, response_1.sendPaginatedResponse)(res, result.announcements, result.total, 1, 10, 'Anniversaries retrieved successfully');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getNewHires(req, res, next) {
        try {
            const userId = req.user._id.toString();
            const userRole = req.user.role;
            const dept = req.user.professionalDetails?.department;
            const deptId = dept?._id ? dept._id.toString() : dept?.toString() ?? '';
            const result = await dashboard_service_1.employeeDashboardService.getNewHires(userId, userRole, deptId);
            console.log('[EmployeeDashboard][NewHires]', {
                userId,
                role: userRole,
                deptId,
                total: result.total,
                ids: result.announcements?.map((a) => a._id),
                targetEmployees: result.announcements?.flatMap((a) => a.targetEmployees?.map((e) => ({
                    id: e._id,
                    isActive: e.isActive,
                    status: e.professionalDetails?.employmentStatus
                })) || [])
            });
            (0, response_1.sendPaginatedResponse)(res, result.announcements, result.total, 1, 10, 'New hires retrieved successfully');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getAllAnnouncements(req, res, next) {
        try {
            const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
            const userId = req.user._id.toString();
            const userRole = req.user.role;
            const dept = req.user.professionalDetails?.department;
            const deptId = dept?._id ? dept._id.toString() : dept?.toString() ?? '';
            const result = await dashboard_service_1.employeeDashboardService.getAllAnnouncements(userId, userRole, deptId, { page: Number(page), limit: Number(limit), sortBy: sortBy, sortOrder: sortOrder });
            (0, response_1.sendPaginatedResponse)(res, result.announcements, result.total, Number(page), Number(limit), 'Announcements retrieved successfully');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
}
exports.EmployeeDashboardController = EmployeeDashboardController;
exports.employeeDashboardController = new EmployeeDashboardController();
//# sourceMappingURL=dashboard.controller.js.map