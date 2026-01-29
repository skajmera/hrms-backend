import { attendanceDAL } from '../../../../shared/dal/attendance.dal';
import { IAttendanceCreateInput } from '../../../../shared/interfaces/attendance.interface';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';

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

    return await attendanceDAL.create(attendanceData);
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
    const attendance = await attendanceDAL.update(id, updateData);
    if (!attendance) {
      throw new Error('Attendance record not found');
    }
    return attendance;
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
    return await attendanceDAL.getTodayAttendance();
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