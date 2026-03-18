import { IOrganization, IOrganizationCreateInput, IOrganizationUpdateInput } from '../../../shared/interfaces/organization.interface';
import { IPaginationOptions } from '../../../shared/interfaces/common.interface';
/**
 * Organization Service
 */
export declare class OrganizationService {
    /**
     * Create organization
     */
    static createOrganization(organizationData: IOrganizationCreateInput, ownerId: string): Promise<IOrganization>;
    /**
     * Get organization by ID
     */
    static getOrganizationById(organizationId: string): Promise<IOrganization>;
    /**
     * Get user's organization
     */
    static getUserOrganization({ userId, organizationId }: {
        userId: string;
        organizationId?: string;
    }): Promise<IOrganization>;
    /**
     * Get all organizations
     */
    static getAllOrganizations(filters: any | undefined, options: IPaginationOptions): Promise<import("../../../shared/interfaces/common.interface").IPaginatedResponse<IOrganization>>;
    /**
     * Update organization
     */
    static updateOrganization(organizationId: string, updateData: IOrganizationUpdateInput): Promise<IOrganization>;
    /**
     * Delete organization
     */
    static deleteOrganization(organizationId: string): Promise<void>;
    /**
     * Update settings
     */
    static updateSettings(organizationId: string, settings: Partial<IOrganization['settings']>): Promise<IOrganization>;
    /**
     * Add admin
     */
    static addAdmin(organizationId: string, adminId: string): Promise<IOrganization>;
    /**
     * Remove admin
     */
    static removeAdmin(organizationId: string, adminId: string): Promise<IOrganization>;
    /**
     * Update subscription
     */
    static updateSubscription(organizationId: string, subscription: Partial<IOrganization['subscription']>): Promise<IOrganization>;
    /**
     * Verify organization
     */
    static verifyOrganization(organizationId: string): Promise<IOrganization>;
    /**
     * Check if user has access to organization
     */
    static checkUserAccess(organizationId: string, userId: string): Promise<boolean>;
    /**
     * Add office location
     */
    static addOfficeLocation(organizationId: string, location: any): Promise<IOrganization>;
    /**
     * Update office location
     */
    static updateOfficeLocation(organizationId: string, locationId: string, locationData: any): Promise<IOrganization>;
    /**
     * Remove office location
     */
    static removeOfficeLocation(organizationId: string, locationId: string): Promise<IOrganization>;
    /**
     * Add WiFi network
     */
    static addWifiNetwork(organizationId: string, wifi: any): Promise<IOrganization>;
    /**
     * Update WiFi network
     */
    static updateWifiNetwork(organizationId: string, wifiId: string, wifiData: any): Promise<IOrganization>;
    /**
     * Remove WiFi network
     */
    static removeWifiNetwork(organizationId: string, wifiId: string): Promise<IOrganization>;
}
//# sourceMappingURL=organization.service.d.ts.map