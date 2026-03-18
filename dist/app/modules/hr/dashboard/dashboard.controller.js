"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = exports.DashboardController = void 0;
const dashboard_service_1 = require("./dashboard.service");
const response_1 = require("../../../../shared/utils/response");
class DashboardController {
    async getDashboardStats(req, res, next) {
        try {
            const organizationId = req.user.organizationId?.toString?.() || undefined;
            const stats = await dashboard_service_1.dashboardService.getDashboardStats(organizationId);
            (0, response_1.sendSuccessResponse)(res, 'Dashboard statistics retrieved successfully', stats);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getBirthdays(req, res, next) {
        try {
            const birthdays = await dashboard_service_1.dashboardService.getBirthdays();
            (0, response_1.sendSuccessResponse)(res, 'Birthdays retrieved successfully', birthdays);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getNewHires(req, res, next) {
        try {
            const { days = 30, date } = req.query;
            const newHires = await dashboard_service_1.dashboardService.getNewHires(Number(days), date);
            console.log('[HRDashboard][NewHires]', {
                days,
                date,
                count: Array.isArray(newHires) ? newHires.length : 0,
                ids: Array.isArray(newHires) ? newHires.map((u) => u._id) : []
            });
            (0, response_1.sendSuccessResponse)(res, 'New hires retrieved successfully', newHires);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getRecentAnnouncements(req, res, next) {
        try {
            const announcements = await dashboard_service_1.dashboardService.getRecentAnnouncements(req.user._id.toString(), req.user.role, req.user.professionalDetails?.department?._id.toString());
            (0, response_1.sendSuccessResponse)(res, 'Announcements retrieved successfully', announcements);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getAnniversary(req, res, next) {
        try {
            const birthdays = await dashboard_service_1.dashboardService.getAnniversary();
            (0, response_1.sendSuccessResponse)(res, 'Anniversary retrieved successfully', birthdays);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    /**
     * ✅ NEW - Get leave statistics
     */
    async getLeaveStatistics(req, res, next) {
        try {
            const stats = await dashboard_service_1.dashboardService.getLeaveStatistics();
            (0, response_1.sendSuccessResponse)(res, 'Leave statistics retrieved successfully', stats);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    /**
     * ✅ NEW - Get top leave takers
     */
    async getTopLeaveTakers(req, res, next) {
        try {
            const { limit = 10 } = req.query;
            const topTakers = await dashboard_service_1.dashboardService.getTopLeaveTakers(Number(limit));
            (0, response_1.sendSuccessResponse)(res, 'Top leave takers retrieved successfully', topTakers);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
}
exports.DashboardController = DashboardController;
exports.dashboardController = new DashboardController();
//# sourceMappingURL=dashboard.controller.js.map