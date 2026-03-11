"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const organization_dal_1 = require("../../../shared/dal/organization.dal");
const user_dal_1 = require("../../../shared/dal/user.dal");
const work_schedule_model_1 = require("../../../shared/models/work-schedule.model");
const notification_settings_model_1 = require("../../../shared/models/notification-settings.model");
const designation_model_1 = require("../../../shared/models/designation.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * Settings Service
 */
class SettingsService {
    /**
     * Update company info
     */
    static async updateCompanyInfo(organizationId, updateData) {
        const organization = await organization_dal_1.OrganizationDAL.updateById(organizationId, updateData);
        if (!organization) {
            throw new Error('Organization not found');
        }
        return organization;
    }
    /**
     * Update locale settings
     */
    static async updateLocaleSettings(organizationId, localeData) {
        const updateData = {};
        if (localeData.country)
            updateData['settings.locale.country'] = localeData.country;
        if (localeData.timezone)
            updateData['settings.locale.timezone'] = localeData.timezone;
        if (localeData.timeFormat)
            updateData['settings.locale.timeFormat'] = localeData.timeFormat;
        if (localeData.dateFormat)
            updateData['settings.locale.dateFormat'] = localeData.dateFormat;
        if (localeData.nameFormat) {
            let format = localeData.nameFormat.toUpperCase().replace('-', '_');
            if (['FIRST_LAST', 'LAST_FIRST'].includes(format)) {
                updateData['settings.locale.nameFormat'] = format;
            }
        }
        const organization = await organization_dal_1.OrganizationDAL.updateById(organizationId, updateData);
        if (!organization) {
            throw new Error('Organization not found');
        }
        return organization;
    }
    /**
     * Create work schedule
     */
    static async createWorkSchedule(scheduleData, createdBy) {
        // If this is set as default, unset other defaults
        if (scheduleData.isDefault) {
            await work_schedule_model_1.WorkScheduleModel.updateMany({ organizationId: scheduleData.organizationId, isDefault: true }, { isDefault: false });
        }
        const schedule = await work_schedule_model_1.WorkScheduleModel.create({
            ...scheduleData,
            createdBy
        });
        return schedule;
    }
    /**
     * Get all work schedules
     */
    static async getWorkSchedules(organizationId) {
        return await work_schedule_model_1.WorkScheduleModel.find({ organizationId })
            .populate('createdBy', 'firstName lastName')
            .sort({ isDefault: -1, createdAt: -1 });
    }
    /**
     * Get work schedule by ID
     */
    static async getWorkScheduleById(scheduleId) {
        const schedule = await work_schedule_model_1.WorkScheduleModel.findById(scheduleId);
        if (!schedule) {
            throw new Error('Work schedule not found');
        }
        return schedule;
    }
    /**
     * Update work schedule
     */
    static async updateWorkSchedule(scheduleId, updateData) {
        // If setting as default, unset other defaults in the same org
        if (updateData.isDefault === true) {
            const schedule = await work_schedule_model_1.WorkScheduleModel.findById(scheduleId).select('organizationId');
            if (schedule) {
                await work_schedule_model_1.WorkScheduleModel.updateMany({ organizationId: schedule.organizationId, _id: { $ne: scheduleId }, isDefault: true }, { isDefault: false });
            }
        }
        const updated = await work_schedule_model_1.WorkScheduleModel.findByIdAndUpdate(scheduleId, updateData, { new: true });
        if (!updated)
            throw new Error('Work schedule not found');
        return updated;
    }
    /**
     * Delete work schedule
     */
    static async deleteWorkSchedule(scheduleId) {
        const schedule = await work_schedule_model_1.WorkScheduleModel.findByIdAndDelete(scheduleId);
        if (!schedule) {
            throw new Error('Work schedule not found');
        }
    }
    /**
     * Get notification settings
     */
    static async getNotificationSettings(organizationId, userId) {
        let settings = await notification_settings_model_1.NotificationSettingsModel.findOne({ organizationId, userId });
        if (!settings) {
            // Create default settings
            settings = await notification_settings_model_1.NotificationSettingsModel.create({
                organizationId,
                userId
            });
        }
        return settings;
    }
    /**
     * Update notification settings
     */
    static async updateNotificationSettings(organizationId, userId, updateData) {
        const settings = await notification_settings_model_1.NotificationSettingsModel.findOneAndUpdate({ organizationId, userId }, { $set: updateData }, { new: true, upsert: true });
        return settings;
    }
    /**
     * Create designation
     */
    static async createDesignation(designationData, createdBy) {
        // Check if code already exists
        const existing = await designation_model_1.DesignationModel.findOne({
            organizationId: designationData.organizationId,
            code: designationData.code
        });
        if (existing) {
            throw new Error('Designation with this code already exists');
        }
        const designation = await designation_model_1.DesignationModel.create({
            ...designationData,
            createdBy
        });
        return designation;
    }
    /**
     * Get all designations
     */
    static async getDesignations(organizationId) {
        return await designation_model_1.DesignationModel.find({ organizationId, isActive: true })
            .populate('parentDesignation', 'name code')
            .populate('associatedUsers', 'firstName lastName email profilePicture')
            .sort({ level: 1, name: 1 });
    }
    /**
     * Get designation by ID
     */
    static async getDesignationById(designationId) {
        const designation = await designation_model_1.DesignationModel.findById(designationId)
            .populate('associatedUsers', 'firstName lastName email');
        if (!designation) {
            throw new Error('Designation not found');
        }
        return designation;
    }
    /**
     * Update designation
     */
    static async updateDesignation(designationId, updateData) {
        const designation = await designation_model_1.DesignationModel.findByIdAndUpdate(designationId, updateData, { new: true });
        if (!designation) {
            throw new Error('Designation not found');
        }
        return designation;
    }
    /**
     * Delete designation
     */
    static async deleteDesignation(designationId) {
        const designation = await designation_model_1.DesignationModel.findByIdAndUpdate(designationId, { isActive: false }, { new: true });
        if (!designation) {
            throw new Error('Designation not found');
        }
    }
    /**
     * Change password
     */
    static async changePassword(userId, currentPassword, newPassword) {
        // Get user with password
        const user = await user_dal_1.userDAL.findById(userId, true);
        if (!user) {
            throw new Error('User not found');
        }
        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            throw new Error('Current password is incorrect');
        }
        // Hash new password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, salt);
        // Update password
        await user_dal_1.userDAL.update(userId, { password: hashedPassword });
    }
    /**
     * Get security settings
     */
    static async getSecuritySettings(organizationId, userId) {
        console.log('Fetching security settings for organizationId:', organizationId);
        const [organization, user] = await Promise.all([
            organization_dal_1.OrganizationDAL.findById(organizationId),
            user_dal_1.userDAL.findById(userId)
        ]);
        if (!organization) {
            throw new Error('Organization not found');
        }
        const securitySettings = organization.settings?.securitySettings || {};
        return {
            requireFaceCapture: securitySettings.requireFaceCapture || false,
            blockMockLocations: securitySettings.blockMockLocations || true,
            isFaceRegistered: !!user?.azurePersonId,
            officeLocations: securitySettings.officeLocations || [],
            allowedWifiNetworks: securitySettings.allowedWifiNetworks || [],
            registeredDeviceId: user?.registeredDeviceId || null
        };
    }
    /**
     * Update security settings
     */
    static async updateSecuritySettings(organizationId, securityData) {
        const updateData = {};
        if (securityData.requireFaceCapture !== undefined) {
            updateData['settings.securitySettings.requireFaceCapture'] = securityData.requireFaceCapture;
        }
        if (securityData.blockMockLocations !== undefined) {
            updateData['settings.securitySettings.blockMockLocations'] = securityData.blockMockLocations;
        }
        // Handle office locations
        if (securityData.officeLocations !== undefined) {
            updateData['settings.securitySettings.officeLocations'] = securityData.officeLocations.map((loc) => {
                const { _id, ...rest } = loc;
                // Strip temporary frontend IDs
                if (_id && _id.startsWith('local_')) {
                    return rest;
                }
                return loc;
            });
        }
        // Handle WiFi networks
        if (securityData.allowedWifiNetworks !== undefined) {
            updateData['settings.securitySettings.allowedWifiNetworks'] = securityData.allowedWifiNetworks.map((wifi) => {
                const { _id, ...rest } = wifi;
                // Strip temporary frontend IDs
                if (_id && _id.startsWith('local_')) {
                    return rest;
                }
                return wifi;
            });
        }
        const organization = await organization_dal_1.OrganizationDAL.updateById(organizationId, updateData);
        if (!organization) {
            throw new Error('Organization not found');
        }
        return organization;
    }
}
exports.SettingsService = SettingsService;
//# sourceMappingURL=settings.service.js.map