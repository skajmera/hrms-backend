import { IUserCreateInput, ILoginInput, IAuthResponse } from '../../../shared/interfaces/user.interface';
export declare class AuthService {
    /**
     * Register new user
     */
    register(userData: IUserCreateInput): Promise<IAuthResponse>;
    /**
     * Login user
     */
    login(loginData: ILoginInput): Promise<IAuthResponse>;
    /**
     * Logout user
     */
    logout(userId: string): Promise<void>;
    /**
     * Forgot password
     */
    forgotPassword(email: string): Promise<void>;
    /**
     * Reset password
     */
    resetPassword(token: string, newPassword: string): Promise<void>;
    /**
     * Refresh token
     */
    refreshToken(refreshToken: string): Promise<{
        token: string;
        refreshToken: string;
    }>;
    /**
     * Get current user profile
     */
    getProfile(userId: string): Promise<any>;
    /**
     * Update FCM Token for push notifications
     */
    updateFcmToken(userId: string, fcmToken: string): Promise<void>;
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.service.d.ts.map