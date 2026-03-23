"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionDAL = exports.PermissionDAL = void 0;
const permission_model_1 = require("../models/permission.model");
const constants_1 = require("../../config/constants");
/**
 * User Permission Data Access Layer
 */
class PermissionDAL {
    /**
     * Create user permission
     */
    async create(permissionData) {
        const permission = await permission_model_1.UserPermissionModel.create(permissionData);
        return permission;
    }
    /**
     * Find permission by user ID
     */
    async findByUserId(userId) {
        return await permission_model_1.UserPermissionModel.findOne({ userId })
            .populate('userId', 'firstName lastName email phone profilePicture')
            .populate('invitedBy', 'firstName lastName email phone profilePicture');
    }
    /**
     * Get all user permissions with pagination
     */
    async findAll(filters = {}, options = {}) {
        const { page = constants_1.PAGINATION_DEFAULTS.PAGE, limit = constants_1.PAGINATION_DEFAULTS.LIMIT, sortBy = 'createdAt', sortOrder = 'desc' } = options;
        const skip = (page - 1) * limit;
        const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const [data, totalItems] = await Promise.all([
            permission_model_1.UserPermissionModel.find(filters)
                .populate('userId', 'firstName lastName email phone profilePicture professionalDetails.employeeId')
                .populate('invitedBy', 'firstName lastName phone profilePicture')
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec(),
            permission_model_1.UserPermissionModel.countDocuments(filters)
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
     * Upsert user permission (creates if not exists, updates if exists)
     */
    async updateByUserId(userId, updateData, upsertData) {
        // Merge upsertData (base fields) with updateData (incoming changes) for a reliable upsert.
        // Using $set for all fields ensures required fields (userId, email, invitedBy) are always
        // present regardless of whether the document is being created or updated.
        const mergedData = { ...(upsertData || {}), ...updateData };
        return await permission_model_1.UserPermissionModel.findOneAndUpdate({ userId }, { $set: mergedData }, { new: true, upsert: true, runValidators: false }).populate('userId', 'firstName lastName email phone profilePicture');
    }
    /**
     * Delete user permission
     */
    async deleteByUserId(userId) {
        return await permission_model_1.UserPermissionModel.findOneAndDelete({ userId });
    }
    /**
     * Check if user has permission for a module
     */
    async hasPermission(userId, module, action) {
        const permission = await this.findByUserId(userId);
        if (!permission || !permission.isActive) {
            return false;
        }
        const modulePath = module.split('.');
        let modulePermission = permission.modules;
        for (const path of modulePath) {
            modulePermission = modulePermission[path];
            if (!modulePermission)
                return false;
        }
        return modulePermission[action] || modulePermission.fullAccess || false;
    }
    /**
     * Get all active users with permissions
     */
    async getActiveUsers() {
        return await permission_model_1.UserPermissionModel.find({ isActive: true })
            .populate('userId', 'firstName lastName email phone profilePicture')
            .sort({ createdAt: -1 });
    }
    /**
     * Deactivate user permission
     */
    async deactivate(userId) {
        return await permission_model_1.UserPermissionModel.findOneAndUpdate({ userId }, { isActive: false }, { new: true });
    }
    /**
     * Activate user permission
     */
    async activate(userId) {
        return await permission_model_1.UserPermissionModel.findOneAndUpdate({ userId }, { isActive: true }, { new: true });
    }
}
exports.PermissionDAL = PermissionDAL;
exports.permissionDAL = new PermissionDAL();
//# sourceMappingURL=permission.dal.js.map