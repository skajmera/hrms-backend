import { FilterQuery } from 'mongoose';
import { UserPermissionModel } from '../models/permission.model';
import { IUserPermission, IInviteUserInput } from '../interfaces/permission.interface';
import { IPaginationOptions, IPaginatedResponse } from '../interfaces/common.interface';
import { PAGINATION_DEFAULTS } from '../../config/constants';

/**
 * User Permission Data Access Layer
 */

export class PermissionDAL {
  /**
   * Create user permission
   */
   async create(permissionData: IInviteUserInput & { invitedBy: string }): Promise<IUserPermission> {
    const permission = await UserPermissionModel.create(permissionData);
    return permission;
  }

  /**
   * Find permission by user ID
   */
   async findByUserId(userId: string): Promise<IUserPermission | null> {
    return await UserPermissionModel.findOne({ userId })
      .populate('userId', 'firstName lastName email profilePicture')
      .populate('invitedBy', 'firstName lastName email');
  }

  /**
   * Get all user permissions with pagination
   */
   async findAll(
    filters: FilterQuery<IUserPermission> = {},
    options: IPaginationOptions = {}
  ): Promise<IPaginatedResponse<IUserPermission>> {
    const {
      page = PAGINATION_DEFAULTS.PAGE,
      limit = PAGINATION_DEFAULTS.LIMIT,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    const skip = (page - 1) * limit;
    const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [data, totalItems] = await Promise.all([
      UserPermissionModel.find(filters)
        .populate('userId', 'firstName lastName email profilePicture professionalDetails.employeeId')
        .populate('invitedBy', 'firstName lastName')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      UserPermissionModel.countDocuments(filters)
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }

  /**
   * Update user permission
   */
   async updateByUserId(userId: string, updateData: Partial<IUserPermission>): Promise<IUserPermission | null> {
    return await UserPermissionModel.findOneAndUpdate(
      { userId },
      updateData,
      { new: true }
    ).populate('userId', 'firstName lastName email');
  }

  /**
   * Delete user permission
   */
   async deleteByUserId(userId: string): Promise<IUserPermission | null> {
    return await UserPermissionModel.findOneAndDelete({ userId });
  }

  /**
   * Check if user has permission for a module
   */
   async hasPermission(
    userId: string, 
    module: string, 
    action: 'view' | 'edit' | 'fullAccess'
  ): Promise<boolean> {
    const permission = await this.findByUserId(userId);
    
    if (!permission || !permission.isActive) {
      return false;
    }

    const modulePath = module.split('.');
    let modulePermission: any = permission.modules;

    for (const path of modulePath) {
      modulePermission = modulePermission[path];
      if (!modulePermission) return false;
    }

    return modulePermission[action] || modulePermission.fullAccess || false;
  }

  /**
   * Get all active users with permissions
   */
   async getActiveUsers(): Promise<IUserPermission[]> {
    return await UserPermissionModel.find({ isActive: true })
      .populate('userId', 'firstName lastName email profilePicture')
      .sort({ createdAt: -1 });
  }

  /**
   * Deactivate user permission
   */
   async deactivate(userId: string): Promise<IUserPermission | null> {
    return await UserPermissionModel.findOneAndUpdate(
      { userId },
      { isActive: false },
      { new: true }
    );
  }

  /**
   * Activate user permission
   */
   async activate(userId: string): Promise<IUserPermission | null> {
    return await UserPermissionModel.findOneAndUpdate(
      { userId },
      { isActive: true },
      { new: true }
    );
  }
}

export const permissionDAL = new PermissionDAL();
