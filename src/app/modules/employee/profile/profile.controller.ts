import { Response, NextFunction } from 'express';
import { employeeProfileService } from './profile.service';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
import { sendSuccessResponse, sendErrorResponse,sendPaginatedResponse } from '../../../../shared/utils/response';
import { HTTP_STATUS } from '../../../../config/constants';

export class EmployeeProfileController {
  async getMyProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await employeeProfileService.getMyProfile(req.user._id.toString());
      sendSuccessResponse(res, 'Profile retrieved successfully', user);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
  }

  async updateMyProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await employeeProfileService.updateMyProfile(req.user._id.toString(), req.body);
      sendSuccessResponse(res, 'Profile updated successfully', user);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  async changePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { currentPassword, newPassword } = req.body;
      await employeeProfileService.changePassword(req.user._id.toString(), currentPassword, newPassword);
      sendSuccessResponse(res, 'Password changed successfully');
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

    /**
     * Get all users
     */
    async getAllUsers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', ...filters} = req.query;
        
        filters.role = 'employee'; 
        filters.isActive = true as any; 
        const result = await employeeProfileService.getAllUsers(filters, {
          page: Number(page),
          limit: Number(limit),
          sortBy: sortBy as string,
          sortOrder: sortOrder as 'asc' | 'desc'
        });
  
        sendPaginatedResponse(
          res,
          result.users,
          result.total,
          Number(page),
          Number(limit),
          'Users retrieved successfully'
        );
      } catch (error: any) {
        sendErrorResponse(res, error.message);
      }
    }
  
}

export const employeeProfileController = new EmployeeProfileController();