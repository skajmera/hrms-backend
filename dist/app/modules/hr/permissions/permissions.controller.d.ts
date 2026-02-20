import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
/**
 * Permissions Controller
 * Handles HTTP requests for user permissions
 */
export declare class PermissionsController {
    /**
     * Invite user with permissions
     * POST /api/v1/hr/permissions/invite
     */
    static inviteUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get all user permissions
     * GET /api/v1/hr/permissions
     */
    static getAllPermissions(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get permission by user ID
     * GET /api/v1/hr/permissions/:userId
     */
    static getPermissionByUserId(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update user permissions
     * PUT /api/v1/hr/permissions/:userId
     */
    static updatePermissions(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Delete user permissions
     * DELETE /api/v1/hr/permissions/:userId
     */
    static deletePermissions(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Check user permission
     * POST /api/v1/hr/permissions/check
     */
    static checkPermission(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Deactivate user
     * POST /api/v1/hr/permissions/:userId/deactivate
     */
    static deactivateUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Activate user
     * POST /api/v1/hr/permissions/:userId/activate
     */
    static activateUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get active users
     * GET /api/v1/hr/permissions/active
     */
    static getActiveUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get default permissions by role
     * GET /api/v1/hr/permissions/defaults/:role
     */
    static getDefaultPermissions(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=permissions.controller.d.ts.map