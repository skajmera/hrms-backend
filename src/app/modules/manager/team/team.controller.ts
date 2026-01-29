import { Response, NextFunction } from 'express';
import { managerTeamService } from './team.service';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
import { sendSuccessResponse, sendErrorResponse } from '../../../../shared/utils/response';
import { HTTP_STATUS } from '../../../../config/constants';

export class ManagerTeamController {
  async getTeamMembers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const team = await managerTeamService.getTeamMembers(req.user._id.toString());
      sendSuccessResponse(res, 'Team members retrieved successfully', team);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getTeamAttendanceToday(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const attendance = await managerTeamService.getTeamAttendanceToday(req.user._id.toString());
      sendSuccessResponse(res, 'Team attendance retrieved successfully', attendance);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getTeamLeaveRequests(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const leaves = await managerTeamService.getTeamLeaveRequests(req.user._id.toString());
      sendSuccessResponse(res, 'Team leave requests retrieved successfully', leaves);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getTeamMemberDetails(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const member = await managerTeamService.getTeamMemberDetails(req.user._id.toString(), req.params.userId);
      sendSuccessResponse(res, 'Team member details retrieved successfully', member);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
  }
}

export const managerTeamController = new ManagerTeamController();