import { userDAL } from '../../../shared/dal/user.dal';
import { IUserCreateInput, ILoginInput, IAuthResponse } from '../../../shared/interfaces/user.interface';
import { generateAccessToken, generateRefreshToken } from '../../../shared/utils/jwt';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../../../shared/utils/email';
import crypto from 'crypto';

export class AuthService {
  /**
   * Register new user
   */
  async register(userData: IUserCreateInput): Promise<IAuthResponse> {
    const existingUser = await userDAL.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // const existingEmployeeId = await userDAL.findByEmployeeId(userData.professionalDetails.employeeId);
    // if (existingEmployeeId) {
    //   throw new Error('Employee ID already exists');
    // }

    const user = await userDAL.create(userData);

    try {
      await sendWelcomeEmail( 
    user.getFullName(),
    user.email,      
    userData.password);

    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }

    // Generate tokens
    const token = generateAccessToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role
    });

    const refreshToken = generateRefreshToken({
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
  async login(loginData: ILoginInput): Promise<IAuthResponse> {
    // Find user with password
    const user = await userDAL.findByEmail(loginData.email, true);
    
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
    await userDAL.updateLastLogin(user._id.toString());

    // Generate tokens
    const token = generateAccessToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role
    });

    const refreshToken = generateRefreshToken({
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
  async logout(userId: string): Promise<void> {
    // In a real application, you might want to:
    // - Add token to blacklist
    // - Clear session data
    // - Log the logout event
    console.log(`User ${userId} logged out`);
  }

  /**
   * Forgot password
   */
  async forgotPassword(email: string): Promise<void> {
    const user = await userDAL.findByEmail(email);
    
    if (!user) {
      // Don't reveal if user exists
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save hashed token to user
    await userDAL.update(user._id.toString(), {
      passwordResetToken: hashedToken,
      passwordResetExpires: new Date(Date.now() + 3600000) // 1 hour
    } as any);

    // Send reset email
    try {
      await sendPasswordResetEmail(user.email, resetToken);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  /**
   * Reset password
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const users = await userDAL.findAll({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() }
    } as any);

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
  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    // Verify refresh token
    const { verifyRefreshToken } = await import('../../../shared/utils/jwt');
    const decoded = verifyRefreshToken(refreshToken);

    // Find user
    const user = await userDAL.findById(decoded.id);
    if (!user || !user.isActive) {
      throw new Error('Invalid refresh token');
    }

    // Generate new tokens
    const newToken = generateAccessToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role
    });

    const newRefreshToken = generateRefreshToken({
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
  async getProfile(userId: string): Promise<any> {
    const user = await userDAL.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

export const authService = new AuthService();