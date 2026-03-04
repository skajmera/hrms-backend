import { FilterQuery } from 'mongoose';
import { IOrganization } from '../interfaces/organization.interface';
import { IPaginationOptions, IPaginatedResponse } from '../interfaces/common.interface';
/**
 * Organization Data Access Layer
 */
export declare class OrganizationDAL {
    /**
     * Create organization
     */
    static create(organizationData: Partial<IOrganization>): Promise<IOrganization>;
    /**
     * Find organization by ID
     */
    static findById(organizationId: string): Promise<IOrganization | null>;
    /**
     * Find organization by owner
     */
    static findByOwner(ownerId: string): Promise<IOrganization | null>;
    /**
     * Find organization by email
     */
    static findByEmail(email: string): Promise<IOrganization | null>;
    /**
     * Get all organizations
     */
    static findAll(filters?: FilterQuery<IOrganization>, options?: IPaginationOptions): Promise<IPaginatedResponse<IOrganization>>;
    /**
     * Update organization
     */
    static updateById(organizationId: string, updateData: Partial<IOrganization>): Promise<IOrganization | null>;
    /**
     * Delete organization
     */
    static deleteById(organizationId: string): Promise<IOrganization | null>;
    /**
     * Add admin to organization
     */
    static addAdmin(organizationId: string, adminId: string): Promise<IOrganization | null>;
    /**
     * Remove admin from organization
     */
    static removeAdmin(organizationId: string, adminId: string): Promise<IOrganization | null>;
    /**
     * Update settings (supports partial updates)
     */
    static updateSettings(organizationId: string, settings: any): Promise<IOrganization | null>;
    /**
     * Update subscription
     */
    static updateSubscription(organizationId: string, subscription: Partial<IOrganization['subscription']>): Promise<IOrganization | null>;
    /**
     * Check if user belongs to organization
     */
    static isUserInOrganization(organizationId: string, userId: string): Promise<boolean>;
    /**
     * Get employee count
     */
    static getEmployeeCount(organizationId: string): Promise<number>;
    /**
     * Add office location
     */
    static addOfficeLocation(organizationId: string, location: any): Promise<IOrganization | null>;
    /**
     * Update office location
     */
    static updateOfficeLocation(organizationId: string, locationId: string, locationData: any): Promise<IOrganization | null>;
    /**
     * Remove office location
     */
    static removeOfficeLocation(organizationId: string, locationId: string): Promise<IOrganization | null>;
    /**
     * Add WiFi network
     */
    static addWifiNetwork(organizationId: string, wifi: any): Promise<IOrganization | null>;
    /**
     * Update WiFi network
     */
    static updateWifiNetwork(organizationId: string, wifiId: string, wifiData: any): Promise<IOrganization | null>;
    /**
     * Remove WiFi network
     */
    static removeWifiNetwork(organizationId: string, wifiId: string): Promise<IOrganization | null>;
}
//# sourceMappingURL=organization.dal.d.ts.map