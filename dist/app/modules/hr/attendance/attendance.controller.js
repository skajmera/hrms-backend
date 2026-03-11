"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceController = exports.AttendanceController = void 0;
const attendance_service_1 = require("./attendance.service");
const response_1 = require("../../../../shared/utils/response");
const constants_1 = require("../../../../config/constants");
class AttendanceController {
    /**
     * Mark attendance (Check-In / Check-Out)
     * POST /api/v1/hr/attendance/mark
     */
    async markAttendance(req, res, next) {
        try {
            let attendanceData = req.body;
            // If multipart (from multer), the file might be in req.file
            if (req.file) {
                attendanceData.selfie = req.file.path;
            }
            // Use userId from body if provided (HR marking for others), otherwise use token ID
            const userId = req.body.userId || req.user?._id?.toString() || req.user?.id;
            if (!userId) {
                throw new Error('User ID is required');
            }
            const result = await attendance_service_1.attendanceService.markAttendance({
                ...attendanceData,
                userId,
                date: attendanceData.date || new Date()
            });
            (0, response_1.sendSuccessResponse)(res, `${result.type} successful`, result.attendance, constants_1.HTTP_STATUS.CREATED);
        }
        catch (error) {
            // Handle custom status codes from service
            if (error.statusCode) {
                (0, response_1.sendErrorResponse)(res, error.message, error.statusCode);
            }
            else {
                next(error);
            }
        }
    }
    /**
     * Register Device & Face (One-time setup)
     * POST /api/v1/hr/attendance/register-device
     */
    async registerDevice(req, res, next) {
        try {
            const userId = req.user?.id;
            const { deviceId, wifiBSSID, gpsLatitude, gpsLongitude } = req.body;
            const selfie = req.file?.path;
            if (!selfie) {
                throw new Error('Selfie is required for registration');
            }
            const result = await attendance_service_1.attendanceService.registerDevice({
                userId,
                deviceId,
                selfie,
                wifiBSSID,
                gpsLatitude: gpsLatitude ? Number(gpsLatitude) : undefined,
                gpsLongitude: gpsLongitude ? Number(gpsLongitude) : undefined
            });
            (0, response_1.sendSuccessResponse)(res, 'Device registered successfully', result);
        }
        catch (error) {
            next(error);
        }
    }
    async getAttendanceById(req, res, next) {
        try {
            const attendance = await attendance_service_1.attendanceService.getAttendanceById(req.params.id);
            (0, response_1.sendSuccessResponse)(res, 'Attendance retrieved successfully', attendance);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.NOT_FOUND);
        }
    }
    async getAllAttendance(req, res, next) {
        try {
            const { page = 1, limit = 10, sortBy = 'date', sortOrder = 'desc', ...filters } = req.query;
            const { userId, startDate, endDate, status } = req.query;
            const filterData = {};
            if (userId) {
                filterData.userId = userId;
            }
            if (status) {
                filterData.status = status;
            }
            if (startDate && endDate) {
                filterData.date = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }
            const result = await attendance_service_1.attendanceService.getAllAttendance(filterData, {
                page: Number(page),
                limit: Number(limit),
                sortBy: sortBy,
                sortOrder: sortOrder
            });
            (0, response_1.sendPaginatedResponse)(res, result.records, result.total, Number(page), Number(limit), 'Attendance records retrieved successfully');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async updateAttendance(req, res, next) {
        try {
            const attendance = await attendance_service_1.attendanceService.updateAttendance(req.params.id, req.body);
            (0, response_1.sendSuccessResponse)(res, 'Attendance updated successfully', attendance);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
    async deleteAttendance(req, res, next) {
        try {
            await attendance_service_1.attendanceService.deleteAttendance(req.params.id);
            (0, response_1.sendSuccessResponse)(res, 'Attendance deleted successfully');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.NOT_FOUND);
        }
    }
    async getTodayAttendance(req, res, next) {
        try {
            const attendance = await attendance_service_1.attendanceService.getTodayAttendance();
            (0, response_1.sendSuccessResponse)(res, "Today's attendance retrieved successfully", attendance);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getUserAttendanceReport(req, res, next) {
        try {
            const { userId, month, year } = req.params;
            const report = await attendance_service_1.attendanceService.getUserAttendanceReport(userId, Number(month), Number(year));
            (0, response_1.sendSuccessResponse)(res, 'Attendance report retrieved successfully', report);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getEmployeeTodayAttendance(req, res, next) {
        try {
            const { userId } = req.params;
            const attendance = await attendance_service_1.attendanceService.getEmployeeTodayAttendance(userId);
            (0, response_1.sendSuccessResponse)(res, "Employee's today attendance retrieved successfully", attendance);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
}
exports.AttendanceController = AttendanceController;
exports.attendanceController = new AttendanceController();
//# sourceMappingURL=attendance.controller.js.map