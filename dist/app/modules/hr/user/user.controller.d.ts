import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
export declare class UserController {
    /**
     * Create new user
     */
    createUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
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
}
export declare const userController: UserController;
//# sourceMappingURL=user.controller.d.ts.map