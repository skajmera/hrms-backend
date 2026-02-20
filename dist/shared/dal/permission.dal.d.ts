import { FilterQuery } from 'mongoose';
import { IUserPermission, IInviteUserInput } from '../interfaces/permission.interface';
import { IPaginationOptions, IPaginatedResponse } from '../interfaces/common.interface';
/**
 * User Permission Data Access Layer
 */
export declare class PermissionDAL {
    /**
     * Create user permission
     */
    create(permissionData: IInviteUserInput & {
        invitedBy: string;
    }): Promise<IUserPermission>;
    /**
     * Find permission by user ID
     */
    findByUserId(userId: string): Promise<IUserPermission | null>;
    /**
     * Get all user permissions with pagination
     */
    findAll(filters?: FilterQuery<IUserPermission>, options?: IPaginationOptions): Promise<IPaginatedResponse<IUserPermission>>;
    /**
     * Update user permission
     */
    updateByUserId(userId: string, updateData: Partial<IUserPermission>): Promise<IUserPermission | null>;
    /**
     * Delete user permission
     */
    deleteByUserId(userId: string): Promise<IUserPermission | null>;
    /**
     * Check if user has permission for a module
     */
    hasPermission(userId: string, module: string, action: 'view' | 'edit' | 'fullAccess'): Promise<boolean>;
    /**
     * Get all active users with permissions
     */
    getActiveUsers(): Promise<IUserPermission[]>;
    /**
     * Deactivate user permission
     */
    deactivate(userId: string): Promise<IUserPermission | null>;
    /**
     * Activate user permission
     */
    activate(userId: string): Promise<IUserPermission | null>;
}
export declare const permissionDAL: PermissionDAL;
//# sourceMappingURL=permission.dal.d.ts.map