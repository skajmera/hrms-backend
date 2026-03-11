import { IUserPermission, IInviteUserInput } from '../../../../shared/interfaces/permission.interface';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';
/**
 * Permissions Service
 * Business logic for user permissions
 */
export declare class PermissionsService {
    /**
     * Invite user and set permissions
     */
    inviteUser(inviteData: IInviteUserInput, invitedBy: string): Promise<IUserPermission>;
    /**
     * Get all user permissions
     */
    getAllPermissions(filters: any | undefined, options: IPaginationOptions): Promise<import("../../../../shared/interfaces/common.interface").IPaginatedResponse<IUserPermission>>;
    /**
     * Get permission by user ID
     */
    getPermissionByUserId(userId: string): Promise<IUserPermission | any>;
    /**
     * Get exact assigned permission by user ID (Returns object, empty object if not found)
     */
    getAssignedPermissionByUserId(userId: string): Promise<any>;
    /**
     * Update or create user permissions (Atomic Upsert)
     */
    updatePermissions(userId: string, updateData: any): Promise<IUserPermission>;
    /**
     * Delete user permissions (Gracefully handles non-existent permissions)
     */
    deletePermissions(userId: string): Promise<void>;
    /**
     * Check if user has specific permission
     */
    checkPermission(userId: string, module: string, action: 'view' | 'edit' | 'fullAccess'): Promise<boolean>;
    /**
     * Deactivate user permissions (gracefully returns null if not found)
     */
    deactivateUser(userId: string): Promise<IUserPermission | null>;
    /**
     * Activate user permissions (gracefully returns null if not found)
     */
    activateUser(userId: string): Promise<IUserPermission | null>;
    /**
     * Get all active users with permissions
     */
    getActiveUsers(): Promise<IUserPermission[]>;
    /**
     * Get default permissions by role
     */
    getDefaultPermissionsByRole(role: string): IUserPermission['modules'];
}
export declare const permissionsService: PermissionsService;
//# sourceMappingURL=permissions.service.d.ts.map