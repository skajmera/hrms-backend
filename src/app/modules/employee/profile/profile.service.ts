import { userDAL } from '../../../../shared/dal/user.dal';
import { IUserUpdateInput } from '../../../../shared/interfaces/user.interface';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';

export class EmployeeProfileService {
  /**
   * Get own profile
   */
  async getMyProfile(userId: string) {
    const user = await userDAL.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Update own profile
   */
  async updateMyProfile(userId: string, updateData: IUserUpdateInput) {
    // Employees can only update certain fields
    const allowedFields = [
      'phone',
      'alternatePhone',
      'profilePicture',
      'currentAddress',
      'permanentAddress',
      'education',
      'experience',
      'emergencyContact'
    ];

    const sanitizedData: any = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        sanitizedData[key] = (updateData as any)[key];
      }
    });

    const user = await userDAL.update(userId, sanitizedData);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Change password
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await userDAL.findById(userId, true);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();
  }

    /**
     * Get all users
     */
    async getAllUsers(filters: any = {}, options: IPaginationOptions) {
      return await userDAL.findAll(filters, options);
    }
  
}

export const employeeProfileService = new EmployeeProfileService();