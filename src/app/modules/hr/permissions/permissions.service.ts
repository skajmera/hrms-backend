import { permissionDAL } from '../../../../shared/dal/permission.dal';
import { userDAL } from '../../../../shared/dal/user.dal';
import { IUserPermission, IInviteUserInput } from '../../../../shared/interfaces/permission.interface';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';

/**
 * Permissions Service
 * Business logic for user permissions
 */

export class PermissionsService {
  /**
   * Invite user and set permissions
   */
   async inviteUser(inviteData: IInviteUserInput, invitedBy: string): Promise<IUserPermission> {
    // Check if user exists
    const user = await userDAL.findById(inviteData.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if permission already exists
    const existingPermission = await  permissionDAL.findByUserId(inviteData.userId);
    if (existingPermission) {
      throw new Error('User permissions already exist. Use update instead.');
    }

    // Create permission
    const permissionData = {
      ...inviteData,
      invitedBy,
      isActive: true,
      invitedAt: new Date()
    };

    const permission = await permissionDAL.create(permissionData);
    return permission;
  }

  /**
   * Get all user permissions
   */
   async getAllPermissions(filters: any = {}, options: IPaginationOptions) {
    const queryFilters: any = {};
    
    if (filters.role) {
      queryFilters.role = filters.role;
    }
    
    if (filters.status) {
      queryFilters.isActive = filters.status === 'active';
    }

    return await permissionDAL.findAll(queryFilters, options);
  }

  /**
   * Get permission by user ID
   */
   async getPermissionByUserId(userId: string): Promise<IUserPermission> {
    const permission = await permissionDAL.findByUserId(userId);
    if (!permission) {
      throw new Error('User permissions not found');
    }
    return permission;
  }

  /**
   * Update user permissions
   */
   async updatePermissions(userId: string, updateData: Partial<IUserPermission>): Promise<IUserPermission> {
    const permission = await permissionDAL.updateByUserId(userId, updateData);
    if (!permission) {
      throw new Error('User permissions not found');
    }
    return permission;
  }

  /**
   * Delete user permissions
   */
   async deletePermissions(userId: string): Promise<void> {
    const permission = await permissionDAL.deleteByUserId(userId);
    if (!permission) {
      throw new Error('User permissions not found');
    }
  }

  /**
   * Check if user has specific permission
   */
   async checkPermission(
    userId: string,
    module: string,
    action: 'view' | 'edit' | 'fullAccess'
  ): Promise<boolean> {
    return await permissionDAL.hasPermission(userId, module, action);
  }

  /**
   * Deactivate user permissions
   */
   async deactivateUser(userId: string): Promise<IUserPermission> {
    const permission = await permissionDAL.deactivate(userId);
    if (!permission) {
      throw new Error('User permissions not found');
    }
    return permission;
  }

  /**
   * Activate user permissions
   */
   async activateUser(userId: string): Promise<IUserPermission> {
    const permission = await permissionDAL.activate(userId);
    if (!permission) {
      throw new Error('User permissions not found');
    }
    return permission;
  }

  /**
   * Get all active users with permissions
   */
   async getActiveUsers() {
    return await permissionDAL.getActiveUsers();
  }

  /**
   * Get default permissions by role
   */
   getDefaultPermissionsByRole(role: string): IUserPermission['modules'] {
    const basePermissions = {
      employees: {
        employeesList: { view: false, edit: false, fullAccess: false },
        employeeProfile: { view: false, edit: false, fullAccess: false },
        employeeCareerHistory: { view: false, edit: false, fullAccess: false },
        employeeDepartment: { view: false, edit: false, fullAccess: false },
        employeeAttendance: { view: false, edit: false, fullAccess: false },
        employeeLeave: { view: false, edit: false, fullAccess: false },
        employeePayslip: { view: false, edit: false, fullAccess: false }
      },
      department: { fullAccess: false, view: false, edit: false },
      attendance: { fullAccess: false, view: false, edit: false },
      leaves: { fullAccess: false, view: false, edit: false },
      offboarding: { fullAccess: false, view: false, edit: false },
      payroll: { fullAccess: false, view: false, edit: false },
      announcements: { fullAccess: false, view: false, edit: false },
      usersPermissions: { fullAccess: false, view: false, edit: false }
    };

    // Admin gets full access to everything
    if (role === 'SUPER_ADMIN' || role === 'HR_ADMIN') {
      return {
        employees: {
          employeesList: { view: true, edit: true, fullAccess: true },
          employeeProfile: { view: true, edit: true, fullAccess: true },
          employeeCareerHistory: { view: true, edit: true, fullAccess: true },
          employeeDepartment: { view: true, edit: true, fullAccess: true },
          employeeAttendance: { view: true, edit: true, fullAccess: true },
          employeeLeave: { view: true, edit: true, fullAccess: true },
          employeePayslip: { view: true, edit: true, fullAccess: true }
        },
        department: { fullAccess: true, view: true, edit: true },
        attendance: { fullAccess: true, view: true, edit: true },
        leaves: { fullAccess: true, view: true, edit: true },
        offboarding: { fullAccess: true, view: true, edit: true },
        payroll: { fullAccess: true, view: true, edit: true },
        announcements: { fullAccess: true, view: true, edit: true },
        usersPermissions: { fullAccess: true, view: true, edit: true }
      };
    }

    // Manager gets view and edit access to team-related modules
    if (role === 'MANAGER') {
      return {
        employees: {
          employeesList: { view: true, edit: true, fullAccess: false },
          employeeProfile: { view: true, edit: false, fullAccess: false },
          employeeCareerHistory: { view: true, edit: false, fullAccess: false },
          employeeDepartment: { view: true, edit: false, fullAccess: false },
          employeeAttendance: { view: true, edit: true, fullAccess: false },
          employeeLeave: { view: true, edit: true, fullAccess: false },
          employeePayslip: { view: true, edit: false, fullAccess: false }
        },
        department: { fullAccess: false, view: true, edit: false },
        attendance: { fullAccess: false, view: true, edit: true },
        leaves: { fullAccess: false, view: true, edit: true },
        offboarding: { fullAccess: false, view: true, edit: false },
        payroll: { fullAccess: false, view: true, edit: false },
        announcements: { fullAccess: false, view: true, edit: false },
        usersPermissions: { fullAccess: false, view: false, edit: false }
      };
    }

    // Employee gets only view access to their own data
    return basePermissions;
  }
}

export const permissionsService = new PermissionsService();
