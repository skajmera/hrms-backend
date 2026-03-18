"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationController = void 0;
const organization_service_1 = require("./organization.service");
const response_1 = require("../../../shared/utils/response");
/**
 * Organization Controller
 */
class OrganizationController {
    /**
     * Create organization
     * POST /api/v1/organization
     */
    static async createOrganization(req, res, next) {
        try {
            const organizationData = req.body;
            const ownerId = req.user?._id?.toString();
            if (!ownerId)
                throw new Error('Not authenticated');
            const organization = await organization_service_1.OrganizationService.createOrganization(organizationData, ownerId);
            (0, response_1.sendSuccessResponse)(res, 'Organization created successfully', organization);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get all organizations
     * GET /api/v1/organization
     */
    static async getAllOrganizations(req, res, next) {
        try {
            const { search, page, limit, sortBy, sortOrder } = req.query;
            const filters = {};
            if (search) {
                filters.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }
            const options = {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                sortBy: sortBy || 'createdAt',
                sortOrder: sortOrder || 'desc'
            };
            const result = await organization_service_1.OrganizationService.getAllOrganizations(filters, options);
            (0, response_1.sendSuccessResponse)(res, 'Organizations retrieved successfully', result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get organization by ID
     * GET /api/v1/organization/:id
     */
    static async getOrganizationById(req, res, next) {
        try {
            const { id } = req.params;
            const organization = await organization_service_1.OrganizationService.getOrganizationById(id);
            (0, response_1.sendSuccessResponse)(res, 'Organization retrieved successfully', organization);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get user's organization
     * GET /api/v1/organization/my-organization
     */
    static async getMyOrganization(req, res, next) {
        try {
            const userId = req.user?._id?.toString();
            const organizationId = req.user?.organizationId?.toString?.() ?? req.user?.organizationId;
            if (!userId)
                throw new Error('Not authenticated');
            const organization = await organization_service_1.OrganizationService.getUserOrganization({ userId, organizationId });
            (0, response_1.sendSuccessResponse)(res, 'Organization retrieved successfully', organization);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update organization
     * PUT /api/v1/organization/:id
     */
    static async updateOrganization(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const organization = await organization_service_1.OrganizationService.updateOrganization(id, updateData);
            (0, response_1.sendSuccessResponse)(res, 'Organization updated successfully', organization);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Delete organization
     * DELETE /api/v1/organization/:id
     */
    static async deleteOrganization(req, res, next) {
        try {
            const { id } = req.params;
            await organization_service_1.OrganizationService.deleteOrganization(id);
            (0, response_1.sendSuccessResponse)(res, 'Organization deleted successfully');
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update settings
     * PUT /api/v1/organization/:id/settings
     */
    static async updateSettings(req, res, next) {
        try {
            const { id } = req.params;
            const settings = req.body.settings;
            const organization = await organization_service_1.OrganizationService.updateSettings(id, settings);
            (0, response_1.sendSuccessResponse)(res, 'Settings updated successfully', organization);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Add admin
     * POST /api/v1/organization/:id/admins
     */
    static async addAdmin(req, res, next) {
        try {
            const { id } = req.params;
            const { adminId } = req.body;
            const organization = await organization_service_1.OrganizationService.addAdmin(id, adminId);
            (0, response_1.sendSuccessResponse)(res, 'Admin added successfully', organization);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Remove admin
     * DELETE /api/v1/organization/:id/admins/:adminId
     */
    static async removeAdmin(req, res, next) {
        try {
            const { id, adminId } = req.params;
            const organization = await organization_service_1.OrganizationService.removeAdmin(id, adminId);
            (0, response_1.sendSuccessResponse)(res, 'Admin removed successfully', organization);
        }
        catch (error) {
            next(error);
        }
    }
    // --- Security Settings: Office Locations ---
    /**
     * Add office location
     */
    static async addOfficeLocation(req, res, next) {
        try {
            const organization = await organization_service_1.OrganizationService.addOfficeLocation(req.user.organizationId, req.body);
            (0, response_1.sendSuccessResponse)(res, 'Office location added successfully', organization.settings.securitySettings.officeLocations);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update office location
     */
    static async updateOfficeLocation(req, res, next) {
        try {
            const organization = await organization_service_1.OrganizationService.updateOfficeLocation(req.user.organizationId, req.params.id, req.body);
            (0, response_1.sendSuccessResponse)(res, 'Office location updated successfully', organization.settings.securitySettings.officeLocations);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Remove office location
     */
    static async removeOfficeLocation(req, res, next) {
        try {
            const organization = await organization_service_1.OrganizationService.removeOfficeLocation(req.user.organizationId, req.params.id);
            (0, response_1.sendSuccessResponse)(res, 'Office location removed successfully', organization.settings.securitySettings.officeLocations);
        }
        catch (error) {
            next(error);
        }
    }
    // --- Security Settings: WiFi Networks ---
    /**
     * Add WiFi network
     */
    static async addWifiNetwork(req, res, next) {
        try {
            const organization = await organization_service_1.OrganizationService.addWifiNetwork(req.user.organizationId, req.body);
            (0, response_1.sendSuccessResponse)(res, 'WiFi network added successfully', organization.settings.securitySettings.allowedWifiNetworks);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update WiFi network
     */
    static async updateWifiNetwork(req, res, next) {
        try {
            const organization = await organization_service_1.OrganizationService.updateWifiNetwork(req.user.organizationId, req.params.id, req.body);
            (0, response_1.sendSuccessResponse)(res, 'WiFi network updated successfully', organization.settings.securitySettings.allowedWifiNetworks);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Remove WiFi network
     */
    static async removeWifiNetwork(req, res, next) {
        try {
            const organization = await organization_service_1.OrganizationService.removeWifiNetwork(req.user.organizationId, req.params.id);
            (0, response_1.sendSuccessResponse)(res, 'WiFi network removed successfully', organization.settings.securitySettings.allowedWifiNetworks);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update subscription
     * PUT /api/v1/organization/:id/subscription
     */
    static async updateSubscription(req, res, next) {
        try {
            const { id } = req.params;
            const subscription = req.body.subscription;
            const organization = await organization_service_1.OrganizationService.updateSubscription(id, subscription);
            (0, response_1.sendSuccessResponse)(res, 'Subscription updated successfully', organization);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Verify organization
     * POST /api/v1/organization/:id/verify
     */
    static async verifyOrganization(req, res, next) {
        try {
            const { id } = req.params;
            const organization = await organization_service_1.OrganizationService.verifyOrganization(id);
            (0, response_1.sendSuccessResponse)(res, 'Organization verified successfully', organization);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.OrganizationController = OrganizationController;
//# sourceMappingURL=organization.controller.js.map