"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeAttendanceService = exports.EmployeeAttendanceService = void 0;
const attendance_dal_1 = require("../../../../shared/dal/attendance.dal");
const shiftHelper_1 = require("../../../../shared/utils/shiftHelper");
const user_dal_1 = require("../../../../shared/dal/user.dal");
class EmployeeAttendanceService {
    /**
     * Mark own attendance
     */
    async markMyAttendance(userId, attendanceData) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // Check if already marked
        const existing = await attendance_dal_1.attendanceDAL.findByUserAndDate(userId, today);
        if (existing) {
            throw new Error('Attendance already marked for today');
        }
        // Get user shift time
        const user = await user_dal_1.userDAL.findById(userId);
        if (!user || !user.professionalDetails.shiftTime) {
            throw new Error('Shift time not configured. Please contact HR.');
        }
        const shiftTime = user.professionalDetails.shiftTime;
        const checkInTime = new Date();
        // Calculate if late
        const lateCheck = shiftHelper_1.ShiftHelper.isLate(checkInTime, shiftTime);
        // Auto-detect status based on shift time
        let status = attendanceData.status;
        if (lateCheck.isLate && status === 'PRESENT') {
            status = 'LATE';
        }
        return await attendance_dal_1.attendanceDAL.create({
            ...attendanceData,
            userId,
            checkInTime,
            isLate: lateCheck.isLate,
            lateByMinutes: lateCheck.lateByMinutes,
            status
        });
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
     * Get own attendance history
     */
    async getMyAttendance(userId, startDate, endDate) {
        return await attendance_dal_1.attendanceDAL.findByUserAndDateRange(userId, startDate, endDate);
    }
    /**
     * Get my attendance summary
     */
    async getMyAttendanceSummary(userId, month, year) {
        return await attendance_dal_1.attendanceDAL.getUserAttendanceStats(userId, month, year);
    }
}
exports.EmployeeAttendanceService = EmployeeAttendanceService;
exports.employeeAttendanceService = new EmployeeAttendanceService();
//# sourceMappingURL=attendance.service.js.map