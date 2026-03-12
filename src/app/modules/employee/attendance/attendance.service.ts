import { attendanceDAL } from '../../../../shared/dal/attendance.dal';
import { IAttendanceCreateInput } from '../../../../shared/interfaces/attendance.interface';
import { ShiftHelper } from '../../../../shared/utils/shiftHelper';
import { userDAL } from '../../../../shared/dal/user.dal';

export class EmployeeAttendanceService {
  /**
   * Mark own attendance (Check-In or Check-Out)
   */
  async markMyAttendance(userId: string, attendanceData: Omit<IAttendanceCreateInput, 'userId'>) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if attendance record exists for today
    let attendance = await attendanceDAL.findByUserAndDate(userId, today);

    // Get user shift time
    const user = await userDAL.findById(userId);
    if (!user || !user.professionalDetails.shiftTime) {
      throw new Error('Shift time not configured. Please contact HR.');
    }
    const shiftTime = user.professionalDetails.shiftTime;

    if (!attendance) {
      // --- CHECK-IN ---
      const checkInTime = new Date();
      const lateCheck = ShiftHelper.isLate(checkInTime, shiftTime);

      // Auto-detect status based on shift time
      let status = attendanceData.status || 'PRESENT';
      if (lateCheck.isLate && status === 'PRESENT') {
        status = 'LATE';
      }

      return await attendanceDAL.create({
        ...attendanceData,
        userId,
        checkInTime,
        isLate: lateCheck.isLate,
        lateByMinutes: lateCheck.lateByMinutes,
        status,
        isApproved: false
      });
    } else {
      // --- CHECK-OUT ---
      if (attendance.checkOutTime) {
        throw new Error('Already checked out for today');
      }

      const checkOutTime = new Date();
      const earlyExitCheck = ShiftHelper.isEarlyExit(checkOutTime, shiftTime);

      // Calculate working hours
      const workingHours = ShiftHelper.calculateWorkingHours(
        attendance.checkInTime!,
        checkOutTime
      );

      // Calculate overtime
      const overtimeHours = ShiftHelper.calculateOvertimeHours(workingHours, shiftTime);

      return await attendanceDAL.update(attendance._id.toString(), {
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
   * Get own attendance history with advanced filtering
   */
  async getMyAttendance(userId: string, startDate: Date, endDate: Date, filters: any = {}) {
    const query: any = {};

    // 1. Status Filter
    if (filters.status) {
      const statusArray = Array.isArray(filters.status) ? filters.status : [filters.status];
      query.status = { $in: statusArray };
    }

    // 2. Check-in Filter (based on isLate field)
    if (filters.checkIn) {
      const checkInArray = Array.isArray(filters.checkIn) ? filters.checkIn : [filters.checkIn];
      const conditions: any[] = [];

      if (checkInArray.includes('after-checkin')) {
        conditions.push({ isLate: true });
      }
      if (checkInArray.includes('before-checkin')) {
        conditions.push({ isLate: false });
      }

      if (conditions.length === 1) {
        Object.assign(query, conditions[0]);
      } else if (conditions.length > 1) {
        query.$or = (query.$or || []).concat(conditions);
      }
    }

    // 3. Check-out Filter (based on earlyExit field)
    if (filters.checkOut) {
      const checkOutArray = Array.isArray(filters.checkOut) ? filters.checkOut : [filters.checkOut];
      const conditions: any[] = [];

      if (checkOutArray.includes('before-checkout')) {
        conditions.push({ earlyExit: true });
      }
      if (checkOutArray.includes('after-checkout')) {
        conditions.push({ earlyExit: false });
      }

      if (conditions.length === 1) {
        Object.assign(query, conditions[0]);
      } else if (conditions.length > 1) {
        query.$or = (query.$or || []).concat(conditions);
      }
    }

    // 4. Work Hours Filter
    if (filters.workHours) {
      const workHoursArray = Array.isArray(filters.workHours) ? filters.workHours : [filters.workHours];
      const conditions: any[] = [];

      if (workHoursArray.includes('less-than-8')) {
        conditions.push({ workingHours: { $lt: 8 } });
      }
      if (workHoursArray.includes('more-than-8')) {
        conditions.push({ workingHours: { $gte: 8 } });
      }

      if (conditions.length === 1) {
        Object.assign(query, conditions[0]);
      } else if (conditions.length > 1) {
        query.$or = (query.$or || []).concat(conditions);
      }
    }

    return await attendanceDAL.findByUserAndDateRange(userId, startDate, endDate, query);
  }

  /**
   * Get my attendance summary
   */
  async getMyAttendanceSummary(userId: string, month: number, year: number) {
    return await attendanceDAL.getUserAttendanceStats(userId, month, year);
  }

  /**
   * Get my today attendance
   */
  async getTodayAttendance(userId: string) {
    const today = new Date();
    return await attendanceDAL.findByUserAndDate(userId, today);
  }
}

export const employeeAttendanceService = new EmployeeAttendanceService();