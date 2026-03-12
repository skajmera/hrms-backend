import { Response, NextFunction } from 'express';
import { attendanceService } from './attendance.service';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
import { sendSuccessResponse, sendErrorResponse, sendPaginatedResponse } from '../../../../shared/utils/response';
import { HTTP_STATUS } from '../../../../config/constants';

export class AttendanceController {
  /**
   * Mark attendance (Check-In / Check-Out)
   * POST /api/v1/hr/attendance/mark
   */
  async markAttendance(req: any, res: Response, next: NextFunction) {
    try {
      let attendanceData = req.body;

      // If multipart (from multer), the file might be in req.file
      if (req.file) {
        attendanceData.selfie = `/${req.file.path.replace(/\\/g, '/')}`;
      }

      // Use userId from body if provided (HR marking for others), otherwise use token ID
      const userId = req.body.userId || req.user?._id?.toString() || req.user?.id;
      if (!userId) {
        throw new Error('User ID is required');
      }

      const result = await attendanceService.markAttendance({
        ...attendanceData,
        userId,
        date: attendanceData.date || new Date()
      });

      sendSuccessResponse(
        res,
        `${result.type} successful`,
        result.attendance,
        HTTP_STATUS.CREATED
      );
    } catch (error: any) {
      // Handle custom status codes from service
      if (error.statusCode) {
        sendErrorResponse(res, error.message, error.statusCode);
      } else {
        next(error);
      }
    }
  }

  /**
   * Register Device & Face (One-time setup)
   * POST /api/v1/hr/attendance/register-device
   */
  async registerDevice(req: any, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { deviceId, wifiBSSID, gpsLatitude, gpsLongitude } = req.body;
      const selfie = req.file?.path ? `/${req.file.path.replace(/\\/g, '/')}` : undefined;

      if (!selfie) {
        throw new Error('Selfie is required for registration');
      }

      const result = await attendanceService.registerDevice({
        userId,
        deviceId,
        selfie,
        wifiBSSID,
        gpsLatitude: gpsLatitude ? Number(gpsLatitude) : undefined,
        gpsLongitude: gpsLongitude ? Number(gpsLongitude) : undefined
      });

      sendSuccessResponse(res, 'Device registered successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async getAttendanceById(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const attendance = await attendanceService.getAttendanceById(req.params.id);
      sendSuccessResponse(res, 'Attendance retrieved successfully', attendance);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
  }

  async getAllAttendance(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 10, sortBy = 'date', sortOrder = 'desc', ...filters } = req.query;
      const { userId, startDate, endDate, status, checkIn, checkOut, workHours }: any = req.query;

      const filterData: any = {};
      if (userId) filterData.userId = userId;
      if (status) filterData.status = status;

      // Date constraints (set hours to hit the boundaries of the day gracefully)
      if (startDate || endDate) {
        filterData.date = {};
        if (startDate) {
          filterData.date.$gte = new Date(startDate);
        }
        if (endDate) {
          const endDay = new Date(endDate);
          endDay.setHours(23, 59, 59, 999);
          filterData.date.$lte = endDay;
        }
      }

      // Advanced Arrays Filtering 
      const buildOrQuery = (param: any, handlers: Record<string, any>) => {
        if (!param) return null;
        const values = Array.isArray(param) ? param : [param];
        const orConditions: any[] = [];
        values.forEach((val: string) => {
          if (handlers[val]) {
            orConditions.push(handlers[val]);
          }
        });
        return orConditions.length > 0 ? { $or: orConditions } : null;
      };

      const checkInHandlers = {
        'before-checkin': { isLate: false, checkInTime: { $exists: true, $ne: null } },
        'after-checkin': { isLate: true },
        '0-5-mins': { isLate: true, lateByMinutes: { $gt: 0, $lte: 5 } },
        '6-10-mins': { isLate: true, lateByMinutes: { $gt: 5, $lte: 10 } },
        '11-15-mins': { isLate: true, lateByMinutes: { $gt: 10, $lte: 15 } },
        'more-than-15': { isLate: true, lateByMinutes: { $gt: 15 } },
      };

      const checkOutHandlers = {
        'before-checkout': { earlyExit: true },
        'after-checkout': { earlyExit: false, checkOutTime: { $exists: true, $ne: null } },
      };

      const workHoursHandlers = {
        'less-than-8': { workingHours: { $lt: 8 }, checkOutTime: { $exists: true, $ne: null } },
        'more-than-8': { workingHours: { $gte: 8 }, checkOutTime: { $exists: true, $ne: null } },
      };

      const andConditions: any[] = [];

      const checkInQuery = buildOrQuery(checkIn, checkInHandlers);
      if (checkInQuery) andConditions.push(checkInQuery);

      const checkOutQuery = buildOrQuery(checkOut, checkOutHandlers);
      if (checkOutQuery) andConditions.push(checkOutQuery);

      const workHoursQuery = buildOrQuery(workHours, workHoursHandlers);
      if (workHoursQuery) andConditions.push(workHoursQuery);

      // Merge native $and
      if (andConditions.length > 0) {
        filterData.$and = andConditions;
      }
      const result = await attendanceService.getAllAttendance(filterData, {
        page: Number(page),
        limit: Number(limit),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      });

      sendPaginatedResponse(
        res,
        result.records,
        result.total,
        Number(page),
        Number(limit),
        'Attendance records retrieved successfully'
      );
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async updateAttendance(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const attendance = await attendanceService.updateAttendance(req.params.id, req.body);
      sendSuccessResponse(res, 'Attendance updated successfully', attendance);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  async deleteAttendance(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      await attendanceService.deleteAttendance(req.params.id);
      sendSuccessResponse(res, 'Attendance deleted successfully');
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
  }

  async getTodayAttendance(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const attendance = await attendanceService.getTodayAttendance();
      sendSuccessResponse(res, "Today's attendance retrieved successfully", attendance);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getUserAttendanceReport(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, month, year } = req.params;
      const report = await attendanceService.getUserAttendanceReport(userId, Number(month), Number(year));
      sendSuccessResponse(res, 'Attendance report retrieved successfully', report);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getEmployeeTodayAttendance(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const attendance = await attendanceService.getEmployeeTodayAttendance(userId);
      sendSuccessResponse(res, "Employee's today attendance retrieved successfully", attendance);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }
}

export const attendanceController = new AttendanceController();