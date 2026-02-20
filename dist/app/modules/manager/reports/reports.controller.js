"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportsController = exports.ReportsController = void 0;
const reports_service_1 = require("./reports.service");
const response_1 = require("../../../../shared/utils/response");
class ReportsController {
    async getAttendanceReport(req, res, next) {
        try {
            const { startDate, endDate, departmentId } = req.query;
            const report = await reports_service_1.reportsService.generateAttendanceReport(new Date(startDate), new Date(endDate), departmentId);
            (0, response_1.sendSuccessResponse)(res, 'Attendance report generated successfully', report);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getLeaveReport(req, res, next) {
        try {
            const { year, departmentId } = req.query;
            const report = await reports_service_1.reportsService.generateLeaveReport(Number(year), departmentId);
            (0, response_1.sendSuccessResponse)(res, 'Leave report generated successfully', report);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getPayrollReport(req, res, next) {
        try {
            const { month, year } = req.params;
            const report = await reports_service_1.reportsService.generatePayrollReport(Number(month), Number(year));
            (0, response_1.sendSuccessResponse)(res, 'Payroll report generated successfully', report);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getHeadcountReport(req, res, next) {
        try {
            const report = await reports_service_1.reportsService.generateHeadcountReport();
            (0, response_1.sendSuccessResponse)(res, 'Headcount report generated successfully', report);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
}
exports.ReportsController = ReportsController;
exports.reportsController = new ReportsController();
//# sourceMappingURL=reports.controller.js.map