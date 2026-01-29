import { Response, NextFunction } from 'express';
import { managerLeaveService } from './leave.service';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
import { sendSuccessResponse, sendErrorResponse } from '../../../../shared/utils/response';
import { HTTP_STATUS } from '../../../../config/constants';

export class ManagerLeaveController {
  async approveLeave(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const leave = await managerLeaveService.approveTeamLeave(req.user._id.toString(), req.params.id);
      sendSuccessResponse(res, 'Leave approved successfully', leave);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  async rejectLeave(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { rejectionReason } = req.body;
      const leave = await managerLeaveService.rejectTeamLeave(req.user._id.toString(), req.params.id, rejectionReason);
      sendSuccessResponse(res, 'Leave rejected successfully', leave);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }
}

export const managerLeaveController = new ManagerLeaveController();