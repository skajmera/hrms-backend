import { IOrganization } from '../../../shared/interfaces/organization.interface';
import { IWorkSchedule, INotificationSettings, IDesignation } from '../../../shared/interfaces/settings.interface';
/**
 * Settings Service
 */
export declare class SettingsService {
    /**
     * Update company info
     */
    static updateCompanyInfo(organizationId: string, updateData: Partial<IOrganization>): Promise<IOrganization>;
    /**
     * Update locale settings
     */
    static updateLocaleSettings(organizationId: string, localeData: any): Promise<IOrganization>;
    /**
     * Create work schedule
     */
    static createWorkSchedule(scheduleData: Partial<IWorkSchedule>, createdBy: string): Promise<IWorkSchedule>;
    /**
     * Get all work schedules
     */
    static getWorkSchedules(organizationId: string): Promise<IWorkSchedule[]>;
    /**
     * Get work schedule by ID
     */
    static getWorkScheduleById(scheduleId: string): Promise<IWorkSchedule>;
    /**
     * Update work schedule
     */
    static updateWorkSchedule(scheduleId: string, updateData: Partial<IWorkSchedule>): Promise<IWorkSchedule>;
    /**
     * Delete work schedule
     */
    static deleteWorkSchedule(scheduleId: string): Promise<void>;
    /**
     * Get notification settings
     */
    static getNotificationSettings(organizationId: string, userId: string): Promise<INotificationSettings>;
    /**
     * Update notification settings
     */
    static updateNotificationSettings(organizationId: string, userId: string, updateData: Partial<INotificationSettings>): Promise<INotificationSettings>;
    /**
     * Create designation
     */
    static createDesignation(designationData: Partial<IDesignation>, createdBy: string): Promise<IDesignation>;
    /**
     * Get all designations
     */
    static getDesignations(organizationId: string): Promise<IDesignation[]>;
    /**
     * Get designation by ID
     */
    static getDesignationById(designationId: string): Promise<IDesignation>;
    /**
     * Update designation
     */
    static updateDesignation(designationId: string, updateData: Partial<IDesignation>): Promise<IDesignation>;
    /**
     * Delete designation
     */
    static deleteDesignation(designationId: string): Promise<void>;
    /**
     * Change password
     */
    static changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    /**
     * Get security settings
     */
    static getSecuritySettings(organizationId: string, userId: string): Promise<any>;
    /**
     * Update security settings
     */
    static updateSecuritySettings(organizationId: string, securityData: any): Promise<IOrganization>;
}
//# sourceMappingURL=settings.service.d.ts.map