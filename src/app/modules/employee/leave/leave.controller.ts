import { Response, NextFunction } from 'express';
import { employeeLeaveService } from './leave.service';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
import { sendSuccessResponse, sendErrorResponse } from '../../../../shared/utils/response';
import { HTTP_STATUS } from '../../../../config/constants';

export class EmployeeLeaveController {
  async applyLeave(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const leave = await employeeLeaveService.applyLeave(req.user._id.toString(), req.body);
      sendSuccessResponse(res, 'Leave applied successfully', leave, HTTP_STATUS.CREATED);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  async getMyLeaves(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const leaves = await employeeLeaveService.getMyLeaves(req.user._id.toString());
      sendSuccessResponse(res, 'Leaves retrieved successfully', leaves);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getMyLeaveBalance(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { year } = req.params;
      const balance = await employeeLeaveService.getMyLeaveBalance(req.user._id.toString(), Number(year));
      sendSuccessResponse(res, 'Leave balance retrieved successfully', balance);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async cancelLeave(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const leave = await employeeLeaveService.cancelLeave(req.user._id.toString(), req.params.id);
      sendSuccessResponse(res, 'Leave cancelled successfully', leave);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }
}

export const employeeLeaveController = new EmployeeLeaveController();