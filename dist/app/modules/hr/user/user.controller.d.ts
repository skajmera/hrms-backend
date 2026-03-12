import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
export declare class UserController {
    /**
     * Create new user
     */
    createUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Create draft user
     */
    createDraftEmployee(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get all draft employees
     */
    getDraftEmployees(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get user by ID
     */
    getUserById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get all users
     */
    getAllUsers(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update user
     */
    updateUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Delete user
     */
    deleteUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Delete draft employee
     */
    deleteDraftEmployee(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get users by department
     */
    getUsersByDepartment(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Search users
     */
    searchUsers(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get user statistics
     */
    getUserStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get user by employee ID
     */
    getUserByEmployeeId(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Clear user registered device
     */
    clearUserDevice(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Upload user profile picture
     */
    uploadAvatar(req: any, res: Response, next: NextFunction): Promise<void>;
    /**
     * Register Firebase Cloud Messaging Notification Device Token
     */
    addDeviceToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const userController: UserController;
//# sourceMappingURL=user.controller.d.ts.map