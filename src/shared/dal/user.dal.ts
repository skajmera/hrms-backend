import { UserModel } from '../models/user.model';
import { IUser, IUserCreateInput, IUserUpdateInput } from '../interfaces/user.interface';
import { IQueryFilters, IPaginationOptions } from '../interfaces/common.interface';

export class UserDAL {
  /**
   * Create a new user
   */
  async create(userData: IUserCreateInput): Promise<IUser> {
    const user = await UserModel.create(userData);
    return user;
  }

  /**
   * Find user by ID
   */
  async findById(id: string, selectPassword = false): Promise<IUser | null> {
    const query = UserModel.findById(id)
      .populate('professionalDetails.department', 'name code')
      .populate('professionalDetails.reportingManager', 'firstName lastName email');
    
    if (selectPassword) {
      query.select('+password');
    }
    
    return await query.exec();
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string, selectPassword = false): Promise<IUser | null> {
    const query = UserModel.findOne({ email });
    
    if (selectPassword) {
      query.select('+password');
    }
    
    return await query.exec();
  }

  /**
   * Find user by employee ID
   */
  async findByEmployeeId(employeeId: string): Promise<IUser | null> {
    return await UserModel.findOne({ 'professionalDetails.employeeId': employeeId })
      .populate('professionalDetails.department', 'name code')
      .populate('professionalDetails.reportingManager', 'firstName lastName email');
  }

  /**
   * Find all users with filters and pagination
   */
  async findAll(
    filters: IQueryFilters = {},
    options: IPaginationOptions = {}
  ): Promise<{ users: IUser[]; total: number }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;

    const query: any = { ...filters };

    const users = await UserModel.find(query)
      .populate('professionalDetails.department', 'name code')
      .populate('professionalDetails.reportingManager', 'firstName lastName email')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    const total = await UserModel.countDocuments(query);

    return { users, total };
  }

  /**
   * Update user by ID
   */
  async update(id: string, updateData: IUserUpdateInput): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('professionalDetails.department', 'name code')
      .populate('professionalDetails.reportingManager', 'firstName lastName email');
  }

  /**
   * Delete user by ID (soft delete)
   */
  async delete(id: string): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    );
  }

  /**
   * Hard delete user by ID
   */
  async hardDelete(id: string): Promise<IUser | null> {
    return await UserModel.findByIdAndDelete(id);
  }

  /**
   * Find users by department
   */
  async findByDepartment(departmentId: string): Promise<IUser[]> {
    return await UserModel.find({ 'professionalDetails.department': departmentId, isActive: true })
      .populate('professionalDetails.reportingManager', 'firstName lastName email');
  }

  /**
   * Find users by role
   */
  async findByRole(role: string): Promise<IUser[]> {
    return await UserModel.find({ role, isActive: true })
      .populate('professionalDetails.department', 'name code');
  }

  /**
   * Get users with birthdays today
   */
  async getBirthdaysToday(): Promise<IUser[]> {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    return await UserModel.aggregate([
      {
        $addFields: {
          birthMonth: { $month: '$dateOfBirth' },
          birthDay: { $dayOfMonth: '$dateOfBirth' }
        }
      },
      {
        $match: {
          birthMonth: month,
          birthDay: day,
          isActive: true
        }
      }
    ]);
  }

  /**
   * Get recently joined users
   */
  async getNewHires(days: number = 30): Promise<IUser[]> {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    return await UserModel.find({
      'professionalDetails.joiningDate': { $gte: dateThreshold },
      isActive: true
    })
      .populate('professionalDetails.department', 'name code')
      .sort({ 'professionalDetails.joiningDate': -1 });
  }

  /**
   * Update last login
   */
  async updateLastLogin(id: string): Promise<void> {
    await UserModel.findByIdAndUpdate(id, { lastLogin: new Date() });
  }

  /**
   * Search users
   */
  async search(searchTerm: string): Promise<IUser[]> {
    return await UserModel.find({
      $or: [
        { firstName: { $regex: searchTerm, $options: 'i' } },
        { lastName: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { 'professionalDetails.employeeId': { $regex: searchTerm, $options: 'i' } }
      ],
      isActive: true
    })
      .populate('professionalDetails.department', 'name code')
      .limit(20);
  }

  /**
   * Get user count by status
   */
  async getUserStats(): Promise<any> {
    return await UserModel.aggregate([
      {
        $group: {
          _id: '$professionalDetails.employmentStatus',
          count: { $sum: 1 }
        }
      }
    ]);
  }
}

export const userDAL = new UserDAL();