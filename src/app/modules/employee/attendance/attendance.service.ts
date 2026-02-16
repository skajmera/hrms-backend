import { attendanceDAL } from '../../../../shared/dal/attendance.dal';
import { IAttendanceCreateInput } from '../../../../shared/interfaces/attendance.interface';
import { ShiftHelper } from '../../../../shared/utils/shiftHelper';
import { userDAL } from '../../../../shared/dal/user.dal';

export class EmployeeAttendanceService {
  /**
   * Mark own attendance
   */
  async markMyAttendance(userId: string, attendanceData: Omit<IAttendanceCreateInput, 'userId'>) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already marked
    const existing = await attendanceDAL.findByUserAndDate(userId, today);
    if (existing) {
      throw new Error('Attendance already marked for today');
    }

    // Get user shift time
    const user = await userDAL.findById(userId);
    if (!user || !user.professionalDetails.shiftTime) {
      throw new Error('Shift time not configured. Please contact HR.');
    }

    const shiftTime = user.professionalDetails.shiftTime;
    const checkInTime = new Date();

    // Calculate if late
    const lateCheck = ShiftHelper.isLate(checkInTime, shiftTime);

    // Auto-detect status based on shift time
    let status = attendanceData.status;
    if (lateCheck.isLate && status === 'PRESENT') {
      status = 'LATE';
    }

    return await attendanceDAL.create({
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
  async checkOut(userId: string, attendanceId: string) {
    const attendance = await attendanceDAL.findById(attendanceId);
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
    const user = await userDAL.findById(userId);
    if (!user || !user.professionalDetails.shiftTime) {
      throw new Error('Shift time not configured');
    }

    const shiftTime = user.professionalDetails.shiftTime;
    const checkOutTime = new Date();

    // Calculate early exit
    const earlyExitCheck = ShiftHelper.isEarlyExit(checkOutTime, shiftTime);

    // Calculate working hours
    const workingHours = ShiftHelper.calculateWorkingHours(
      attendance.checkInTime!,
      checkOutTime
    );

    // Calculate overtime
    const overtimeHours = ShiftHelper.calculateOvertimeHours(workingHours, shiftTime);

    return await attendanceDAL.update(attendanceId, {
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
  async getMyAttendance(userId: string, startDate: Date, endDate: Date) {
    return await attendanceDAL.findByUserAndDateRange(userId, startDate, endDate);
  }

  /**
   * Get my attendance summary
   */
  async getMyAttendanceSummary(userId: string, month: number, year: number) {
    return await attendanceDAL.getUserAttendanceStats(userId, month, year);
  }
}

export const employeeAttendanceService = new EmployeeAttendanceService();