"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeAttendanceController = exports.EmployeeAttendanceController = void 0;
const attendance_service_1 = require("./attendance.service");
const response_1 = require("../../../../shared/utils/response");
const constants_1 = require("../../../../config/constants");
class EmployeeAttendanceController {
    async markMyAttendance(req, res, next) {
        try {
            const attendance = await attendance_service_1.employeeAttendanceService.markMyAttendance(req.user._id.toString(), req.body);
            (0, response_1.sendSuccessResponse)(res, 'Attendance marked successfully', attendance, constants_1.HTTP_STATUS.CREATED);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
    async getMyAttendance(req, res, next) {
        try {
            const { startDate, endDate, status, checkIn, checkOut, workHours } = req.query;
            const attendance = await attendance_service_1.employeeAttendanceService.getMyAttendance(req.user._id.toString(), new Date(startDate), new Date(endDate), { status, checkIn, checkOut, workHours });
            (0, response_1.sendSuccessResponse)(res, 'Attendance retrieved successfully', attendance);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getMyAttendanceSummary(req, res, next) {
        try {
            const { month, year } = req.params;
            const summary = await attendance_service_1.employeeAttendanceService.getMyAttendanceSummary(req.user._id.toString(), Number(month), Number(year));
            (0, response_1.sendSuccessResponse)(res, 'Attendance summary retrieved successfully', summary);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getMyTodayAttendance(req, res, next) {
        try {
            const attendance = await attendance_service_1.employeeAttendanceService.getTodayAttendance(req.user._id.toString());
            (0, response_1.sendSuccessResponse)(res, "Today's attendance retrieved successfully", attendance);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
}
exports.EmployeeAttendanceController = EmployeeAttendanceController;
exports.employeeAttendanceController = new EmployeeAttendanceController();
//# sourceMappingURL=attendance.controller.js.map