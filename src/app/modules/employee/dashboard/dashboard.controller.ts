import { Response, NextFunction } from 'express';
import { employeeDashboardService } from './dashboard.service';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
import { sendSuccessResponse, sendErrorResponse, sendPaginatedResponse } from '../../../../shared/utils/response';

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
      const userId = req.user._id.toString();
      const userRole = req.user.role;
      const dept = req.user.professionalDetails?.department;
      const deptId = dept?._id ? dept._id.toString() : dept?.toString() ?? '';

      const result = await employeeDashboardService.getBirthdays(userId, userRole, deptId);
      sendPaginatedResponse(res, result.announcements, result.total, 1, 10, 'Birthdays retrieved successfully');
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getAnniversary(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user._id.toString();
      const userRole = req.user.role;
      const dept = req.user.professionalDetails?.department;
      const deptId = dept?._id ? dept._id.toString() : dept?.toString() ?? '';

      const result = await employeeDashboardService.getAnniversary(userId, userRole, deptId);
      sendPaginatedResponse(res, result.announcements, result.total, 1, 10, 'Anniversaries retrieved successfully');
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getNewHires(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user._id.toString();
      const userRole = req.user.role;
      const dept = req.user.professionalDetails?.department;
      const deptId = dept?._id ? dept._id.toString() : dept?.toString() ?? '';

      const result = await employeeDashboardService.getNewHires(userId, userRole, deptId);
      sendPaginatedResponse(res, result.announcements, result.total, 1, 10, 'New hires retrieved successfully');
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getAllAnnouncements(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
      const userId = req.user._id.toString();
      const userRole = req.user.role;
      const dept = req.user.professionalDetails?.department;
      const deptId = dept?._id ? dept._id.toString() : dept?.toString() ?? '';

      const result = await employeeDashboardService.getAllAnnouncements(
        userId, userRole, deptId,
        { page: Number(page), limit: Number(limit), sortBy: sortBy as string, sortOrder: sortOrder as 'asc' | 'desc' }
      );
      sendPaginatedResponse(res, result.announcements, result.total, Number(page), Number(limit), 'Announcements retrieved successfully');
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }
}

export const employeeDashboardController = new EmployeeDashboardController();