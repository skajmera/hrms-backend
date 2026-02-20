"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsController = void 0;
const permissions_service_1 = require("./permissions.service");
const response_1 = require("../../../../shared/utils/response");
/**
 * Permissions Controller
 * Handles HTTP requests for user permissions
 */
class PermissionsController {
    /**
     * Invite user with permissions
     * POST /api/v1/hr/permissions/invite
     */
    static async inviteUser(req, res, next) {
        try {
            const inviteData = req.body;
            const invitedBy = req.user?._id;
            const permission = await permissions_service_1.permissionsService.inviteUser(inviteData, invitedBy);
            (0, response_1.sendSuccessResponse)(res, 'User invited successfully with permissions', permission);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get all user permissions
     * GET /api/v1/hr/permissions
     */
    static async getAllPermissions(req, res, next) {
        try {
            const { role, status, page, limit, sortBy, sortOrder, search } = req.query;
            const filters = {};
            if (role)
                filters.role = role;
            if (status)
                filters.status = status;
            const options = {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                sortBy: sortBy || 'createdAt',
                sortOrder: sortOrder || 'desc'
            };
            const result = await permissions_service_1.permissionsService.getAllPermissions(filters, options);
            (0, response_1.sendSuccessResponse)(res, 'User permissions retrieved successfully', result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get permission by user ID
     * GET /api/v1/hr/permissions/:userId
     */
    static async getPermissionByUserId(req, res, next) {
        try {
            const { userId } = req.params;
            const permission = await permissions_service_1.permissionsService.getPermissionByUserId(userId);
            (0, response_1.sendSuccessResponse)(res, 'User permissions retrieved successfully', permission);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update user permissions
     * PUT /api/v1/hr/permissions/:userId
     */
    static async updatePermissions(req, res, next) {
        try {
            const { userId } = req.params;
            const updateData = req.body;
            const permission = await permissions_service_1.permissionsService.updatePermissions(userId, updateData);
            (0, response_1.sendSuccessResponse)(res, 'User permissions updated successfully', permission);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Delete user permissions
     * DELETE /api/v1/hr/permissions/:userId
     */
    static async deletePermissions(req, res, next) {
        try {
            const { userId } = req.params;
            await permissions_service_1.permissionsService.deletePermissions(userId);
            (0, response_1.sendSuccessResponse)(res, 'User permissions deleted successfully');
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Check user permission
     * POST /api/v1/hr/permissions/check
     */
    static async checkPermission(req, res, next) {
        try {
            const { userId, module, action } = req.body;
            const hasPermission = await permissions_service_1.permissionsService.checkPermission(userId, module, action);
            (0, response_1.sendSuccessResponse)(res, 'Permission check completed', { hasPermission });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Deactivate user
     * POST /api/v1/hr/permissions/:userId/deactivate
     */
    static async deactivateUser(req, res, next) {
        try {
            const { userId } = req.params;
            const permission = await permissions_service_1.permissionsService.deactivateUser(userId);
            (0, response_1.sendSuccessResponse)(res, 'User deactivated successfully', permission);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Activate user
     * POST /api/v1/hr/permissions/:userId/activate
     */
    static async activateUser(req, res, next) {
        try {
            const { userId } = req.params;
            const permission = await permissions_service_1.permissionsService.activateUser(userId);
            (0, response_1.sendSuccessResponse)(res, 'User activated successfully', permission);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get active users
     * GET /api/v1/hr/permissions/active
     */
    static async getActiveUsers(req, res, next) {
        try {
            const users = await permissions_service_1.permissionsService.getActiveUsers();
            (0, response_1.sendSuccessResponse)(res, 'Active users retrieved successfully', users);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get default permissions by role
     * GET /api/v1/hr/permissions/defaults/:role
     */
    static async getDefaultPermissions(req, res, next) {
        try {
            const { role } = req.params;
            const permissions = permissions_service_1.permissionsService.getDefaultPermissionsByRole(role);
            (0, response_1.sendSuccessResponse)(res, 'Default permissions retrieved successfully', permissions);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PermissionsController = PermissionsController;
//# sourceMappingURL=permissions.controller.js.map