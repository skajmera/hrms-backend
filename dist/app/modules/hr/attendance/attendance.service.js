"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceService = exports.AttendanceService = void 0;
const attendance_dal_1 = require("../../../../shared/dal/attendance.dal");
const user_dal_1 = require("../../../../shared/dal/user.dal");
const shiftHelper_1 = require("../../../../shared/utils/shiftHelper");
class AttendanceService {
    /**
     * Mark attendance
     */
    async markAttendance(attendanceData) {
        // Check if attendance already marked for this date
        const existing = await attendance_dal_1.attendanceDAL.findByUserAndDate(attendanceData.userId, attendanceData.date);
        if (existing) {
            throw new Error('Attendance already marked for this date');
        }
        const user = await user_dal_1.userDAL.findById(attendanceData.userId);
        if (!user) {
            throw new Error('User not found');
        }
        const shiftTime = user.professionalDetails.shiftTime;
        if (!shiftTime) {
            throw new Error('Shift time not configured for user');
        }
        // Calculate late arrival
        let isLate = false;
        let lateByMinutes = 0;
        if (attendanceData.checkInTime) {
            const lateCheck = shiftHelper_1.ShiftHelper.isLate(new Date(attendanceData.checkInTime), shiftTime);
            isLate = lateCheck.isLate;
            lateByMinutes = lateCheck.lateByMinutes;
        }
        // Calculate early exit and working hours if checkout time provided
        let earlyExit = false;
        let earlyExitByMinutes = 0;
        let workingHours = 0;
        let overtimeHours = 0;
        if (attendanceData.checkInTime && attendanceData.checkOutTime) {
            const checkOut = new Date(attendanceData.checkOutTime);
            const earlyExitCheck = shiftHelper_1.ShiftHelper.isEarlyExit(checkOut, shiftTime);
            earlyExit = earlyExitCheck.earlyExit;
            earlyExitByMinutes = earlyExitCheck.earlyExitByMinutes;
            // Calculate working hours
            workingHours = shiftHelper_1.ShiftHelper.calculateWorkingHours(new Date(attendanceData.checkInTime), checkOut, 0 // You can add break hours here
            );
            // Calculate overtime
            overtimeHours = shiftHelper_1.ShiftHelper.calculateOvertimeHours(workingHours, shiftTime);
        }
        // Create attendance with calculated values
        return await attendance_dal_1.attendanceDAL.create({
            ...attendanceData,
            isLate,
            lateByMinutes,
            earlyExit,
            earlyExitByMinutes,
            workingHours,
            overtimeHours
        });
    }
    /**
     * Get attendance by ID
     */
    async getAttendanceById(id) {
        const attendance = await attendance_dal_1.attendanceDAL.findById(id);
        if (!attendance) {
            throw new Error('Attendance record not found');
        }
        return attendance;
    }
    /**
     * Get all attendance records
     */
    async getAllAttendance(filters, options) {
        return await attendance_dal_1.attendanceDAL.findAll(filters, options);
    }
    /**
     * Update attendance
     */
    async updateAttendance(id, updateData) {
        const attendance = await attendance_dal_1.attendanceDAL.findById(id);
        if (!attendance) {
            throw new Error('Attendance record not found');
        }
        // Get user for shift time
        const user = await user_dal_1.userDAL.findById(attendance.userId.toString());
        if (!user || !user.professionalDetails.shiftTime) {
            throw new Error('Shift time not configured');
        }
        const shiftTime = user.professionalDetails.shiftTime;
        // Recalculate if times are updated
        if (updateData.checkInTime || updateData.checkOutTime) {
            const checkInTime = new Date(updateData.checkInTime || attendance.checkInTime);
            const checkOutTime = updateData.checkOutTime ? new Date(updateData.checkOutTime) : null;
            // Recalculate late status
            const lateCheck = shiftHelper_1.ShiftHelper.isLate(checkInTime, shiftTime);
            updateData.isLate = lateCheck.isLate;
            updateData.lateByMinutes = lateCheck.lateByMinutes;
            // Recalculate working hours and overtime if checkout exists
            if (checkOutTime) {
                const earlyExitCheck = shiftHelper_1.ShiftHelper.isEarlyExit(checkOutTime, shiftTime);
                updateData.earlyExit = earlyExitCheck.earlyExit;
                updateData.earlyExitByMinutes = earlyExitCheck.earlyExitByMinutes;
                updateData.workingHours = shiftHelper_1.ShiftHelper.calculateWorkingHours(checkInTime, checkOutTime);
                updateData.overtimeHours = shiftHelper_1.ShiftHelper.calculateOvertimeHours(updateData.workingHours, shiftTime);
            }
        }
        return await attendance_dal_1.attendanceDAL.update(id, updateData);
    }
    /**
     * Delete attendance
     */
    async deleteAttendance(id) {
        const attendance = await attendance_dal_1.attendanceDAL.delete(id);
        if (!attendance) {
            throw new Error('Attendance record not found');
        }
        return attendance;
    }
    /**
     * Get today's attendance
     */
    async getTodayAttendance() {
        return await user_dal_1.userDAL.getTodayAttendanceOverview();
    }
    /**
     * Get user attendance report
     */
    async getUserAttendanceReport(userId, month, year) {
        return await attendance_dal_1.attendanceDAL.getUserAttendanceStats(userId, month, year);
    }
    /**
     * Get attendance by date range
     */
    async getAttendanceByDateRange(userId, startDate, endDate) {
        return await attendance_dal_1.attendanceDAL.findByUserAndDateRange(userId, startDate, endDate);
    }
}
exports.AttendanceService = AttendanceService;
exports.attendanceService = new AttendanceService();
//# sourceMappingURL=attendance.service.js.map