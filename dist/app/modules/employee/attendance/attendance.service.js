"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeAttendanceService = exports.EmployeeAttendanceService = void 0;
const attendance_dal_1 = require("../../../../shared/dal/attendance.dal");
const shiftHelper_1 = require("../../../../shared/utils/shiftHelper");
const user_dal_1 = require("../../../../shared/dal/user.dal");
class EmployeeAttendanceService {
    /**
     * Mark own attendance (Check-In or Check-Out)
     */
    async markMyAttendance(userId, attendanceData) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // Check if attendance record exists for today
        let attendance = await attendance_dal_1.attendanceDAL.findByUserAndDate(userId, today);
        // Get user shift time
        const user = await user_dal_1.userDAL.findById(userId);
        if (!user || !user.professionalDetails.shiftTime) {
            throw new Error('Shift time not configured. Please contact HR.');
        }
        const shiftTime = user.professionalDetails.shiftTime;
        if (!attendance) {
            // --- CHECK-IN ---
            const checkInTime = new Date();
            const lateCheck = shiftHelper_1.ShiftHelper.isLate(checkInTime, shiftTime);
            // Auto-detect status based on shift time
            let status = attendanceData.status || 'PRESENT';
            if (lateCheck.isLate && status === 'PRESENT') {
                status = 'LATE';
            }
            return await attendance_dal_1.attendanceDAL.create({
                ...attendanceData,
                userId,
                checkInTime,
                isLate: lateCheck.isLate,
                lateByMinutes: lateCheck.lateByMinutes,
                status,
                isApproved: false
            });
        }
        else {
            // --- CHECK-OUT ---
            if (attendance.checkOutTime) {
                throw new Error('Already checked out for today');
            }
            const checkOutTime = new Date();
            const earlyExitCheck = shiftHelper_1.ShiftHelper.isEarlyExit(checkOutTime, shiftTime);
            // Calculate working hours
            const workingHours = shiftHelper_1.ShiftHelper.calculateWorkingHours(attendance.checkInTime, checkOutTime);
            // Calculate overtime
            const overtimeHours = shiftHelper_1.ShiftHelper.calculateOvertimeHours(workingHours, shiftTime);
            return await attendance_dal_1.attendanceDAL.update(attendance._id.toString(), {
                checkOutTime,
                workingHours,
                overtimeHours,
                earlyExit: earlyExitCheck.earlyExit,
                earlyExitByMinutes: earlyExitCheck.earlyExitByMinutes,
                remarks: attendanceData.remarks || attendance.remarks,
                gpsLatitude: attendanceData.gpsLatitude,
                gpsLongitude: attendanceData.gpsLongitude
            });
        }
    }
    /**
     * Check out - calculate working hours
     */
    async checkOut(userId, attendanceId) {
        const attendance = await attendance_dal_1.attendanceDAL.findById(attendanceId);
        if (!attendance) {
            throw new Error('Attendance record not found');
        }
        if (attendance.userId.toString() !== userId) {
            throw new Error('Unauthorized');
        }
        if (attendance.checkOutTime) {
            throw new Error('Already checked out');
        }
        // Get user shift time
        const user = await user_dal_1.userDAL.findById(userId);
        if (!user || !user.professionalDetails.shiftTime) {
            throw new Error('Shift time not configured');
        }
        const shiftTime = user.professionalDetails.shiftTime;
        const checkOutTime = new Date();
        // Calculate early exit
        const earlyExitCheck = shiftHelper_1.ShiftHelper.isEarlyExit(checkOutTime, shiftTime);
        // Calculate working hours
        const workingHours = shiftHelper_1.ShiftHelper.calculateWorkingHours(attendance.checkInTime, checkOutTime);
        // Calculate overtime
        const overtimeHours = shiftHelper_1.ShiftHelper.calculateOvertimeHours(workingHours, shiftTime);
        return await attendance_dal_1.attendanceDAL.update(attendanceId, {
            checkOutTime,
            workingHours,
            overtimeHours,
            earlyExit: earlyExitCheck.earlyExit,
            earlyExitByMinutes: earlyExitCheck.earlyExitByMinutes
        });
    }
    /**
     * Get own attendance history with advanced filtering
     */
    async getMyAttendance(userId, startDate, endDate, filters = {}) {
        const query = {};
        // 1. Status Filter
        if (filters.status) {
            const statusArray = Array.isArray(filters.status) ? filters.status : [filters.status];
            query.status = { $in: statusArray };
        }
        // 2. Check-in Filter (based on isLate field)
        if (filters.checkIn) {
            const checkInArray = Array.isArray(filters.checkIn) ? filters.checkIn : [filters.checkIn];
            const conditions = [];
            if (checkInArray.includes('after-checkin')) {
                conditions.push({ isLate: true });
            }
            if (checkInArray.includes('before-checkin')) {
                conditions.push({ isLate: false });
            }
            if (conditions.length === 1) {
                Object.assign(query, conditions[0]);
            }
            else if (conditions.length > 1) {
                query.$or = (query.$or || []).concat(conditions);
            }
        }
        // 3. Check-out Filter (based on earlyExit field)
        if (filters.checkOut) {
            const checkOutArray = Array.isArray(filters.checkOut) ? filters.checkOut : [filters.checkOut];
            const conditions = [];
            if (checkOutArray.includes('before-checkout')) {
                conditions.push({ earlyExit: true });
            }
            if (checkOutArray.includes('after-checkout')) {
                conditions.push({ earlyExit: false });
            }
            if (conditions.length === 1) {
                Object.assign(query, conditions[0]);
            }
            else if (conditions.length > 1) {
                query.$or = (query.$or || []).concat(conditions);
            }
        }
        // 4. Work Hours Filter
        if (filters.workHours) {
            const workHoursArray = Array.isArray(filters.workHours) ? filters.workHours : [filters.workHours];
            const conditions = [];
            if (workHoursArray.includes('less-than-8')) {
                conditions.push({ workingHours: { $lt: 8 } });
            }
            if (workHoursArray.includes('more-than-8')) {
                conditions.push({ workingHours: { $gte: 8 } });
            }
            if (conditions.length === 1) {
                Object.assign(query, conditions[0]);
            }
            else if (conditions.length > 1) {
                query.$or = (query.$or || []).concat(conditions);
            }
        }
        return await attendance_dal_1.attendanceDAL.findByUserAndDateRange(userId, startDate, endDate, query);
    }
    /**
     * Get my attendance summary
     */
    async getMyAttendanceSummary(userId, month, year) {
        return await attendance_dal_1.attendanceDAL.getUserAttendanceStats(userId, month, year);
    }
    /**
     * Get my today attendance
     */
    async getTodayAttendance(userId) {
        const today = new Date();
        return await attendance_dal_1.attendanceDAL.findByUserAndDate(userId, today);
    }
}
exports.EmployeeAttendanceService = EmployeeAttendanceService;
exports.employeeAttendanceService = new EmployeeAttendanceService();
//# sourceMappingURL=attendance.service.js.map