"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsController = exports.AnalyticsController = void 0;
const analytics_service_1 = require("./analytics.service");
const response_1 = require("../../../../shared/utils/response");
class AnalyticsController {
    async getAttendanceStatistics(req, res, next) {
        try {
            const { month, year, departmentId } = req.query;
            const stats = await analytics_service_1.analyticsService.getAttendanceStatistics(Number(month), Number(year), departmentId);
            (0, response_1.sendSuccessResponse)(res, 'Statistics retrieved successfully', stats);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getDepartmentWiseAnalytics(req, res, next) {
        try {
            const { month, year } = req.query;
            const analytics = await analytics_service_1.analyticsService.getDepartmentWiseAnalytics(Number(month), Number(year));
            (0, response_1.sendSuccessResponse)(res, 'Department analytics retrieved successfully', analytics);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getEmployeePerformanceAnalytics(req, res, next) {
        try {
            const { userId } = req.params;
            const { month, year } = req.query;
            const analytics = await analytics_service_1.analyticsService.getEmployeePerformanceAnalytics(userId, Number(month), Number(year));
            (0, response_1.sendSuccessResponse)(res, 'Employee analytics retrieved successfully', analytics);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getAttendanceTrend(req, res, next) {
        try {
            const { year, departmentId } = req.query;
            const trend = await analytics_service_1.analyticsService.getAttendanceTrend(Number(year), departmentId);
            (0, response_1.sendSuccessResponse)(res, 'Attendance trend retrieved successfully', trend);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getLeaveStatistics(req, res, next) {
        try {
            const { month, year, departmentId } = req.query;
            const stats = await analytics_service_1.analyticsService.getLeaveStatistics(Number(month), Number(year), departmentId);
            (0, response_1.sendSuccessResponse)(res, 'Leave statistics retrieved successfully', stats);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getRealTimeDashboardStats(req, res, next) {
        try {
            const stats = await analytics_service_1.analyticsService.getRealTimeDashboardStats();
            (0, response_1.sendSuccessResponse)(res, 'Real-time stats retrieved successfully', stats);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
}
exports.AnalyticsController = AnalyticsController;
exports.analyticsController = new AnalyticsController();
//# sourceMappingURL=analytics.controller.js.map