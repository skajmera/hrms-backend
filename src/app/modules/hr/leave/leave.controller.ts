import { Response, NextFunction } from 'express';
import { leaveService } from './leave.service';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
import { sendSuccessResponse, sendErrorResponse, sendPaginatedResponse } from '../../../../shared/utils/response';
import { HTTP_STATUS } from '../../../../config/constants';

export class LeaveController {
  async applyLeave(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const leave = await leaveService.applyLeave(req.body);
      sendSuccessResponse(res, 'Leave applied successfully', leave, HTTP_STATUS.CREATED);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  async getLeaveById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const leave = await leaveService.getLeaveById(req.params.id);
      sendSuccessResponse(res, 'Leave retrieved successfully', leave);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
  }

  async getAllLeaves(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 10, sortBy = 'appliedDate', sortOrder = 'desc', ...query } = req.query as any;

      const result = await leaveService.getAllLeaves(query, {
        page: Number(page),
        limit: Number(limit),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      });

      sendPaginatedResponse(res, result.leaves, result.total, Number(page), Number(limit), 'Leaves retrieved successfully');
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async approveLeave(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user._id) {
        throw new Error('Authentication failed: User information missing from request');
      }

      const leave = await leaveService.approveLeave(req.params.id, req.user._id.toString());
      sendSuccessResponse(res, 'Leave approved successfully', leave);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  async rejectLeave(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const leave = await leaveService.rejectLeave(req.params.id, req.user._id.toString(), req.body.rejectionReason);
      sendSuccessResponse(res, 'Leave rejected successfully', leave);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  async getPendingLeaves(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const leaves = await leaveService.getPendingLeaves();
      sendSuccessResponse(res, 'Pending leaves retrieved successfully', leaves);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getEmployeesOnLeaveToday(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const employees = await leaveService.getEmployeesOnLeaveToday();
      sendSuccessResponse(res, 'Employees on leave today retrieved successfully', employees);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getLeaveBalance(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, year } = req.params;
      const balanceYear = year ? Number(year) : new Date().getFullYear();
      const balance = await leaveService.getLeaveBalance(userId, balanceYear);
      sendSuccessResponse(res, 'Leave balance retrieved successfully', balance);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getEmployeeLeaves(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10, sortBy = 'appliedDate', sortOrder = 'desc', ...filters } = req.query;

      const result = await leaveService.getAllLeaves({ ...filters, userId }, {
        page: Number(page),
        limit: Number(limit),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      });

      sendPaginatedResponse(res, result.leaves, result.total, Number(page), Number(limit), 'Employee leaves retrieved successfully');
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }
}

export const leaveController = new LeaveController();