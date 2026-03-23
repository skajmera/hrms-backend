"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationDAL = void 0;
const organization_model_1 = require("../models/organization.model");
const constants_1 = require("../../config/constants");
/**
 * Organization Data Access Layer
 */
class OrganizationDAL {
    /**
     * Create organization
     */
    static async create(organizationData) {
        const organization = await organization_model_1.OrganizationModel.create(organizationData);
        return organization;
    }
    /**
     * Find organization by ID
     */
    static async findById(organizationId) {
        return await organization_model_1.OrganizationModel.findById(organizationId)
            .populate('owner', 'firstName lastName email phone profilePicture')
            .populate('admins', 'firstName lastName email phone profilePicture');
    }
    /**
     * Find organization by owner
     */
    static async findByOwner(ownerId) {
        return await organization_model_1.OrganizationModel.findOne({ owner: ownerId })
            .populate('admins', 'firstName lastName email phone profilePicture');
    }
    /**
     * Find organization by email
     */
    static async findByEmail(email) {
        return await organization_model_1.OrganizationModel.findOne({ email: email.toLowerCase() });
    }
    /**
     * Get all organizations
     */
    static async findAll(filters = {}, options = {}) {
        const { page = constants_1.PAGINATION_DEFAULTS.PAGE, limit = constants_1.PAGINATION_DEFAULTS.LIMIT, sortBy = 'createdAt', sortOrder = 'desc' } = options;
        const skip = (page - 1) * limit;
        const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const [data, totalItems] = await Promise.all([
            organization_model_1.OrganizationModel.find(filters)
                .populate('owner', 'firstName lastName email phone profilePicture')
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec(),
            organization_model_1.OrganizationModel.countDocuments(filters)
        ]);
        const totalPages = Math.ceil(totalItems / limit);
        return {
            data,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        };
    }
    /**
     * Update organization
     */
    static async updateById(organizationId, updateData) {
        return await organization_model_1.OrganizationModel.findByIdAndUpdate(organizationId, { $set: updateData }, { new: true }).populate('owner', 'firstName lastName email phone profilePicture');
    }
    /**
     * Delete organization
     */
    static async deleteById(organizationId) {
        return await organization_model_1.OrganizationModel.findByIdAndDelete(organizationId);
    }
    /**
     * Add admin to organization
     */
    static async addAdmin(organizationId, adminId) {
        return await organization_model_1.OrganizationModel.findByIdAndUpdate(organizationId, { $addToSet: { admins: adminId } }, { new: true });
    }
    /**
     * Remove admin from organization
     */
    static async removeAdmin(organizationId, adminId) {
        return await organization_model_1.OrganizationModel.findByIdAndUpdate(organizationId, { $pull: { admins: adminId } }, { new: true });
    }
    /**
     * Update settings (supports partial updates)
     */
    static async updateSettings(organizationId, settings) {
        const updateData = {};
        // Convert flat settings object to dotted notation for partial updates
        Object.keys(settings).forEach(key => {
            if (key === 'locale' && typeof settings[key] === 'object') {
                // Deep handle locale for partial updates
                Object.keys(settings[key]).forEach(subKey => {
                    updateData[`settings.locale.${subKey}`] = settings[key][subKey];
                });
            }
            else {
                updateData[`settings.${key}`] = settings[key];
            }
        });
        return await organization_model_1.OrganizationModel.findByIdAndUpdate(organizationId, { $set: updateData }, { new: true });
    }
    /**
     * Update subscription
     */
    static async updateSubscription(organizationId, subscription) {
        return await organization_model_1.OrganizationModel.findByIdAndUpdate(organizationId, { $set: { subscription } }, { new: true });
    }
    /**
     * Check if user belongs to organization
     */
    static async isUserInOrganization(organizationId, userId) {
        const org = await organization_model_1.OrganizationModel.findOne({
            _id: organizationId,
            $or: [
                { owner: userId },
                { admins: userId }
            ]
        });
        return !!org;
    }
    /**
     * Get employee count
     */
    static async getEmployeeCount(organizationId) {
        const UserModel = require('./user.dal').UserDAL;
        // This would need to be implemented based on how you link users to organizations
        return 0; // Placeholder
    }
    // --- Security Settings: Office Locations ---
    /**
     * Add office location
     */
    static async addOfficeLocation(organizationId, location) {
        return await organization_model_1.OrganizationModel.findByIdAndUpdate(organizationId, { $push: { 'settings.securitySettings.officeLocations': location } }, { new: true });
    }
    /**
     * Update office location
     */
    static async updateOfficeLocation(organizationId, locationId, locationData) {
        return await organization_model_1.OrganizationModel.findOneAndUpdate({ _id: organizationId, 'settings.securitySettings.officeLocations._id': locationId }, { $set: { 'settings.securitySettings.officeLocations.$': { ...locationData, _id: locationId } } }, { new: true });
    }
    /**
     * Remove office location
     */
    static async removeOfficeLocation(organizationId, locationId) {
        return await organization_model_1.OrganizationModel.findByIdAndUpdate(organizationId, { $pull: { 'settings.securitySettings.officeLocations': { _id: locationId } } }, { new: true });
    }
    // --- Security Settings: WiFi Networks ---
    /**
     * Add WiFi network
     */
    static async addWifiNetwork(organizationId, wifi) {
        return await organization_model_1.OrganizationModel.findByIdAndUpdate(organizationId, { $push: { 'settings.securitySettings.allowedWifiNetworks': wifi } }, { new: true });
    }
    /**
     * Update WiFi network
     */
    static async updateWifiNetwork(organizationId, wifiId, wifiData) {
        return await organization_model_1.OrganizationModel.findOneAndUpdate({ _id: organizationId, 'settings.securitySettings.allowedWifiNetworks._id': wifiId }, { $set: { 'settings.securitySettings.allowedWifiNetworks.$': { ...wifiData, _id: wifiId } } }, { new: true });
    }
    /**
     * Remove WiFi network
     */
    static async removeWifiNetwork(organizationId, wifiId) {
        return await organization_model_1.OrganizationModel.findByIdAndUpdate(organizationId, { $pull: { 'settings.securitySettings.allowedWifiNetworks': { _id: wifiId } } }, { new: true });
    }
}
exports.OrganizationDAL = OrganizationDAL;
//# sourceMappingURL=organization.dal.js.map