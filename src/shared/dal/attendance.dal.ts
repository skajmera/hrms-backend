import { AttendanceModel } from '../models/attendance.model';
import { IAttendance, IAttendanceCreateInput } from '../interfaces/attendance.interface';
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
      .populate('userId', 'firstName lastName email professionalDetails.employeeId');
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
      .populate('userId', 'firstName lastName email professionalDetails.employeeId professionalDetails.department professionalDetails.shiftTime' )
      .populate('approvedBy', 'firstName lastName')
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
      .populate('userId', 'firstName lastName email');
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
    endDate: Date
  ): Promise<IAttendance[]> {
    return await AttendanceModel.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
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
      .populate('userId', 'firstName lastName shiftTime email professionalDetails.employeeId professionalDetails.department');
  }

  /**
   * Get attendance statistics for a user
   */
  async getUserAttendanceStats(userId: string, month: number, year: number): Promise<any> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return await AttendanceModel.aggregate([
      {
        $match: {
          userId: userId,
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
   * Get late arrivals
   */
  async getLateArrivals(startDate: Date, endDate: Date): Promise<IAttendance[]> {
    return await AttendanceModel.find({
      date: { $gte: startDate, $lte: endDate },
      isLate: true
    })
      .populate('userId', 'firstName lastName email professionalDetails.employeeId')
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
}

export const attendanceDAL = new AttendanceDAL();