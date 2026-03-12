import { Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { AuthRequest } from '../../../shared/middlewares/auth.middleware';
import { sendSuccessResponse, sendErrorResponse } from '../../../shared/utils/response';
import { HTTP_STATUS } from '../../../config/constants';

export class AuthController {
  /**
   * Register new user
   */
  async register(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(req.body);

      sendSuccessResponse(
        res,
        'User registered successfully',
        result,
        HTTP_STATUS.CREATED
      );
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  /**
   * Login user
   */
  async login(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);

      sendSuccessResponse(res, 'Login successful', result);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.UNAUTHORIZED);
    }
  }

  /**
   * Logout user
   */
  async logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await authService.logout(req.user._id.toString());

      sendSuccessResponse(res, 'Logout successful');
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  /**
   * Forgot password
   */
  async forgotPassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await authService.forgotPassword(req.body.email);

      sendSuccessResponse(res, 'Password reset email sent');
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  /**
   * Reset password
   */
  async resetPassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await authService.resetPassword(req.body.token, req.body.password);

      sendSuccessResponse(res, 'Password reset successful');
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  /**
   * Refresh token
   */
  async refreshToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.refreshToken(req.body.refreshToken);

      sendSuccessResponse(res, 'Token refreshed successfully', result);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.UNAUTHORIZED);
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.getProfile(req.user._id.toString());

      sendSuccessResponse(res, 'Profile retrieved successfully', user);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
  }

  /**
   * Update FCM Token
   */
  async updateFcmToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { fcmToken } = req.body;
      if (!fcmToken) {
        throw new Error('FCM Token is required');
      }

      await authService.updateFcmToken(req.user._id.toString(), fcmToken);

      sendSuccessResponse(res, 'FCM Token updated successfully');
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }
}

export const authController = new AuthController();