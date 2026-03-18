import { userDAL } from '../../../../shared/dal/user.dal';
import { IUserCreateInput, IUserUpdateInput } from '../../../../shared/interfaces/user.interface';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';
import { leaveDAL } from '../../../../shared/dal/leave.dal';
import { sendWelcomeEmail } from '../../../../shared/utils/email';

export class UserService {
  /**
   * Create new user
   */
  async createUser(userData: any) {
    // Clean empty strings for unique fields to avoid duplicate-key errors
    const uniqueFields = ['email', 'personalEmail', 'adhaarNumber', 'panNumber'];
    uniqueFields.forEach(field => {
      if (userData[field] === '') {
        delete userData[field];
      }
    });

    let draftUser = (userData._id || userData.id) ? await userDAL.findById(userData._id || userData.id) : null;

    if (draftUser && draftUser.professionalDetails?.employmentStatus !== 'DRAFT') {
      throw new Error('User already exists and is not a draft');
    }

    const checkExisting = async (value: string | undefined, finder: (val: string) => Promise<any>, errorMsg: string) => {
      if (!value) return;
      const existing = await finder(value);
      if (existing) {
        if (draftUser && draftUser._id.toString() !== existing._id.toString()) throw new Error(errorMsg);
        if (!draftUser) {
          if (existing.professionalDetails?.employmentStatus === 'DRAFT') draftUser = existing;
          else throw new Error(errorMsg);
        }
      }
    };

    await checkExisting(userData.email, (v) => userDAL.findByEmail(v), 'User with this email already exists');
    if (userData.professionalDetails?.employeeId) {
      await checkExisting(userData.professionalDetails.employeeId, (v) => userDAL.findByEmployeeId(v), 'Employee ID already exists');
    }

    let generatedPassword = '';
    if (!userData?.password && (!draftUser || !draftUser.password)) {
      generatedPassword = Math.random().toString(36).slice(-8) + 'A1@'; // Generate a random 8-character password with complexity
      userData.password = generatedPassword;
      console.log(`Generated password for new user: ${userData.password}`);
    }

    if (!userData.professionalDetails) userData.professionalDetails = {};
    if (userData.professionalDetails.employmentStatus === 'DRAFT' || !draftUser) {
      userData.professionalDetails.employmentStatus = 'ACTIVE';
    }

    userData.role = userData.role || 'EMPLOYEE';

    let user;
    if (draftUser) {
      const { _id, id, ...updateData } = userData;
      user = await userDAL.update(draftUser._id.toString(), updateData);
    } else {
      user = await userDAL.create(userData);
    }

    if (!user) throw new Error('Failed to create or update user');

    // Send welcome email asynchronously so it doesn't block the response
    if (user.email && (generatedPassword || userData.password)) {
      sendWelcomeEmail(user.firstName, user.email, generatedPassword || userData.password).catch(err => {
        console.error('Failed to send welcome email:', err);
      });
    }

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
   * Create draft user
   */
  async createDraftEmployee(userData: any) {
    // Prevent MongoDB unique sparse index duplicate key errors for empty string inputs
    const uniqueFields = ['email', 'personalEmail', 'adhaarNumber', 'panNumber'];
    uniqueFields.forEach(field => {
      if (userData[field] === '') {
        delete userData[field];
      }
    });

    if (userData.professionalDetails && userData.professionalDetails.employeeId === '') {
      delete userData.professionalDetails.employeeId;
    }

    let draftUser = (userData._id || userData.id) ? await userDAL.findById(userData._id || userData.id) : null;

    if (draftUser && draftUser.professionalDetails?.employmentStatus !== 'DRAFT') {
      throw new Error('Cannot update a non-draft employee through this endpoint');
    }

    const checkExisting = async (value: string | undefined, finder: (val: string) => Promise<any>, errorMsg: string) => {
      if (!value) return;
      const existing = await finder(value);
      if (existing) {
        if (draftUser && draftUser._id.toString() !== existing._id.toString()) throw new Error(errorMsg);
        if (!draftUser) {
          if (existing.professionalDetails?.employmentStatus === 'DRAFT') draftUser = existing;
          else throw new Error(errorMsg);
        }
      }
    };

    await checkExisting(userData.email, (v) => userDAL.findByEmail(v), 'User with this email already exists');
    await checkExisting(userData.professionalDetails?.employeeId, (v) => userDAL.findByEmployeeId(v), 'Employee ID already exists');

    // Set draft status
    if (!userData.professionalDetails) {
      userData.professionalDetails = {};
    }
    userData.professionalDetails.employmentStatus = 'DRAFT';

    // Always set role to EMPLOYEE for drafts if not provided
    if (!userData.role) {
      userData.role = 'EMPLOYEE';
    }

    if (draftUser) {
      const { _id, id, ...updateData } = userData;
      return await userDAL.update(draftUser._id.toString(), updateData);
    }

    return await userDAL.create(userData);
  }

  /**
   * Get all draft employees
   */
  async getDraftEmployees(options: IPaginationOptions) {
    const filters = {
      'professionalDetails.employmentStatus': 'DRAFT'
    };
    return await userDAL.findAll(filters, options);
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
   * Get all users including drafts
   */
  async getAllUsersWithDrafts(filters: any = {}, options: IPaginationOptions) {
    return await userDAL.findAllWithDrafts(filters, options);
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
   * Delete draft employee
   */
  async deleteDraftEmployee(id: string) {
    const user = await userDAL.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.professionalDetails?.employmentStatus !== 'DRAFT') {
      throw new Error('Only draft employees can be deleted using this endpoint');
    }

    return await userDAL.hardDelete(id);
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

  /**
   * Get user by employee ID
   */
  async getUserByEmployeeId(employeeId: string) {
    const user = await userDAL.findByEmployeeId(employeeId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Clear registered device ID for a user
   */
  async clearUserDevice(id: string) {
    const user = await userDAL.findById(id);
    if (!user) { throw new Error('User not found'); }
    return await userDAL.update(id, { $unset: { registeredDeviceId: "" } });
  }

  /**
   * Upload user avatar using base64 or file path
   */
  async uploadAvatar(userId: string, imageUrl: string) {
    return await userDAL.update(userId, { profilePicture: imageUrl });
  }

  /**
   * Add FCM Device Token for Push Notifications
   */
  async addFcmToken(userId: string, token: string) {
    const user = await userDAL.update(userId, { $addToSet: { fcmTokens: token } });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

export const userService = new UserService();