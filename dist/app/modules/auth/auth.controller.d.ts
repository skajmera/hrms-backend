import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../shared/middlewares/auth.middleware';
export declare class AuthController {
    /**
     * Register new user
     */
    register(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Login user
     */
    login(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Logout user
     */
    logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Forgot password
     */
    forgotPassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Reset password
     */
    resetPassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Refresh token
     */
    refreshToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get current user profile
     */
    getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const authController: AuthController;
//# sourceMappingURL=auth.controller.d.ts.map