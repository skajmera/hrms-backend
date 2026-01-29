import { Response, NextFunction } from 'express';
import { reportsService } from './reports.service';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
import { sendSuccessResponse, sendErrorResponse } from '../../../../shared/utils/response';

export class ReportsController {
  async getAttendanceReport(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { startDate, endDate, departmentId } = req.query;
      const report = await reportsService.generateAttendanceReport(
        new Date(startDate as string),
        new Date(endDate as string),
        departmentId as string
      );
      sendSuccessResponse(res, 'Attendance report generated successfully', report);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getLeaveReport(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { year, departmentId } = req.query;
      const report = await reportsService.generateLeaveReport(Number(year), departmentId as string);
      sendSuccessResponse(res, 'Leave report generated successfully', report);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getPayrollReport(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { month, year } = req.params;
      const report = await reportsService.generatePayrollReport(Number(month), Number(year));
      sendSuccessResponse(res, 'Payroll report generated successfully', report);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getHeadcountReport(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const report = await reportsService.generateHeadcountReport();
      sendSuccessResponse(res, 'Headcount report generated successfully', report);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }
}

export const reportsController = new ReportsController();