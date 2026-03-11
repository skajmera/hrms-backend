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
      const createData = req.body;
      console.log("req.body : ", req.body)
      const userId = req.user._id.toString();
      createData.createdBy = userId;
      const user = await userService.createUser(createData);
      sendSuccessResponse(res, 'User created successfully', user, HTTP_STATUS.CREATED);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  /**
   * Create draft user
   */
  async createDraftEmployee(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const createData = req.body;
      const userId = req.user._id.toString();
      createData.createdBy = userId;
      const user = await userService.createDraftEmployee(createData);
      sendSuccessResponse(res, 'Draft user created successfully', user, HTTP_STATUS.CREATED);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  /**
   * Get all draft employees
   */
  async getDraftEmployees(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, sortBy, sortOrder } = req.query;
      const options = {
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 10,
        sortBy: (sortBy as string) || 'createdAt',
        sortOrder: (sortOrder as 'asc' | 'desc') || 'desc'
      };

      const { users, total } = await userService.getDraftEmployees(options);
      sendPaginatedResponse(res, users, total, options.page, options.limit, 'Draft employees retrieved successfully');
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
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', excludeRole, ...filters } = req.query;

      // Support excludeRole=EMPLOYEE or comma-separated excludeRole=EMPLOYEE,MANAGER
      if (excludeRole) {
        const rolesToExclude = (excludeRole as string).split(',').map(r => r.trim().toUpperCase());
        (filters as any).role = { $nin: rolesToExclude };
      }

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
      const updateData = req.body;
      const userId = req.user._id.toString();
      updateData.updatedBy = userId;
      const user = await userService.updateUser(req.params.id, updateData);
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
   * Delete draft employee
   */
  async deleteDraftEmployee(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await userService.deleteDraftEmployee(req.params.id);
      sendSuccessResponse(res, 'Draft employee deleted successfully');
    } catch (error: any) {
      sendErrorResponse(res, error.message, error.message === 'User not found' ? HTTP_STATUS.NOT_FOUND : HTTP_STATUS.BAD_REQUEST);
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

  /**
   * Get user by employee ID
   */
  async getUserByEmployeeId(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.getUserByEmployeeId(req.params.employeeId);
      sendSuccessResponse(res, 'User retrieved successfully', user);
    } catch (error: any) {
      sendErrorResponse(res, error.message, error.message === 'User not found' ? HTTP_STATUS.NOT_FOUND : HTTP_STATUS.BAD_REQUEST);
    }
  }

  /**
   * Clear user registered device
   */
  async clearUserDevice(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await userService.clearUserDevice(req.params.id);
      sendSuccessResponse(res, 'Device cleared successfully');
    } catch (error: any) {
      sendErrorResponse(res, error.message, error.message === 'User not found' ? HTTP_STATUS.NOT_FOUND : HTTP_STATUS.BAD_REQUEST);
    }
  }

  /**
   * Upload user profile picture
   */
  async uploadAvatar(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw new Error('No file uploaded');
      }

      const imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;

      sendSuccessResponse(res, 'Avatar uploaded successfully', {
        imageUrl,
        path: req.file.path.replace(/\\/g, '/')
      });
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }
}

export const userController = new UserController();