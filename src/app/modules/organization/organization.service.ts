import { OrganizationDAL } from '../../../shared/dal/organization.dal';
import { userDAL } from '../../../shared/dal/user.dal';
import { IOrganization, IOrganizationCreateInput, IOrganizationUpdateInput } from '../../../shared/interfaces/organization.interface';
import { IPaginationOptions } from '../../../shared/interfaces/common.interface';

/**
 * Organization Service
 */

export class OrganizationService {
  /**
   * Create organization
   */
  static async createOrganization(organizationData: IOrganizationCreateInput, ownerId: string): Promise<IOrganization> {
    // Check if owner already has an organization
    const existingOrg = await OrganizationDAL.findByOwner(ownerId);
    if (existingOrg) {
      throw new Error('User already owns an organization');
    }

    // Check if email already exists
    const existingEmail = await OrganizationDAL.findByEmail(organizationData.email);
    if (existingEmail) {
      throw new Error('Organization with this email already exists');
    }

    // Create organization
    const orgData: Partial<IOrganization> = {
      ...organizationData,
      owner: ownerId,
      admins: [ownerId],
      subscription: {
        plan: 'FREE',
        status: 'TRIAL',
        startDate: new Date(),
        maxEmployees: 10
      },
      isActive: true,
      isVerified: false
    };

    const organization = await OrganizationDAL.create(orgData);

    // Update user's organization reference (if you have that field)
    // await userDAL.updateById(ownerId, { organizationId: organization._id });

    return organization;
  }

  /**
   * Get organization by ID
   */
  static async getOrganizationById(organizationId: string): Promise<IOrganization> {
    const organization = await OrganizationDAL.findById(organizationId);
    if (!organization) {
      throw new Error('Organization not found');
    }
    return organization;
  }

  /**
   * Get user's organization
   */
  static async getUserOrganization({ userId, organizationId }: { userId: string; organizationId?: string }): Promise<IOrganization> {
    const organization = organizationId ? await OrganizationDAL.findById(organizationId) : await OrganizationDAL.findByOwner(userId);
    if (!organization) throw new Error('Organization not found');
    return organization;
  }

  /**
   * Get all organizations
   */
  static async getAllOrganizations(filters: any = {}, options: IPaginationOptions) {
    return await OrganizationDAL.findAll(filters, options);
  }

  /**
   * Update organization
   */
  static async updateOrganization(organizationId: string, updateData: IOrganizationUpdateInput): Promise<IOrganization> {
    // Check if email is being updated and if it's already taken
    if (updateData.email) {
      const existingEmail = await OrganizationDAL.findByEmail(updateData.email);
      if (existingEmail && existingEmail._id.toString() !== organizationId) {
        throw new Error('Organization with this email already exists');
      }
    }

    const organization = await OrganizationDAL.updateById(organizationId, updateData);
    if (!organization) {
      throw new Error('Organization not found');
    }
    return organization;
  }

  /**
   * Delete organization
   */
  static async deleteOrganization(organizationId: string): Promise<void> {
    const organization = await OrganizationDAL.deleteById(organizationId);
    if (!organization) {
      throw new Error('Organization not found');
    }
  }

  /**
   * Update settings
   */
  static async updateSettings(organizationId: string, settings: Partial<IOrganization['settings']>): Promise<IOrganization> {
    const organization = await OrganizationDAL.updateSettings(organizationId, settings);
    if (!organization) {
      throw new Error('Organization not found');
    }
    return organization;
  }

  /**
   * Add admin
   */
  static async addAdmin(organizationId: string, adminId: string): Promise<IOrganization> {
    // Verify user exists
    const user = await userDAL.findById(adminId);
    if (!user) {
      throw new Error('User not found');
    }

    const organization = await OrganizationDAL.addAdmin(organizationId, adminId);
    if (!organization) {
      throw new Error('Organization not found');
    }
    return organization;
  }

  /**
   * Remove admin
   */
  static async removeAdmin(organizationId: string, adminId: string): Promise<IOrganization> {
    const organization = await OrganizationDAL.removeAdmin(organizationId, adminId);
    if (!organization) {
      throw new Error('Organization not found');
    }
    return organization;
  }

  /**
   * Update subscription
   */
  static async updateSubscription(
    organizationId: string,
    subscription: Partial<IOrganization['subscription']>
  ): Promise<IOrganization> {
    const organization = await OrganizationDAL.updateSubscription(organizationId, subscription);
    if (!organization) {
      throw new Error('Organization not found');
    }
    return organization;
  }

  /**
   * Verify organization
   */
  static async verifyOrganization(organizationId: string): Promise<IOrganization> {
    const organization = await OrganizationDAL.updateById(organizationId, {
      isVerified: true
    });
    if (!organization) {
      throw new Error('Organization not found');
    }
    return organization;
  }

  /**
   * Check if user has access to organization
   */
  static async checkUserAccess(organizationId: string, userId: string): Promise<boolean> {
    return await OrganizationDAL.isUserInOrganization(organizationId, userId);
  }

  // --- Security Settings: Office Locations ---

  /**
   * Add office location
   */
  static async addOfficeLocation(organizationId: string, location: any): Promise<IOrganization> {
    const organization = await OrganizationDAL.addOfficeLocation(organizationId, location);
    if (!organization) {
      throw new Error('Organization not found');
    }
    return organization;
  }

  /**
   * Update office location
   */
  static async updateOfficeLocation(organizationId: string, locationId: string, locationData: any): Promise<IOrganization> {
    const organization = await OrganizationDAL.updateOfficeLocation(organizationId, locationId, locationData);
    if (!organization) {
      throw new Error('Organization or Location not found');
    }
    return organization;
  }

  /**
   * Remove office location
   */
  static async removeOfficeLocation(organizationId: string, locationId: string): Promise<IOrganization> {
    const organization = await OrganizationDAL.removeOfficeLocation(organizationId, locationId);
    if (!organization) {
      throw new Error('Organization not found');
    }
    return organization;
  }

  // --- Security Settings: WiFi Networks ---

  /**
   * Add WiFi network
   */
  static async addWifiNetwork(organizationId: string, wifi: any): Promise<IOrganization> {
    const organization = await OrganizationDAL.addWifiNetwork(organizationId, wifi);
    if (!organization) {
      throw new Error('Organization not found');
    }
    return organization;
  }

  /**
   * Update WiFi network
   */
  static async updateWifiNetwork(organizationId: string, wifiId: string, wifiData: any): Promise<IOrganization> {
    const organization = await OrganizationDAL.updateWifiNetwork(organizationId, wifiId, wifiData);
    if (!organization) {
      throw new Error('Organization or WiFi network not found');
    }
    return organization;
  }

  /**
   * Remove WiFi network
   */
  static async removeWifiNetwork(organizationId: string, wifiId: string): Promise<IOrganization> {
    const organization = await OrganizationDAL.removeWifiNetwork(organizationId, wifiId);
    if (!organization) {
      throw new Error('Organization not found');
    }
    return organization;
  }
}