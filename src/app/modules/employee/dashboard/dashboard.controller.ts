import { Response, NextFunction } from 'express';
import { employeeDashboardService } from './dashboard.service';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
import { sendSuccessResponse, sendErrorResponse } from '../../../../shared/utils/response';

export class EmployeeDashboardController {
  async getMyDashboard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const dashboard = await employeeDashboardService.getMyDashboard(
        req.user._id.toString(),
        req.user.role,
        req.user.professionalDetails.department._id.toString()
      );
      sendSuccessResponse(res, 'Dashboard retrieved successfully', dashboard);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getBirthdays(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const birthdays = await employeeDashboardService.getBirthdays();
      sendSuccessResponse(res, 'Birthdays retrieved successfully', birthdays);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getAnniversary(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const anniversaries = await employeeDashboardService.getAnniversary();
      sendSuccessResponse(res, 'Anniversaries retrieved successfully', anniversaries);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getNewHires(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { days = 30, date } = req.query;
      const newHires = await employeeDashboardService.getNewHires(Number(days), date as string);
      sendSuccessResponse(res, 'New hires retrieved successfully', newHires);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }
}

export const employeeDashboardController = new EmployeeDashboardController();