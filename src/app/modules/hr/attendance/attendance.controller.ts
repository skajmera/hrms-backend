import { Response, NextFunction } from 'express';
import { attendanceService } from './attendance.service';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
import { sendSuccessResponse, sendErrorResponse, sendPaginatedResponse } from '../../../../shared/utils/response';
import { HTTP_STATUS } from '../../../../config/constants';

export class AttendanceController {
  async markAttendance(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const attendance = await attendanceService.markAttendance(req.body);
      sendSuccessResponse(res, 'Attendance marked successfully', attendance, HTTP_STATUS.CREATED);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  async getAttendanceById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const attendance = await attendanceService.getAttendanceById(req.params.id);
      sendSuccessResponse(res, 'Attendance retrieved successfully', attendance);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
  }

  async getAllAttendance(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 10, sortBy = 'date', sortOrder = 'desc', ...filters } = req.query;
      
      const result = await attendanceService.getAllAttendance(filters, {
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

  async updateAttendance(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const attendance = await attendanceService.updateAttendance(req.params.id, req.body);
      sendSuccessResponse(res, 'Attendance updated successfully', attendance);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  async deleteAttendance(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await attendanceService.deleteAttendance(req.params.id);
      sendSuccessResponse(res, 'Attendance deleted successfully');
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
  }

  async getTodayAttendance(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const attendance = await attendanceService.getTodayAttendance();
      sendSuccessResponse(res, "Today's attendance retrieved successfully", attendance);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getUserAttendanceReport(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, month, year } = req.params;
      const report = await attendanceService.getUserAttendanceReport(userId, Number(month), Number(year));
      sendSuccessResponse(res, 'Attendance report retrieved successfully', report);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }
}

export const attendanceController = new AttendanceController();