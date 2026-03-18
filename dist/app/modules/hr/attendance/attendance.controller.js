"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceController = exports.AttendanceController = void 0;
const attendance_service_1 = require("./attendance.service");
const response_1 = require("../../../../shared/utils/response");
const constants_1 = require("../../../../config/constants");
const pickUserId = (value) => {
    const raw = value?._id || value?.id || value;
    if (typeof raw === 'string') {
        const v = raw.trim();
        if (/^[a-f\d]{24}$/i.test(v))
            return v;
        const m = v.match(/[a-f\d]{24}/i);
        if (m)
            return m[0];
    }
    return '';
};
class AttendanceController {
    /**
     * Mark attendance (Check-In / Check-Out)
     * POST /api/v1/hr/attendance/mark
     */
    async markAttendance(req, res, next) {
        try {
            const userId = pickUserId(req.body.userId) || req.user?._id?.toString() || req.user?.id;
            if (!userId)
                throw new Error('User ID is required');
            console.log('userId : ', userId);
            const attendanceData = { ...req.body, userId, ...(req.file ? { selfie: `/${req.file.path.replace(/\\/g, '/')}` } : {}) };
            const isHrOverride = [constants_1.USER_ROLES.SUPER_ADMIN, constants_1.USER_ROLES.HR_ADMIN].includes(req.user?.role) && !!req.body.userId && userId !== req.user?._id?.toString();
            console.log('isHrOverride : ', isHrOverride);
            console.log('attendanceData : ', attendanceData);
            console.log('userId : ', userId);
            if (isHrOverride) {
                const result = await attendance_service_1.attendanceService.upsertAttendanceByAdmin({ ...attendanceData, userId, date: attendanceData.date || new Date() });
                (0, response_1.sendSuccessResponse)(res, result.isNew ? 'Attendance created successfully' : 'Attendance updated successfully', result.attendance);
                return;
            }
            const result = await attendance_service_1.attendanceService.markAttendance({ ...attendanceData, userId, date: attendanceData.date || new Date() });
            (0, response_1.sendSuccessResponse)(res, `${result.type} successful`, result.attendance, constants_1.HTTP_STATUS.CREATED);
        }
        catch (error) {
            console.error('[AttendanceMark][Error]', { path: req.path, method: req.method, message: error?.message, name: error?.name, stack: error?.stack });
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
            const selfie = req.file?.path ? `/${req.file.path.replace(/\\/g, '/')}` : undefined;
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
            const { page = 1, limit = 10, sortBy = 'date', sortOrder = 'desc' } = req.query;
            const { userId, startDate, endDate, status, checkIn, checkOut, workHours } = req.query;
            const filterData = {};
            if (userId)
                filterData.userId = userId;
            if (status)
                filterData.status = status;
            if (startDate || endDate) {
                filterData.date = {};
                if (startDate) {
                    filterData.date.$gte = new Date(startDate);
                }
                if (endDate) {
                    const endDay = new Date(endDate);
                    endDay.setHours(23, 59, 59, 999);
                    filterData.date.$lte = endDay;
                }
            }
            const buildOrQuery = (param, handlers) => {
                if (!param)
                    return null;
                const values = Array.isArray(param) ? param : [param];
                const orConditions = [];
                values.forEach((val) => {
                    if (handlers[val]) {
                        orConditions.push(handlers[val]);
                    }
                });
                return orConditions.length > 0 ? { $or: orConditions } : null;
            };
            const checkInHandlers = {
                'before-checkin': { isLate: false, checkInTime: { $exists: true, $ne: null } },
                'after-checkin': { isLate: true },
                '0-5-mins': { isLate: true, lateByMinutes: { $gt: 0, $lte: 5 } },
                '6-10-mins': { isLate: true, lateByMinutes: { $gt: 5, $lte: 10 } },
                '11-15-mins': { isLate: true, lateByMinutes: { $gt: 10, $lte: 15 } },
                'more-than-15': { isLate: true, lateByMinutes: { $gt: 15 } }
            };
            const checkOutHandlers = {
                'before-checkout': { earlyExit: true },
                'after-checkout': { earlyExit: false, checkOutTime: { $exists: true, $ne: null } }
            };
            const workHoursHandlers = {
                'less-than-8': { workingHours: { $lt: 8 }, checkOutTime: { $exists: true, $ne: null } },
                'more-than-8': { workingHours: { $gte: 8 }, checkOutTime: { $exists: true, $ne: null } }
            };
            const andConditions = [];
            const checkInQuery = buildOrQuery(checkIn, checkInHandlers);
            if (checkInQuery)
                andConditions.push(checkInQuery);
            const checkOutQuery = buildOrQuery(checkOut, checkOutHandlers);
            if (checkOutQuery)
                andConditions.push(checkOutQuery);
            const workHoursQuery = buildOrQuery(workHours, workHoursHandlers);
            if (workHoursQuery)
                andConditions.push(workHoursQuery);
            if (andConditions.length > 0) {
                filterData.$and = andConditions;
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
    /**
     * HR upsert attendance (create or update for a specific date)
     * POST /api/v1/hr/attendance/admin/upsert
     */
    async upsertAttendanceByAdmin(req, res, next) {
        try {
            const userId = pickUserId(req.params.userId) || pickUserId(req.body.userId);
            if (!userId)
                throw new Error('User ID is required');
            const result = await attendance_service_1.attendanceService.upsertAttendanceByAdmin({ ...req.body, userId });
            (0, response_1.sendSuccessResponse)(res, result.isNew ? 'Attendance created successfully' : 'Attendance updated successfully', result.attendance);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
}
exports.AttendanceController = AttendanceController;
exports.attendanceController = new AttendanceController();
//# sourceMappingURL=attendance.controller.js.map