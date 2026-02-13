import { userDAL } from '../../../../shared/dal/user.dal';
import { IUserCreateInput, IUserUpdateInput } from '../../../../shared/interfaces/user.interface';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';
import { leaveDAL } from '../../../../shared/dal/leave.dal';

export class UserService {
  /**
   * Create new user
   */
  async createUser(userData: IUserCreateInput) {
    // Check if email exists
    const existingUser = await userDAL.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Check if employee ID exists
    const existingEmployeeId = await userDAL.findByEmployeeId(userData.professionalDetails.employeeId);
    if (existingEmployeeId) {
      throw new Error('Employee ID already exists');
    }
  const user = await userDAL.create(userData);
 // ✅ CREATE INITIAL LEAVE BALANCE
 const currentYear = new Date().getFullYear();
 await leaveDAL.upsertLeaveBalance(user._id.toString(), currentYear, {
   userId: user._id.toString(),
   year: currentYear,
   casualLeave: { total: 12, used: 0, remaining: 12 },
   sickLeave: { total: 10, used: 0, remaining: 10 },
   earnedLeave: { total: 15, used: 0, remaining: 15 },
   maternityLeave: { total: 180, used: 0, remaining: 180 },
   paternityLeave: { total: 15, used: 0, remaining: 15 }
 } as any);

    return user;
    
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string) {
    const user = await userDAL.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Get all users
   */
  async getAllUsers(filters: any = {}, options: IPaginationOptions) {
    return await userDAL.findAll(filters, options);
  }

  /**
   * Update user
   */
  async updateUser(id: string, updateData: IUserUpdateInput) {
    const user = await userDAL.update(id, updateData);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Delete user (soft delete)
   */
  async deleteUser(id: string) {
    const user = await userDAL.delete(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Get users by department
   */
  async getUsersByDepartment(departmentId: string) {
    return await userDAL.findByDepartment(departmentId);
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: string) {
    return await userDAL.findByRole(role);
  }

  /**
   * Search users
   */
  async searchUsers(searchTerm: string) {
    return await userDAL.search(searchTerm);
  }

  /**
   * Get user statistics
   */
  async getUserStats() {
    return await userDAL.getUserStats();
  }
}

export const userService = new UserService();