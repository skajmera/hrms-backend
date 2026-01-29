import { Response, NextFunction } from 'express';
import { employeeProfileService } from './profile.service';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
import { sendSuccessResponse, sendErrorResponse } from '../../../../shared/utils/response';
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
}

export const employeeProfileController = new EmployeeProfileController();