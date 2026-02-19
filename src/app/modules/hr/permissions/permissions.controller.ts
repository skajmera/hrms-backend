import { Request, Response, NextFunction } from 'express';
import { permissionsService } from './permissions.service';
import { sendSuccessResponse } from '../../../../shared/utils/response';
import { HTTP_STATUS } from '../../../../config/constants';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';

/**
 * Permissions Controller
 * Handles HTTP requests for user permissions
 */

export class PermissionsController {
  /**
   * Invite user with permissions
   * POST /api/v1/hr/permissions/invite
   */
  static async inviteUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const inviteData = req.body;
      const invitedBy = req.user?._id;

      const permission = await permissionsService.inviteUser(inviteData, invitedBy);

      sendSuccessResponse(res, 
       'User invited successfully with permissions',
       permission)
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all user permissions
   * GET /api/v1/hr/permissions
   */
  static async getAllPermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { role, status, page, limit, sortBy, sortOrder, search } = req.query;

      const filters: any = {};
      if (role) filters.role = role;
      if (status) filters.status = status;

      const options = {
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 10,
        sortBy: (sortBy as string) || 'createdAt',
        sortOrder: (sortOrder as 'asc' | 'desc') || 'desc'
      };

      const result = await permissionsService.getAllPermissions(filters, options);
      sendSuccessResponse(res, 'User permissions retrieved successfully', result);
     
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get permission by user ID
   * GET /api/v1/hr/permissions/:userId
   */
  static async getPermissionByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const permission = await permissionsService.getPermissionByUserId(userId);

      sendSuccessResponse(res, 
        'User permissions retrieved successfully',
         permission
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user permissions
   * PUT /api/v1/hr/permissions/:userId
   */
  static async updatePermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const updateData = req.body;

      const permission = await permissionsService.updatePermissions(userId, updateData);

      sendSuccessResponse(res,
        'User permissions updated successfully',
         permission
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user permissions
   * DELETE /api/v1/hr/permissions/:userId
   */
  static async deletePermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      await permissionsService.deletePermissions(userId);

      sendSuccessResponse(res, 'User permissions deleted successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Check user permission
   * POST /api/v1/hr/permissions/check
   */
  static async checkPermission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, module, action } = req.body;
      const hasPermission = await permissionsService.checkPermission(userId, module, action);

      sendSuccessResponse(res,'Permission check completed',
         { hasPermission }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deactivate user
   * POST /api/v1/hr/permissions/:userId/deactivate
   */
  static async deactivateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const permission = await permissionsService.deactivateUser(userId);

      sendSuccessResponse(res,  'User deactivated successfully',
   permission
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Activate user
   * POST /api/v1/hr/permissions/:userId/activate
   */
  static async activateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const permission = await permissionsService.activateUser(userId);

      sendSuccessResponse(res, 'User activated successfully',
       permission
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get active users
   * GET /api/v1/hr/permissions/active
   */
  static async getActiveUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await permissionsService.getActiveUsers();

      sendSuccessResponse(res,'Active users retrieved successfully',
      users
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get default permissions by role
   * GET /api/v1/hr/permissions/defaults/:role
   */
  static async getDefaultPermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { role } = req.params;
      const permissions = permissionsService.getDefaultPermissionsByRole(role);

      sendSuccessResponse(res, 'Default permissions retrieved successfully',
        permissions
      );
    } catch (error) {
      next(error);
    }
  }
}