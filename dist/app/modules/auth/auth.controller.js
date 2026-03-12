"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const response_1 = require("../../../shared/utils/response");
const constants_1 = require("../../../config/constants");
class AuthController {
    /**
     * Register new user
     */
    async register(req, res, next) {
        try {
            const result = await auth_service_1.authService.register(req.body);
            (0, response_1.sendSuccessResponse)(res, 'User registered successfully', result, constants_1.HTTP_STATUS.CREATED);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
    /**
     * Login user
     */
    async login(req, res, next) {
        try {
            const result = await auth_service_1.authService.login(req.body);
            (0, response_1.sendSuccessResponse)(res, 'Login successful', result);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.UNAUTHORIZED);
        }
    }
    /**
     * Logout user
     */
    async logout(req, res, next) {
        try {
            await auth_service_1.authService.logout(req.user._id.toString());
            (0, response_1.sendSuccessResponse)(res, 'Logout successful');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    /**
     * Forgot password
     */
    async forgotPassword(req, res, next) {
        try {
            await auth_service_1.authService.forgotPassword(req.body.email);
            (0, response_1.sendSuccessResponse)(res, 'Password reset email sent');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    /**
     * Reset password
     */
    async resetPassword(req, res, next) {
        try {
            await auth_service_1.authService.resetPassword(req.body.token, req.body.password);
            (0, response_1.sendSuccessResponse)(res, 'Password reset successful');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
    /**
     * Refresh token
     */
    async refreshToken(req, res, next) {
        try {
            const result = await auth_service_1.authService.refreshToken(req.body.refreshToken);
            (0, response_1.sendSuccessResponse)(res, 'Token refreshed successfully', result);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.UNAUTHORIZED);
        }
    }
    /**
     * Get current user profile
     */
    async getProfile(req, res, next) {
        try {
            const user = await auth_service_1.authService.getProfile(req.user._id.toString());
            (0, response_1.sendSuccessResponse)(res, 'Profile retrieved successfully', user);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.NOT_FOUND);
        }
    }
    /**
     * Update FCM Token
     */
    async updateFcmToken(req, res, next) {
        try {
            const { fcmToken } = req.body;
            if (!fcmToken) {
                throw new Error('FCM Token is required');
            }
            await auth_service_1.authService.updateFcmToken(req.user._id.toString(), fcmToken);
            (0, response_1.sendSuccessResponse)(res, 'FCM Token updated successfully');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map