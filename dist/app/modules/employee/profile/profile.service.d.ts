import { IUserUpdateInput } from '../../../../shared/interfaces/user.interface';
export declare class EmployeeProfileService {
    /**
     * Get own profile
     */
    getMyProfile(userId: string): Promise<import("../../../../shared/interfaces/user.interface").IUser>;
    /**
     * Update own profile
     */
    updateMyProfile(userId: string, updateData: IUserUpdateInput): Promise<import("../../../../shared/interfaces/user.interface").IUser>;
    /**
     * Change password
     */
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
}
export declare const employeeProfileService: EmployeeProfileService;
//# sourceMappingURL=profile.service.d.ts.map