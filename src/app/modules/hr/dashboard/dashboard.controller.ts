import { Response, NextFunction } from 'express';
import { dashboardService } from './dashboard.service';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
import { sendSuccessResponse, sendErrorResponse } from '../../../../shared/utils/response';

export class DashboardController {
  async getDashboardStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await dashboardService.getDashboardStats();
      sendSuccessResponse(res, 'Dashboard statistics retrieved successfully', stats);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getBirthdays(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const birthdays = await dashboardService.getBirthdays();
      sendSuccessResponse(res, 'Birthdays retrieved successfully', birthdays);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getNewHires(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { days = 30 } = req.query;
      const newHires = await dashboardService.getNewHires(Number(days));
      sendSuccessResponse(res, 'New hires retrieved successfully', newHires);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getRecentAnnouncements(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log(req.user.professionalDetails)
      const announcements = await dashboardService.getRecentAnnouncements(
        req.user._id.toString(),
        req.user.role,
        req.user.professionalDetails?.department?.toString()
      );
      sendSuccessResponse(res, 'Announcements retrieved successfully', announcements);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }
}

export const dashboardController = new DashboardController();