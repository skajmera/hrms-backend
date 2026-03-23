"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationService = void 0;
const organization_dal_1 = require("../../../shared/dal/organization.dal");
const user_dal_1 = require("../../../shared/dal/user.dal");
/**
 * Organization Service
 */
class OrganizationService {
    /**
     * Create organization
     */
    static async createOrganization(organizationData, ownerId) {
        // Check if owner already has an organization
        const existingOrg = await organization_dal_1.OrganizationDAL.findByOwner(ownerId);
        if (existingOrg) {
            throw new Error('User already owns an organization');
        }
        // Check if email already exists
        const existingEmail = await organization_dal_1.OrganizationDAL.findByEmail(organizationData.email);
        if (existingEmail) {
            throw new Error('Organization with this email already exists');
        }
        // Create organization
        const orgData = {
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
        const organization = await organization_dal_1.OrganizationDAL.create(orgData);
        // Update user's organization reference (if you have that field)
        // await userDAL.updateById(ownerId, { organizationId: organization._id });
        return organization;
    }
    /**
     * Get organization by ID
     */
    static async getOrganizationById(organizationId) {
        const organization = await organization_dal_1.OrganizationDAL.findById(organizationId);
        if (!organization) {
            throw new Error('Organization not found');
        }
        return organization;
    }
    /**
     * Get user's organization
     */
    static async getUserOrganization({ userId, organizationId }) {
        const organization = organizationId ? await organization_dal_1.OrganizationDAL.findById(organizationId) : await organization_dal_1.OrganizationDAL.findByOwner(userId);
        if (!organization)
            throw new Error('Organization not found');
        // Inject mirrors + aliases required by mobile contract
        const user = await user_dal_1.userDAL.findById(userId);
        const orgObj = typeof organization.toObject === 'function' ? organization.toObject() : organization;
        const sec = orgObj?.settings?.securitySettings || {};
        // Alias sync: app treats them as OR
        const effectiveRequireFace = Boolean(sec.requireFaceCapture || sec.isSelfieRequired);
        sec.requireFaceCapture = effectiveRequireFace;
        sec.isSelfieRequired = effectiveRequireFace;
        sec.requiresEnrollment = Boolean(sec.requiresEnrollment);
        // Mirrors (legacy fields in FE)
        sec.registeredDeviceId = user?.registeredDeviceId ?? null;
        sec.isFaceRegistered = Boolean(user?.azurePersonId);
        orgObj.settings.securitySettings = sec;
        return orgObj;
    }
    /**
     * Get all organizations
     */
    static async getAllOrganizations(filters = {}, options) {
        return await organization_dal_1.OrganizationDAL.findAll(filters, options);
    }
    /**
     * Update organization
     */
    static async updateOrganization(organizationId, updateData) {
        // Check if email is being updated and if it's already taken
        if (updateData.email) {
            const existingEmail = await organization_dal_1.OrganizationDAL.findByEmail(updateData.email);
            if (existingEmail && existingEmail._id.toString() !== organizationId) {
                throw new Error('Organization with this email already exists');
            }
        }
        const organization = await organization_dal_1.OrganizationDAL.updateById(organizationId, updateData);
        if (!organization) {
            throw new Error('Organization not found');
        }
        return organization;
    }
    /**
     * Delete organization
     */
    static async deleteOrganization(organizationId) {
        const organization = await organization_dal_1.OrganizationDAL.deleteById(organizationId);
        if (!organization) {
            throw new Error('Organization not found');
        }
    }
    /**
     * Update settings
     */
    static async updateSettings(organizationId, settings) {
        const organization = await organization_dal_1.OrganizationDAL.updateSettings(organizationId, settings);
        if (!organization) {
            throw new Error('Organization not found');
        }
        return organization;
    }
    /**
     * Add admin
     */
    static async addAdmin(organizationId, adminId) {
        // Verify user exists
        const user = await user_dal_1.userDAL.findById(adminId);
        if (!user) {
            throw new Error('User not found');
        }
        const organization = await organization_dal_1.OrganizationDAL.addAdmin(organizationId, adminId);
        if (!organization) {
            throw new Error('Organization not found');
        }
        return organization;
    }
    /**
     * Remove admin
     */
    static async removeAdmin(organizationId, adminId) {
        const organization = await organization_dal_1.OrganizationDAL.removeAdmin(organizationId, adminId);
        if (!organization) {
            throw new Error('Organization not found');
        }
        return organization;
    }
    /**
     * Update subscription
     */
    static async updateSubscription(organizationId, subscription) {
        const organization = await organization_dal_1.OrganizationDAL.updateSubscription(organizationId, subscription);
        if (!organization) {
            throw new Error('Organization not found');
        }
        return organization;
    }
    /**
     * Verify organization
     */
    static async verifyOrganization(organizationId) {
        const organization = await organization_dal_1.OrganizationDAL.updateById(organizationId, {
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
    static async checkUserAccess(organizationId, userId) {
        return await organization_dal_1.OrganizationDAL.isUserInOrganization(organizationId, userId);
    }
    // --- Security Settings: Office Locations ---
    /**
     * Add office location
     */
    static async addOfficeLocation(organizationId, location) {
        const organization = await organization_dal_1.OrganizationDAL.addOfficeLocation(organizationId, location);
        if (!organization) {
            throw new Error('Organization not found');
        }
        return organization;
    }
    /**
     * Update office location
     */
    static async updateOfficeLocation(organizationId, locationId, locationData) {
        const organization = await organization_dal_1.OrganizationDAL.updateOfficeLocation(organizationId, locationId, locationData);
        if (!organization) {
            throw new Error('Organization or Location not found');
        }
        return organization;
    }
    /**
     * Remove office location
     */
    static async removeOfficeLocation(organizationId, locationId) {
        const organization = await organization_dal_1.OrganizationDAL.removeOfficeLocation(organizationId, locationId);
        if (!organization) {
            throw new Error('Organization not found');
        }
        return organization;
    }
    // --- Security Settings: WiFi Networks ---
    /**
     * Add WiFi network
     */
    static async addWifiNetwork(organizationId, wifi) {
        const organization = await organization_dal_1.OrganizationDAL.addWifiNetwork(organizationId, wifi);
        if (!organization) {
            throw new Error('Organization not found');
        }
        return organization;
    }
    /**
     * Update WiFi network
     */
    static async updateWifiNetwork(organizationId, wifiId, wifiData) {
        const organization = await organization_dal_1.OrganizationDAL.updateWifiNetwork(organizationId, wifiId, wifiData);
        if (!organization) {
            throw new Error('Organization or WiFi network not found');
        }
        return organization;
    }
    /**
     * Remove WiFi network
     */
    static async removeWifiNetwork(organizationId, wifiId) {
        const organization = await organization_dal_1.OrganizationDAL.removeWifiNetwork(organizationId, wifiId);
        if (!organization) {
            throw new Error('Organization not found');
        }
        return organization;
    }
}
exports.OrganizationService = OrganizationService;
//# sourceMappingURL=organization.service.js.map