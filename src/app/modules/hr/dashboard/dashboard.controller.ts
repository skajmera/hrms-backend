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
      const { days = 30, date } = req.query;
      const newHires = await dashboardService.getNewHires(Number(days), date as string);
      sendSuccessResponse(res, 'New hires retrieved successfully', newHires);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getRecentAnnouncements(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const announcements = await dashboardService.getRecentAnnouncements(
        req.user._id.toString(),
        req.user.role,
        req.user.professionalDetails?.department?._id.toString()
      );
      sendSuccessResponse(res, 'Announcements retrieved successfully', announcements);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }


  async getAnniversary(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const birthdays = await dashboardService.getAnniversary();
      sendSuccessResponse(res, 'Anniversary retrieved successfully', birthdays);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }


  /**
   * ✅ NEW - Get leave statistics
   */
  async getLeaveStatistics(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await dashboardService.getLeaveStatistics();
      sendSuccessResponse(res, 'Leave statistics retrieved successfully', stats);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  /**
   * ✅ NEW - Get top leave takers
   */
  async getTopLeaveTakers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { limit = 10 } = req.query;
      const topTakers = await dashboardService.getTopLeaveTakers(Number(limit));
      sendSuccessResponse(res, 'Top leave takers retrieved successfully', topTakers);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }
}

export const dashboardController = new DashboardController();