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
}

export const employeeDashboardController = new EmployeeDashboardController();