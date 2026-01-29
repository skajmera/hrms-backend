import { Response, NextFunction } from 'express';
import { userService } from './user.service';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
import { sendSuccessResponse, sendErrorResponse, sendPaginatedResponse } from '../../../../shared/utils/response';
import { HTTP_STATUS } from '../../../../config/constants';

export class UserController {
  /**
   * Create new user
   */
  async createUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.createUser(req.body);
      sendSuccessResponse(res, 'User created successfully', user, HTTP_STATUS.CREATED);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.getUserById(req.params.id);
      sendSuccessResponse(res, 'User retrieved successfully', user);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
  }

  /**
   * Get all users
   */
  async getAllUsers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = req.query;
      
      const result = await userService.getAllUsers(filters, {
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

  /**
   * Update user
   */
  async updateUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      sendSuccessResponse(res, 'User updated successfully', user);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  /**
   * Delete user
   */
  async deleteUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await userService.deleteUser(req.params.id);
      sendSuccessResponse(res, 'User deleted successfully');
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
  }

  /**
   * Get users by department
   */
  async getUsersByDepartment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await userService.getUsersByDepartment(req.params.departmentId);
      sendSuccessResponse(res, 'Users retrieved successfully', users);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  /**
   * Search users
   */
  async searchUsers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { q } = req.query;
      const users = await userService.searchUsers(q as string);
      sendSuccessResponse(res, 'Search results retrieved successfully', users);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await userService.getUserStats();
      sendSuccessResponse(res, 'Statistics retrieved successfully', stats);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }
}

export const userController = new UserController();