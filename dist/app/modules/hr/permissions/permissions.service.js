"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionsService = exports.PermissionsService = void 0;
const permission_dal_1 = require("../../../../shared/dal/permission.dal");
const user_dal_1 = require("../../../../shared/dal/user.dal");
/**
 * Permissions Service
 * Business logic for user permissions
 */
class PermissionsService {
    /**
     * Invite user and set permissions
     */
    async inviteUser(inviteData, invitedBy) {
        // Check if user exists
        const user = await user_dal_1.userDAL.findById(inviteData.userId);
        if (!user) {
            throw new Error('User not found');
        }
        // Check if permission already exists
        const existingPermission = await permission_dal_1.permissionDAL.findByUserId(inviteData.userId);
        if (existingPermission) {
            throw new Error('User permissions already exist. Use update instead.');
        }
        // Create permission
        const permissionData = {
            ...inviteData,
            invitedBy,
            isActive: true,
            invitedAt: new Date()
        };
        const permission = await permission_dal_1.permissionDAL.create(permissionData);
        return permission;
    }
    /**
     * Get all user permissions
     */
    async getAllPermissions(filters = {}, options) {
        const queryFilters = {};
        if (filters.role) {
            queryFilters.role = filters.role;
        }
        if (filters.status) {
            queryFilters.isActive = filters.status === 'active';
        }
        if (filters.search) {
            queryFilters.$or = [
                { email: { $regex: filters.search, $options: 'i' } },
                { role: { $regex: filters.search, $options: 'i' } }
            ];
        }
        return await permission_dal_1.permissionDAL.findAll(queryFilters, options);
    }
    /**
     * Get permission by user ID
     */
    async getPermissionByUserId(userId) {
        const permission = await permission_dal_1.permissionDAL.findByUserId(userId);
        if (!permission) {
            // If no custom permissions found, fetch user to get role and return defaults
            const user = await user_dal_1.userDAL.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            return {
                userId: user._id,
                role: user.role,
                email: user.email,
                modules: this.getDefaultPermissionsByRole(user.role),
                isActive: true
            };
        }
        return permission;
    }
    /**
     * Get exact assigned permission by user ID (Returns object, empty object if not found)
     */
    async getAssignedPermissionByUserId(userId) {
        return await permission_dal_1.permissionDAL.findByUserId(userId) || {};
    }
    /**
     * Update or create user permissions (Atomic Upsert)
     */
    async updatePermissions(userId, updateData) {
        const user = await user_dal_1.userDAL.findById(userId);
        if (!user)
            throw new Error('User not found');
        const { invitedBy, ...dataToUpdate } = updateData;
        const upsertData = {
            userId: user._id,
            email: user.email,
            role: dataToUpdate.role || user.role,
            modules: dataToUpdate.modules || this.getDefaultPermissionsByRole(user.role),
            invitedBy: invitedBy,
            isActive: true,
            invitedAt: new Date()
        };
        const permission = await permission_dal_1.permissionDAL.updateByUserId(userId, dataToUpdate, upsertData);
        if (!permission)
            throw new Error('Failed to update or create user permissions');
        return permission;
    }
    /**
     * Delete user permissions (Gracefully handles non-existent permissions)
     */
    async deletePermissions(userId) {
        await permission_dal_1.permissionDAL.deleteByUserId(userId);
        // Removed the "throw new Error('User permissions not found')" check
        // If the permission doesn't exist, we consider the deletion successful anyway.
    }
    /**
     * Check if user has specific permission
     */
    async checkPermission(userId, module, action) {
        return await permission_dal_1.permissionDAL.hasPermission(userId, module, action);
    }
    /**
     * Deactivate user permissions (gracefully returns null if not found)
     */
    async deactivateUser(userId) {
        return await permission_dal_1.permissionDAL.deactivate(userId);
    }
    /**
     * Activate user permissions (gracefully returns null if not found)
     */
    async activateUser(userId) {
        return await permission_dal_1.permissionDAL.activate(userId);
    }
    /**
     * Get all active users with permissions
     */
    async getActiveUsers() {
        return await permission_dal_1.permissionDAL.getActiveUsers();
    }
    /**
     * Get default permissions by role
     */
    getDefaultPermissionsByRole(role) {
        const basePermissions = {
            employees: {
                employeesList: { view: false, edit: false, fullAccess: false },
                employeeProfile: { view: false, edit: false, fullAccess: false },
                employeeCareerHistory: { view: false, edit: false, fullAccess: false },
                employeeDepartment: { view: false, edit: false, fullAccess: false },
                employeeAttendance: { view: false, edit: false, fullAccess: false },
                employeeLeave: { view: false, edit: false, fullAccess: false },
                employeePayslip: { view: false, edit: false, fullAccess: false }
            },
            department: { fullAccess: false, view: false, edit: false },
            attendance: { fullAccess: false, view: false, edit: false },
            leaves: { fullAccess: false, view: false, edit: false },
            offboarding: { fullAccess: false, view: false, edit: false },
            payroll: { fullAccess: false, view: false, edit: false },
            announcements: { fullAccess: false, view: false, edit: false },
            usersPermissions: { fullAccess: false, view: false, edit: false },
            settings: {
                companyInfo: { fullAccess: false, view: false, edit: false },
                departments: { fullAccess: false, view: false, edit: false },
                designations: { fullAccess: false, view: false, edit: false },
                workSchedule: { fullAccess: false, view: false, edit: false },
                security: { fullAccess: false, view: false, edit: false }
            }
        };
        // Admin gets full access to everything
        if (role === 'SUPER_ADMIN' || role === 'HR_ADMIN') {
            return {
                employees: {
                    employeesList: { view: true, edit: true, fullAccess: true },
                    employeeProfile: { view: true, edit: true, fullAccess: true },
                    employeeCareerHistory: { view: true, edit: true, fullAccess: true },
                    employeeDepartment: { view: true, edit: true, fullAccess: true },
                    employeeAttendance: { view: true, edit: true, fullAccess: true },
                    employeeLeave: { view: true, edit: true, fullAccess: true },
                    employeePayslip: { view: true, edit: true, fullAccess: true }
                },
                department: { fullAccess: true, view: true, edit: true },
                attendance: { fullAccess: true, view: true, edit: true },
                leaves: { fullAccess: true, view: true, edit: true },
                offboarding: { fullAccess: true, view: true, edit: true },
                payroll: { fullAccess: true, view: true, edit: true },
                announcements: { fullAccess: true, view: true, edit: true },
                usersPermissions: { fullAccess: true, view: true, edit: true },
                settings: {
                    companyInfo: { fullAccess: true, view: true, edit: true },
                    departments: { fullAccess: true, view: true, edit: true },
                    designations: { fullAccess: true, view: true, edit: true },
                    workSchedule: { fullAccess: true, view: true, edit: true },
                    security: { fullAccess: true, view: true, edit: true }
                }
            };
        }
        // Manager gets view and edit access to team-related modules
        if (role === 'MANAGER') {
            return {
                employees: {
                    employeesList: { view: true, edit: true, fullAccess: false },
                    employeeProfile: { view: true, edit: false, fullAccess: false },
                    employeeCareerHistory: { view: true, edit: false, fullAccess: false },
                    employeeDepartment: { view: true, edit: false, fullAccess: false },
                    employeeAttendance: { view: true, edit: true, fullAccess: false },
                    employeeLeave: { view: true, edit: true, fullAccess: false },
                    employeePayslip: { view: true, edit: false, fullAccess: false }
                },
                department: { fullAccess: false, view: true, edit: false },
                attendance: { fullAccess: false, view: true, edit: true },
                leaves: { fullAccess: false, view: true, edit: true },
                offboarding: { fullAccess: false, view: true, edit: false },
                payroll: { fullAccess: false, view: true, edit: false },
                announcements: { fullAccess: false, view: true, edit: false },
                usersPermissions: { fullAccess: false, view: false, edit: false },
                settings: {
                    companyInfo: { fullAccess: false, view: false, edit: false },
                    departments: { fullAccess: false, view: false, edit: false },
                    designations: { fullAccess: false, view: false, edit: false },
                    workSchedule: { fullAccess: false, view: false, edit: false },
                    security: { fullAccess: false, view: false, edit: false }
                }
            };
        }
        // Employee gets only view access to their own data
        return basePermissions;
    }
}
exports.PermissionsService = PermissionsService;
exports.permissionsService = new PermissionsService();
//# sourceMappingURL=permissions.service.js.map