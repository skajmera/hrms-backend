import { attendanceDAL } from '../../../../shared/dal/attendance.dal';
import { IAttendanceCreateInput } from '../../../../shared/interfaces/attendance.interface';

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

    return await attendanceDAL.create({
      ...attendanceData,
      userId
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