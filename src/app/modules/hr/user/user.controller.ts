import { Response, NextFunction } from 'express';
import { userService } from './user.service';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
import { sendSuccessResponse, sendErrorResponse, sendPaginatedResponse } from '../../../../shared/utils/response';
import { HTTP_STATUS } from '../../../../config/constants';

// When form is sent as multipart/form-data, nested JSON fields arrive as strings — parse them back.
const JSON_FIELDS = ['education', 'experience', 'currentAddress', 'permanentAddress', 'professionalDetails', 'separationInfo', 'bankDetails', 'emergencyContact', 'documents'];
const parseJsonFields = (body: any) => {
  for (const field of JSON_FIELDS) {
    if (typeof body[field] === 'string') {
      try { body[field] = JSON.parse(body[field]); } catch { /* leave as-is if not valid JSON */ }
    }
  }
  return body;
};

export class UserController {
  /**
   * Create new user
   */
  async createUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log('[CreateEmployee][RawBody]', { body: req.body, files: req.files, file: req.file });
      const createData = parseJsonFields(req.body);
      console.log('[CreateEmployee][ParsedPayload]', { education: createData.education, experience: createData.experience });
      createData.createdBy = req.user._id.toString();
      if (!createData.organizationId && req.user?.organizationId) createData.organizationId = req.user.organizationId;
      if (req.file) {
        createData.profilePicture = `/${req.file.path.replace(/\\/g, '/')}`;
      }
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
      const createData = parseJsonFields(req.body);
      createData.createdBy = req.user._id.toString();
      if (!createData.organizationId && req.user?.organizationId) createData.organizationId = req.user.organizationId;
      if (req.file) {
        createData.profilePicture = `/${req.file.path.replace(/\\/g, '/')}`;
      }
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

      const rawExclude = (excludeRole as string | undefined) || 'SUPER_ADMIN';
      if (rawExclude) {
        const rolesToExclude = rawExclude.split(',').map(r => r.trim().toUpperCase()).filter(Boolean);
        if (rolesToExclude.length) {
          (filters as any).role = { $nin: rolesToExclude };
        }
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
   * Get all users including drafts, with status field
   */
  async getAllUsersWithDraft(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', excludeRole, ...filters } = req.query;

      const rawExclude = (excludeRole as string | undefined) || 'SUPER_ADMIN';
      if (rawExclude) {
        const rolesToExclude = rawExclude.split(',').map(r => r.trim().toUpperCase()).filter(Boolean);
        if (rolesToExclude.length) {
          (filters as any).role = { $nin: rolesToExclude };
        }
      }

      const result = await userService.getAllUsersWithDrafts(filters, {
        page: Number(page),
        limit: Number(limit),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      });

      const dataWithStatus = result.users.map((u: any) => ({
        ...u.toObject?.() ?? u,
        status: u.professionalDetails?.employmentStatus || 'ACTIVE'
      }));

      sendPaginatedResponse(
        res,
        dataWithStatus,
        result.total,
        Number(page),
        Number(limit),
        'Users (including drafts) retrieved successfully'
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
      console.log('[UpdateEmployee][RawBody]', { params: req.params, body: req.body, files: req.files, file: req.file });
      const updateData = parseJsonFields(req.body);
      console.log('[UpdateEmployee][ParsedPayload]', { education: updateData.education, experience: updateData.experience });
      updateData.updatedBy = req.user._id.toString();
      if (!updateData.organizationId && req.user?.organizationId) updateData.organizationId = req.user.organizationId;
      if (req.file) {
        updateData.profilePicture = `/${req.file.path.replace(/\\/g, '/')}`;
      }
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

      const imageUrl = `/${req.file.path.replace(/\\/g, '/')}`;

      sendSuccessResponse(res, 'Avatar uploaded successfully', {
        imageUrl,
        path: req.file.path.replace(/\\/g, '/')
      });
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  /**
   * Register Firebase Cloud Messaging Notification Device Token
   */
  async addDeviceToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;
      if (!token) {
        throw new Error('FCM push token is required');
      }

      const userId = req.user._id.toString();
      await userService.addFcmToken(userId, token);

      sendSuccessResponse(res, 'Device push notification token registered successfully');
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }
}

export const userController = new UserController();