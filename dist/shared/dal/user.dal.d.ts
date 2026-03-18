import { IUser, IUserCreateInput } from '../interfaces/user.interface';
import { IQueryFilters, IPaginationOptions } from '../interfaces/common.interface';
export declare class UserDAL {
    /**
     * Create a new user
     */
    create(userData: IUserCreateInput): Promise<IUser>;
    /**
     * Find user by ID
     */
    findById(id: string, selectPassword?: boolean): Promise<IUser | null>;
    /**
     * Find user by email
     */
    findByEmail(email: string, selectPassword?: boolean): Promise<IUser | null>;
    /**
     * Find user by employee ID
     */
    findByEmployeeId(employeeId: string): Promise<IUser | null>;
    /**
     * Find all users with filters and pagination
     */
    findAll(filters?: IQueryFilters, options?: IPaginationOptions): Promise<{
        users: IUser[];
        total: number;
    }>;
    findIds(filters?: IQueryFilters): Promise<string[]>;
    /**
     * Find all users including drafts
     */
    findAllWithDrafts(filters?: IQueryFilters, options?: IPaginationOptions): Promise<{
        users: IUser[];
        total: number;
    }>;
    update(id: string, updateData: any): Promise<IUser | null>;
    /**
     * Delete user by ID (soft delete)
     */
    delete(id: string): Promise<IUser | null>;
    /**
     * Hard delete user by ID
     */
    hardDelete(id: string): Promise<IUser | null>;
    /**
     * Find users by department
     */
    findByDepartment(departmentId: string): Promise<IUser[]>;
    /**
     * Find users by role
     */
    findByRole(role: string): Promise<IUser[]>;
    /**
     * Get users with birthdays today
     */
    getBirthdaysToday(): Promise<IUser[]>;
    /**
     * Get recently joined users
     */
    getNewHires(days?: number, date?: string): Promise<any[]>;
    /**
     * Update last login
     */
    updateLastLogin(id: string): Promise<void>;
    /**
     * Search users by name, email, or employee ID
     */
    search(searchTerm: string): Promise<IUser[]>;
    /**
     * Find user by full name
     */
    findByName(name: string): Promise<IUser | null>;
    /**
     * Get user count by status
     */
    getUserStats(): Promise<any>;
    getAnniversaryToday(): Promise<IUser[]>;
    getTodayAttendanceOverview(): Promise<any[]>;
    getYetToCheckInCount(): Promise<number>;
}
export declare const userDAL: UserDAL;
//# sourceMappingURL=user.dal.d.ts.map