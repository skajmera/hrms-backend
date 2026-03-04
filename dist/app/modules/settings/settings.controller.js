"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const settings_service_1 = require("./settings.service");
const response_1 = require("../../../shared/utils/response");
/**
 * Settings Controller
 */
class SettingsController {
    /**
     * Update company info
     * PUT /api/v1/settings/company-info
     */
    static async updateCompanyInfo(req, res, next) {
        try {
            const organizationId = req.user?.organizationId;
            const updateData = req.body;
            const organization = await settings_service_1.SettingsService.updateCompanyInfo(organizationId, updateData);
            (0, response_1.sendSuccessResponse)(res, 'Company information updated successfully', organization);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update locale settings
     * PUT /api/v1/settings/locale
     */
    static async updateLocale(req, res, next) {
        try {
            const organizationId = req.user?.organizationId;
            const localeData = req.body;
            const organization = await settings_service_1.SettingsService.updateLocaleSettings(organizationId, localeData);
            (0, response_1.sendSuccessResponse)(res, 'Locale settings updated successfully', organization);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Create work schedule
     * POST /api/v1/settings/work-schedules
     */
    static async createWorkSchedule(req, res, next) {
        try {
            const organizationId = req.user?.organizationId;
            const createdBy = req.user?.id;
            const scheduleData = { ...req.body, organizationId };
            const schedule = await settings_service_1.SettingsService.createWorkSchedule(scheduleData, createdBy);
            (0, response_1.sendSuccessResponse)(res, 'Work schedule created successfully', schedule);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get work schedules
     * GET /api/v1/settings/work-schedules
     */
    static async getWorkSchedules(req, res, next) {
        try {
            const organizationId = req.user?.organizationId;
            const schedules = await settings_service_1.SettingsService.getWorkSchedules(organizationId);
            (0, response_1.sendSuccessResponse)(res, 'Work schedules retrieved successfully', schedules);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get work schedule by ID
     * GET /api/v1/settings/work-schedules/:id
     */
    static async getWorkScheduleById(req, res, next) {
        try {
            const { id } = req.params;
            const schedule = await settings_service_1.SettingsService.getWorkScheduleById(id);
            (0, response_1.sendSuccessResponse)(res, 'Work schedule retrieved successfully', schedule);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update work schedule
     * PUT /api/v1/settings/work-schedules/:id
     */
    static async updateWorkSchedule(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const schedule = await settings_service_1.SettingsService.updateWorkSchedule(id, updateData);
            (0, response_1.sendSuccessResponse)(res, 'Work schedule updated successfully', schedule);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Delete work schedule
     * DELETE /api/v1/settings/work-schedules/:id
     */
    static async deleteWorkSchedule(req, res, next) {
        try {
            const { id } = req.params;
            await settings_service_1.SettingsService.deleteWorkSchedule(id);
            (0, response_1.sendSuccessResponse)(res, 'Work schedule deleted successfully');
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get notification settings
     * GET /api/v1/settings/notifications
     */
    static async getNotifications(req, res, next) {
        try {
            const organizationId = req.user?.organizationId;
            const userId = req.user?.id;
            const settings = await settings_service_1.SettingsService.getNotificationSettings(organizationId, userId);
            (0, response_1.sendSuccessResponse)(res, 'Notification settings retrieved successfully', settings);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update notification settings
     * PUT /api/v1/settings/notifications
     */
    static async updateNotifications(req, res, next) {
        try {
            const organizationId = req.user?.organizationId;
            const userId = req.user?.id;
            const updateData = req.body;
            const settings = await settings_service_1.SettingsService.updateNotificationSettings(organizationId, userId, updateData);
            (0, response_1.sendSuccessResponse)(res, 'Notification settings updated successfully', settings);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Create designation
     * POST /api/v1/settings/designations
     */
    static async createDesignation(req, res, next) {
        try {
            const organizationId = req.user?.organizationId;
            const createdBy = req.user?.id;
            const designationData = { ...req.body, organizationId };
            const designation = await settings_service_1.SettingsService.createDesignation(designationData, createdBy);
            (0, response_1.sendSuccessResponse)(res, 'Designation created successfully', designation);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get designations
     * GET /api/v1/settings/designations
     */
    static async getDesignations(req, res, next) {
        try {
            const organizationId = req.user?.organizationId;
            const designations = await settings_service_1.SettingsService.getDesignations(organizationId);
            (0, response_1.sendSuccessResponse)(res, 'Designations retrieved successfully', designations);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get designation by ID
     * GET /api/v1/settings/designations/:id
     */
    static async getDesignationById(req, res, next) {
        try {
            const { id } = req.params;
            const designation = await settings_service_1.SettingsService.getDesignationById(id);
            (0, response_1.sendSuccessResponse)(res, 'Designation retrieved successfully', designation);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update designation
     * PUT /api/v1/settings/designations/:id
     */
    static async updateDesignation(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const designation = await settings_service_1.SettingsService.updateDesignation(id, updateData);
            (0, response_1.sendSuccessResponse)(res, 'Designation updated successfully', designation);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Delete designation
     * DELETE /api/v1/settings/designations/:id
     */
    static async deleteDesignation(req, res, next) {
        try {
            const { id } = req.params;
            await settings_service_1.SettingsService.deleteDesignation(id);
            (0, response_1.sendSuccessResponse)(res, 'Designation deleted successfully');
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Change password
     * POST /api/v1/settings/change-password
     */
    static async changePassword(req, res, next) {
        try {
            const userId = req.user?.id;
            const { currentPassword, newPassword } = req.body;
            await settings_service_1.SettingsService.changePassword(userId, currentPassword, newPassword);
            (0, response_1.sendSuccessResponse)(res, 'Password changed successfully');
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get security settings
     * GET /api/v1/settings/security
     */
    static async getSecuritySettings(req, res, next) {
        try {
            const organizationId = req.user?.organizationId;
            const userId = req.user?.id;
            const settings = await settings_service_1.SettingsService.getSecuritySettings(organizationId, userId);
            (0, response_1.sendSuccessResponse)(res, 'Security settings retrieved successfully', settings);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update security settings
     * PUT /api/v1/settings/security
     */
    static async updateSecuritySettings(req, res, next) {
        try {
            const organizationId = req.user?.organizationId;
            const securityData = req.body;
            const organization = await settings_service_1.SettingsService.updateSecuritySettings(organizationId, securityData);
            (0, response_1.sendSuccessResponse)(res, 'Security settings updated successfully', organization.settings.securitySettings);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SettingsController = SettingsController;
//# sourceMappingURL=settings.controller.js.map