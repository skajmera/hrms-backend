import { Response, NextFunction } from 'express';
import { analyticsService } from './analytics.service';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
import { sendSuccessResponse, sendErrorResponse } from '../../../../shared/utils/response';

export class AnalyticsController {
  async getAttendanceStatistics(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { month, year, departmentId } = req.query;
      
      const stats = await analyticsService.getAttendanceStatistics(
        Number(month),
        Number(year),
        departmentId as string
      );
      
      sendSuccessResponse(res, 'Statistics retrieved successfully', stats);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getDepartmentWiseAnalytics(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { month, year } = req.query;
      
      const analytics = await analyticsService.getDepartmentWiseAnalytics(
        Number(month),
        Number(year)
      );
      
      sendSuccessResponse(res, 'Department analytics retrieved successfully', analytics);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getEmployeePerformanceAnalytics(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const { month, year } = req.query;
      
      const analytics = await analyticsService.getEmployeePerformanceAnalytics(
        userId,
        Number(month),
        Number(year)
      );
      
      sendSuccessResponse(res, 'Employee analytics retrieved successfully', analytics);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getAttendanceTrend(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { year, departmentId } = req.query;
      
      const trend = await analyticsService.getAttendanceTrend(
        Number(year),
        departmentId as string
      );
      
      sendSuccessResponse(res, 'Attendance trend retrieved successfully', trend);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getLeaveStatistics(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { month, year, departmentId } = req.query;
      
      const stats = await analyticsService.getLeaveStatistics(
        Number(month),
        Number(year),
        departmentId as string
      );
      
      sendSuccessResponse(res, 'Leave statistics retrieved successfully', stats);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getRealTimeDashboardStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await analyticsService.getRealTimeDashboardStats();
      sendSuccessResponse(res, 'Real-time stats retrieved successfully', stats);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }
}

export const analyticsController = new AnalyticsController();