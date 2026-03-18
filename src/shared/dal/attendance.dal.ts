import mongoose from 'mongoose';
import { AttendanceModel } from '../models/attendance.model';
import { IAttendance, IAttendanceCreateInput, IAttendanceReport } from '../interfaces/attendance.interface';
import { IQueryFilters, IPaginationOptions } from '../interfaces/common.interface';

export class AttendanceDAL {
  /**
   * Mark attendance
   */
  async create(attendanceData: IAttendanceCreateInput): Promise<IAttendance> {
    return await AttendanceModel.create(attendanceData);
  }

  /**
   * Find attendance by ID
   */
  async findById(id: string): Promise<IAttendance | null> {
    return await AttendanceModel.findById(id)
      .populate('userId', 'firstName lastName email profilePicture professionalDetails.employeeId');
  }

  /**
   * Find attendance by user and date
   */
  async findByUserAndDate(userId: string, date: Date): Promise<IAttendance | null> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await AttendanceModel.findOne({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });
  }

  /**
   * Find all attendance records
   */
  async findAll(
    filters: IQueryFilters = {},
    options: IPaginationOptions = {}
  ): Promise<{ records: IAttendance[]; total: number }> {
    const { page = 1, limit = 10, sortBy = 'date', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;
    const records = await AttendanceModel.find(filters)
      .populate('userId', 'firstName lastName email profilePicture professionalDetails.employeeId professionalDetails.department professionalDetails.shiftTime')
      .populate('approvedBy', 'firstName lastName profilePicture')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    const total = await AttendanceModel.countDocuments(filters);

    return { records, total };
  }

  /**
   * Update attendance
   */
  async update(id: string, updateData: Partial<IAttendance>): Promise<IAttendance | null> {
    return await AttendanceModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('userId', 'firstName lastName email profilePicture');
  }

  /**
   * Delete attendance
   */
  async delete(id: string): Promise<IAttendance | null> {
    return await AttendanceModel.findByIdAndDelete(id);
  }

  /**
   * Get attendance by user and date range
   */
  async findByUserAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
    additionalFilters: IQueryFilters = {}
  ): Promise<IAttendance[]> {
    return await AttendanceModel.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
      ...additionalFilters
    }).sort({ date: 1 });
  }

  /**
   * Get today's attendance
   */
  async getTodayAttendance(): Promise<IAttendance[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await AttendanceModel.find({
      date: { $gte: today, $lt: tomorrow }
    })
      .populate('userId', 'firstName lastName shiftTime email profilePicture professionalDetails.employeeId professionalDetails.department');
  }

  /**
   * Get attendance statistics for a user
   */
  async getUserAttendanceStats(userId: string, month: number, year: number): Promise<any> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    return await AttendanceModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
  }

  /**
   * Get monthly check-in summary (total, late, on-time)
   */
  async getUserMonthlyCheckInSummary(userId: string, month: number, year: number): Promise<any> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const stats = await AttendanceModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          checkin: { $sum: 1 },
          late: { $sum: { $cond: [{ $eq: ['$isLate', true] }, 1, 0] } },
          ontime: { $sum: { $cond: [{ $eq: ['$isLate', false] }, 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          checkin: 1,
          late: 1,
          ontime: 1
        }
      }
    ]);

    return stats[0] || { checkin: 0, late: 0, ontime: 0 };
  }

  /**
   * Get monthly check-in summary for all users (total, late, on-time)
   */
  async getMonthlyCheckInSummary(month: number, year: number): Promise<any> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const stats = await AttendanceModel.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          checkin: { $sum: 1 },
          late: { $sum: { $cond: [{ $eq: ['$isLate', true] }, 1, 0] } },
          ontime: { $sum: { $cond: [{ $eq: ['$isLate', false] }, 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          checkin: 1,
          late: 1,
          ontime: 1
        }
      }
    ]);

    return stats[0] || { checkin: 0, late: 0, ontime: 0 };
  }

  /**
   * Get late arrivals
   */
  async getLateArrivals(startDate: Date, endDate: Date): Promise<IAttendance[]> {
    return await AttendanceModel.find({
      date: { $gte: startDate, $lte: endDate },
      isLate: true
    })
      .populate('userId', 'firstName lastName email profilePicture professionalDetails.employeeId')
      .sort({ date: -1 });
  }

  /**
   * Get department-wise attendance
   */
  async getDepartmentAttendance(departmentId: string, date: Date): Promise<any> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await AttendanceModel.aggregate([
      {
        $match: {
          date: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $match: {
          'user.professionalDetails.department': departmentId
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
  }

  /**
   * Bulk create attendance
   */
  async bulkCreate(attendanceRecords: IAttendanceCreateInput[]): Promise<IAttendance[]> {
    return await AttendanceModel.insertMany(attendanceRecords);
  }

  /**
 * Get late arrivals count for a specific month and year
 */
  async getLateArrivalsCount(
    userId: string,
    month: number,
    year: number
  ): Promise<number> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    return await AttendanceModel.countDocuments({
      userId,
      date: { $gte: startDate, $lte: endDate },
      isLate: true
    });
  }

  /**
   * Get late arrivals details for a specific month and year
   */
  async getLateArrivalsWithUser(
    userId: string,
    month: number,
    year: number
  ): Promise<IAttendance[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    return await AttendanceModel.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
      isLate: true
    })
      .sort({ date: 1 })
      .select('date checkInTime lateByMinutes status');
  }

  /**
    * Get daily attendance summary
    */
  static async getDailySummary(date: Date): Promise<any> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const summary = await AttendanceModel.aggregate([
      {
        $match: {
          date: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    return summary;
  }


  /**
    * Get monthly attendance report
    */
  async getMonthlyReport(userId: string, month: number, year: number): Promise<IAttendanceReport> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const attendances = await this.findByUserAndDateRange(userId, startDate, endDate);

    const report: IAttendanceReport = {
      userId,
      userName: '',
      totalDays: endDate.getDate(),
      presentDays: 0,
      absentDays: 0,
      lateDays: 0,
      wfhDays: 0,
      halfDays: 0,
      totalWorkingHours: 0,
      averageWorkingHours: 0
    };

    attendances.forEach(att => {
      if (att.status === 'PRESENT' || att.status === 'LATE') report.presentDays++;
      if (att.status === 'ABSENT') report.absentDays++;
      if (att.status === 'WFH') report.wfhDays++;
      if (att.status === 'HALF_DAY') report.halfDays++;
      if (att.isLate) report.lateDays++;
      if (att.workingHours) report.totalWorkingHours += att.workingHours;
    });

    if (report.presentDays > 0) {
      report.averageWorkingHours = report.totalWorkingHours / report.presentDays;
    }

    return report;
  }

  /**
     * Get WFH count for month
     */
  static async getWFHCount(userId: string, month: number, year: number): Promise<number> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    return await AttendanceModel.countDocuments({
      userId,
      date: { $gte: startDate, $lte: endDate },
      status: 'WFH'
    });
  }

}

export const attendanceDAL = new AttendanceDAL();