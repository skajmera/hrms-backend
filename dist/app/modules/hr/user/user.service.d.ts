import { IUserUpdateInput } from '../../../../shared/interfaces/user.interface';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';
export declare class UserService {
    /**
     * Create new user
     */
    createUser(userData: any): Promise<import("../../../../shared/interfaces/user.interface").IUser>;
    /**
     * Create draft user
     */
    createDraftEmployee(userData: any): Promise<import("../../../../shared/interfaces/user.interface").IUser | null>;
    /**
     * Get all draft employees
     */
    getDraftEmployees(options: IPaginationOptions): Promise<{
        users: import("../../../../shared/interfaces/user.interface").IUser[];
        total: number;
    }>;
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
     * Get all users including drafts
     */
    getAllUsersWithDrafts(filters: any | undefined, options: IPaginationOptions): Promise<{
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
     * Delete draft employee
     */
    deleteDraftEmployee(id: string): Promise<import("../../../../shared/interfaces/user.interface").IUser | null>;
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
    /**
     * Get user by employee ID
     */
    getUserByEmployeeId(employeeId: string): Promise<import("../../../../shared/interfaces/user.interface").IUser>;
    /**
     * Clear registered device ID for a user
     */
    clearUserDevice(id: string): Promise<import("../../../../shared/interfaces/user.interface").IUser | null>;
    /**
     * Upload user avatar using base64 or file path
     */
    uploadAvatar(userId: string, imageUrl: string): Promise<import("../../../../shared/interfaces/user.interface").IUser | null>;
    /**
     * Add FCM Device Token for Push Notifications
     */
    addFcmToken(userId: string, token: string): Promise<import("../../../../shared/interfaces/user.interface").IUser>;
}
export declare const userService: UserService;
//# sourceMappingURL=user.service.d.ts.map