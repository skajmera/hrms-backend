"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const user_dal_1 = require("../../../shared/dal/user.dal");
const jwt_1 = require("../../../shared/utils/jwt");
const email_1 = require("../../../shared/utils/email");
const crypto_1 = __importDefault(require("crypto"));
const leave_dal_1 = require("../../../shared/dal/leave.dal");
class AuthService {
    /**
     * Register new user
     */
    async register(userData) {
        const existingUser = await user_dal_1.userDAL.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        // const existingEmployeeId = await userDAL.findByEmployeeId(userData.professionalDetails.employeeId);
        // if (existingEmployeeId) {
        //   throw new Error('Employee ID already exists');
        // }
        const user = await user_dal_1.userDAL.create(userData);
        // ✅ CREATE INITIAL LEAVE BALANCE
        const currentYear = new Date().getFullYear();
        await leave_dal_1.leaveDAL.upsertLeaveBalance(user._id.toString(), currentYear, {
            userId: user._id.toString(),
            year: currentYear,
            casualLeave: { total: 12, used: 0, remaining: 12 },
            sickLeave: { total: 10, used: 0, remaining: 10 },
            earnedLeave: { total: 15, used: 0, remaining: 15 },
            maternityLeave: { total: 180, used: 0, remaining: 180 },
            paternityLeave: { total: 15, used: 0, remaining: 15 }
        });
        console.log(`✅ Leave balance created for user: ${user._id}`);
        try {
            await (0, email_1.sendWelcomeEmail)(user.getFullName(), user.email, userData.password);
        }
        catch (error) {
            console.error('Failed to send welcome email:', error);
        }
        // Generate tokens
        const token = (0, jwt_1.generateAccessToken)({
            id: user._id.toString(),
            email: user.email,
            role: user.role
        });
        const refreshToken = (0, jwt_1.generateRefreshToken)({
            id: user._id.toString(),
            email: user.email,
            role: user.role
        });
        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;
        return {
            user: userResponse,
            token,
            refreshToken
        };
    }
    /**
     * Login user
     */
    async login(loginData) {
        // Find user with password
        const user = await user_dal_1.userDAL.findByEmail(loginData.email, true);
        if (!user) {
            throw new Error('Invalid email or password');
        }
        // Check if user is active
        if (!user.isActive) {
            throw new Error('Your account has been deactivated');
        }
        // Compare password
        const isPasswordValid = await user.comparePassword(loginData.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        // Update last login
        await user_dal_1.userDAL.updateLastLogin(user._id.toString());
        // Generate tokens
        const token = (0, jwt_1.generateAccessToken)({
            id: user._id.toString(),
            email: user.email,
            role: user.role
        });
        const refreshToken = (0, jwt_1.generateRefreshToken)({
            id: user._id.toString(),
            email: user.email,
            role: user.role
        });
        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;
        return {
            user: userResponse,
            token,
            refreshToken
        };
    }
    /**
     * Logout user
     */
    async logout(userId) {
        // In a real application, you might want to:
        // - Add token to blacklist
        // - Clear session data
        // - Log the logout event
        console.log(`User ${userId} logged out`);
    }
    /**
     * Forgot password
     */
    async forgotPassword(email) {
        const user = await user_dal_1.userDAL.findByEmail(email);
        if (!user) {
            // Don't reveal if user exists
            return;
        }
        // Generate reset token
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const hashedToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
        // Save hashed token to user
        await user_dal_1.userDAL.update(user._id.toString(), {
            passwordResetToken: hashedToken,
            passwordResetExpires: new Date(Date.now() + 3600000) // 1 hour
        });
        // Send reset email
        try {
            await (0, email_1.sendPasswordResetEmail)(user.email, resetToken);
        }
        catch (error) {
            console.error('Failed to send password reset email:', error);
            throw new Error('Failed to send password reset email');
        }
    }
    /**
     * Reset password
     */
    async resetPassword(token, newPassword) {
        const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
        // Find user with valid reset token
        const users = await user_dal_1.userDAL.findAll({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: new Date() }
        });
        if (!users.users || users.users.length === 0) {
            throw new Error('Invalid or expired reset token');
        }
        const user = users.users[0];
        // Update password
        user.password = newPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
    }
    /**
     * Refresh token
     */
    async refreshToken(refreshToken) {
        // Verify refresh token
        const { verifyRefreshToken } = await Promise.resolve().then(() => __importStar(require('../../../shared/utils/jwt')));
        const decoded = verifyRefreshToken(refreshToken);
        // Find user
        const user = await user_dal_1.userDAL.findById(decoded.id);
        if (!user || !user.isActive) {
            throw new Error('Invalid refresh token');
        }
        // Generate new tokens
        const newToken = (0, jwt_1.generateAccessToken)({
            id: user._id.toString(),
            email: user.email,
            role: user.role
        });
        const newRefreshToken = (0, jwt_1.generateRefreshToken)({
            id: user._id.toString(),
            email: user.email,
            role: user.role
        });
        return {
            token: newToken,
            refreshToken: newRefreshToken
        };
    }
    /**
     * Get current user profile
     */
    async getProfile(userId) {
        const user = await user_dal_1.userDAL.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    /**
     * Update FCM Token for push notifications
     */
    async updateFcmToken(userId, fcmToken) {
        const user = await user_dal_1.userDAL.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        // Add token if it doesn't exist
        if (!user.fcmTokens) {
            user.fcmTokens = [];
        }
        if (!user.fcmTokens.includes(fcmToken)) {
            user.fcmTokens.push(fcmToken);
            await user.save({ validateBeforeSave: false });
        }
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map