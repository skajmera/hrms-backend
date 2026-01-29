import { Response, NextFunction } from 'express';
import { employeeAttendanceService } from './attendance.service';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
import { sendSuccessResponse, sendErrorResponse } from '../../../../shared/utils/response';
import { HTTP_STATUS } from '../../../../config/constants';

export class EmployeeAttendanceController {
  async markMyAttendance(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const attendance = await employeeAttendanceService.markMyAttendance(req.user._id.toString(), req.body);
      sendSuccessResponse(res, 'Attendance marked successfully', attendance, HTTP_STATUS.CREATED);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  async getMyAttendance(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const attendance = await employeeAttendanceService.getMyAttendance(
        req.user._id.toString(),
        new Date(startDate as string),
        new Date(endDate as string)
      );
      sendSuccessResponse(res, 'Attendance retrieved successfully', attendance);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getMyAttendanceSummary(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { month, year } = req.params;
      const summary = await employeeAttendanceService.getMyAttendanceSummary(
        req.user._id.toString(),
        Number(month),
        Number(year)
      );
      sendSuccessResponse(res, 'Attendance summary retrieved successfully', summary);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }
}

export const employeeAttendanceController = new EmployeeAttendanceController();