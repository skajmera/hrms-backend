import { attendanceDAL } from '../../../../shared/dal/attendance.dal';
import { IAttendanceCreateInput } from '../../../../shared/interfaces/attendance.interface';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';
import {  userDAL} from '../../../../shared/dal/user.dal';
import { ShiftHelper } from '../../../../shared/utils/shiftHelper';
export class AttendanceService {
  /**
   * Mark attendance
   */
  async markAttendance(attendanceData: IAttendanceCreateInput) {
    // Check if attendance already marked for this date
    const existing = await attendanceDAL.findByUserAndDate(
      attendanceData.userId,
      attendanceData.date
    );

    if (existing) {
      throw new Error('Attendance already marked for this date');
    }
    const user = await userDAL.findById(attendanceData.userId);
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
      const lateCheck = ShiftHelper.isLate(new Date(attendanceData.checkInTime), shiftTime);
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
      const earlyExitCheck = ShiftHelper.isEarlyExit(checkOut, shiftTime);
      earlyExit = earlyExitCheck.earlyExit;
      earlyExitByMinutes = earlyExitCheck.earlyExitByMinutes;

      // Calculate working hours
      workingHours = ShiftHelper.calculateWorkingHours(
        new Date(attendanceData.checkInTime),
        checkOut,
        0 // You can add break hours here
      );

      // Calculate overtime
      overtimeHours = ShiftHelper.calculateOvertimeHours(workingHours, shiftTime);
    }

 // Create attendance with calculated values
 return await attendanceDAL.create({
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
  async getAttendanceById(id: string) {
    const attendance = await attendanceDAL.findById(id);
    if (!attendance) {
      throw new Error('Attendance record not found');
    }
    return attendance;
  }

  /**
   * Get all attendance records
   */
  async getAllAttendance(filters: any, options: IPaginationOptions) {
    return await attendanceDAL.findAll(filters, options);
  }

  /**
   * Update attendance
   */
  async updateAttendance(id: string, updateData: any) {
    const attendance = await attendanceDAL.findById(id);
    if (!attendance) {
      throw new Error('Attendance record not found');
    }

    // Get user for shift time
    const user = await userDAL.findById(attendance.userId.toString());
    if (!user || !user.professionalDetails.shiftTime) {
      throw new Error('Shift time not configured');
    }

    const shiftTime = user.professionalDetails.shiftTime;

    // Recalculate if times are updated
    if (updateData.checkInTime || updateData.checkOutTime) {
      const checkInTime = new Date(updateData.checkInTime || attendance.checkInTime);
      const checkOutTime = updateData.checkOutTime ? new Date(updateData.checkOutTime) : null;

      // Recalculate late status
      const lateCheck = ShiftHelper.isLate(checkInTime, shiftTime);
      updateData.isLate = lateCheck.isLate;
      updateData.lateByMinutes = lateCheck.lateByMinutes;

      // Recalculate working hours and overtime if checkout exists
      if (checkOutTime) {
        const earlyExitCheck = ShiftHelper.isEarlyExit(checkOutTime, shiftTime);
        updateData.earlyExit = earlyExitCheck.earlyExit;
        updateData.earlyExitByMinutes = earlyExitCheck.earlyExitByMinutes;

        updateData.workingHours = ShiftHelper.calculateWorkingHours(checkInTime, checkOutTime);
        updateData.overtimeHours = ShiftHelper.calculateOvertimeHours(updateData.workingHours, shiftTime);
      }
    }

    return await attendanceDAL.update(id, updateData);
  }

  /**
   * Delete attendance
   */
  async deleteAttendance(id: string) {
    const attendance = await attendanceDAL.delete(id);
    if (!attendance) {
      throw new Error('Attendance record not found');
    }
    return attendance;
  }

  /**
   * Get today's attendance
   */
  async getTodayAttendance() {
    return await userDAL.getTodayAttendanceOverview();
  }

  /**
   * Get user attendance report
   */
  async getUserAttendanceReport(userId: string, month: number, year: number) {
    return await attendanceDAL.getUserAttendanceStats(userId, month, year);
  }

  /**
   * Get attendance by date range
   */
  async getAttendanceByDateRange(userId: string, startDate: Date, endDate: Date) {
    return await attendanceDAL.findByUserAndDateRange(userId, startDate, endDate);
  }
}

export const attendanceService = new AttendanceService();