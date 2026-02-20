import { IUserCreateInput, IUserUpdateInput } from '../../../../shared/interfaces/user.interface';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';
export declare class UserService {
    /**
     * Create new user
     */
    createUser(userData: IUserCreateInput): Promise<import("../../../../shared/interfaces/user.interface").IUser>;
    /**
     * Get user by ID
     */
    getUserById(id: string): Promise<import("../../../../shared/interfaces/user.interface").IUser>;
    /**
     * Get all users
     */
    getAllUsers(filters: any | undefined, options: IPaginationOptions): Promise<{
        users: import("../../../../shared/interfaces/user.interface").IUser[];
        total: number;
    }>;
    /**
     * Update user
     */
    updateUser(id: string, updateData: IUserUpdateInput): Promise<import("../../../../shared/interfaces/user.interface").IUser>;
    /**
     * Delete user (soft delete)
     */
    deleteUser(id: string): Promise<import("../../../../shared/interfaces/user.interface").IUser>;
    /**
     * Get users by department
     */
    getUsersByDepartment(departmentId: string): Promise<import("../../../../shared/interfaces/user.interface").IUser[]>;
    /**
     * Get users by role
     */
    getUsersByRole(role: string): Promise<import("../../../../shared/interfaces/user.interface").IUser[]>;
    /**
     * Search users
     */
    searchUsers(searchTerm: string): Promise<import("../../../../shared/interfaces/user.interface").IUser[]>;
    /**
     * Get user statistics
     */
    getUserStats(): Promise<any>;
}
export declare const userService: UserService;
//# sourceMappingURL=user.service.d.ts.map