import { OrganizationDAL } from '../../../shared/dal/organization.dal';
import { userDAL } from '../../../shared/dal/user.dal';
import { WorkScheduleModel } from '../../../shared/models/work-schedule.model';
import { NotificationSettingsModel } from '../../../shared/models/notification-settings.model';
import { DesignationModel } from '../../../shared/models/designation.model';
import { IOrganization } from '../../../shared/interfaces/organization.interface';
import { IWorkSchedule, INotificationSettings, IDesignation } from '../../../shared/interfaces/settings.interface';
import bcrypt from 'bcryptjs';

/**
 * Settings Service
 */

export class SettingsService {
  /**
   * Update company info
   */
  static async updateCompanyInfo(organizationId: string, updateData: Partial<IOrganization>): Promise<IOrganization> {
    const organization = await OrganizationDAL.updateById(organizationId, updateData);
    if (!organization) {
      throw new Error('Organization not found');
    }
    return organization;
  }

  /**
   * Update locale settings
   */
  static async updateLocaleSettings(organizationId: string, localeData: any): Promise<IOrganization> {
    const updateData: any = {};

    if (localeData.country) updateData['settings.locale.country'] = localeData.country;
    if (localeData.timezone) updateData['settings.locale.timezone'] = localeData.timezone;
    if (localeData.timeFormat) updateData['settings.locale.timeFormat'] = localeData.timeFormat;
    if (localeData.dateFormat) updateData['settings.locale.dateFormat'] = localeData.dateFormat;

    if (localeData.nameFormat) {
      let format = localeData.nameFormat.toUpperCase().replace('-', '_');
      if (['FIRST_LAST', 'LAST_FIRST'].includes(format)) {
        updateData['settings.locale.nameFormat'] = format;
      }
    }

    const organization = await OrganizationDAL.updateById(organizationId, updateData);
    if (!organization) {
      throw new Error('Organization not found');
    }
    return organization;
  }

  /**
   * Create work schedule
   */
  static async createWorkSchedule(scheduleData: Partial<IWorkSchedule>, createdBy: string): Promise<IWorkSchedule> {
    // If this is set as default, unset other defaults
    if (scheduleData.isDefault) {
      await WorkScheduleModel.updateMany(
        { organizationId: scheduleData.organizationId, isDefault: true },
        { isDefault: false }
      );
    }

    const schedule = await WorkScheduleModel.create({
      ...scheduleData,
      createdBy
    });

    return schedule;
  }

  /**
   * Get all work schedules
   */
  static async getWorkSchedules(organizationId: string): Promise<IWorkSchedule[]> {
    return await WorkScheduleModel.find({ organizationId })
      .populate('createdBy', 'firstName lastName')
      .sort({ isDefault: -1, createdAt: -1 });
  }

  /**
   * Get work schedule by ID
   */
  static async getWorkScheduleById(scheduleId: string): Promise<IWorkSchedule> {
    const schedule = await WorkScheduleModel.findById(scheduleId);
    if (!schedule) {
      throw new Error('Work schedule not found');
    }
    return schedule;
  }

  /**
   * Update work schedule
   */
  static async updateWorkSchedule(scheduleId: string, updateData: Partial<IWorkSchedule>): Promise<IWorkSchedule> {
    const schedule = await WorkScheduleModel.findByIdAndUpdate(scheduleId, updateData, { new: true });
    if (!schedule) {
      throw new Error('Work schedule not found');
    }
    return schedule;
  }

  /**
   * Delete work schedule
   */
  static async deleteWorkSchedule(scheduleId: string): Promise<void> {
    const schedule = await WorkScheduleModel.findByIdAndDelete(scheduleId);
    if (!schedule) {
      throw new Error('Work schedule not found');
    }
  }

  /**
   * Get notification settings
   */
  static async getNotificationSettings(organizationId: string, userId: string): Promise<INotificationSettings> {
    let settings = await NotificationSettingsModel.findOne({ organizationId, userId });

    if (!settings) {
      // Create default settings
      settings = await NotificationSettingsModel.create({
        organizationId,
        userId
      });
    }

    return settings;
  }

  /**
   * Update notification settings
   */
  static async updateNotificationSettings(
    organizationId: string,
    userId: string,
    updateData: Partial<INotificationSettings>
  ): Promise<INotificationSettings> {
    const settings = await NotificationSettingsModel.findOneAndUpdate(
      { organizationId, userId },
      { $set: updateData },
      { new: true, upsert: true }
    );

    return settings;
  }

  /**
   * Create designation
   */
  static async createDesignation(designationData: Partial<IDesignation>, createdBy: string): Promise<IDesignation> {
    // Check if code already exists
    const existing = await DesignationModel.findOne({
      organizationId: designationData.organizationId,
      code: designationData.code
    });

    if (existing) {
      throw new Error('Designation with this code already exists');
    }

    const designation = await DesignationModel.create({
      ...designationData,
      createdBy
    });

    return designation;
  }

  /**
   * Get all designations
   */
  static async getDesignations(organizationId: string): Promise<IDesignation[]> {
    return await DesignationModel.find({ organizationId, isActive: true })
      .populate('parentDesignation', 'name code')
      .populate('associatedUsers', 'firstName lastName email profilePicture')
      .sort({ level: 1, name: 1 });
  }

  /**
   * Get designation by ID
   */
  static async getDesignationById(designationId: string): Promise<IDesignation> {
    const designation = await DesignationModel.findById(designationId)
      .populate('associatedUsers', 'firstName lastName email');
    if (!designation) {
      throw new Error('Designation not found');
    }
    return designation;
  }

  /**
   * Update designation
   */
  static async updateDesignation(designationId: string, updateData: Partial<IDesignation>): Promise<IDesignation> {
    const designation = await DesignationModel.findByIdAndUpdate(designationId, updateData, { new: true });
    if (!designation) {
      throw new Error('Designation not found');
    }
    return designation;
  }

  /**
   * Delete designation
   */
  static async deleteDesignation(designationId: string): Promise<void> {
    const designation = await DesignationModel.findByIdAndUpdate(
      designationId,
      { isActive: false },
      { new: true }
    );
    if (!designation) {
      throw new Error('Designation not found');
    }
  }

  /**
   * Change password
   */
  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    // Get user with password
    const user = await userDAL.findById(userId, true);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await userDAL.update(userId, { password: hashedPassword });
  }

  /**
   * Get security settings
   */
  static async getSecuritySettings(organizationId: string, userId: string): Promise<any> {
    console.log('Fetching security settings for organizationId:', organizationId);
    const [organization, user] = await Promise.all([
      OrganizationDAL.findById(organizationId),
      userDAL.findById(userId)
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
  static async updateSecuritySettings(organizationId: string, securityData: any): Promise<IOrganization> {
    const updateData: any = {};
    if (securityData.requireFaceCapture !== undefined) {
      updateData['settings.securitySettings.requireFaceCapture'] = securityData.requireFaceCapture;
    }
    if (securityData.blockMockLocations !== undefined) {
      updateData['settings.securitySettings.blockMockLocations'] = securityData.blockMockLocations;
    }

    // Handle office locations
    if (securityData.officeLocations !== undefined) {
      updateData['settings.securitySettings.officeLocations'] = securityData.officeLocations.map((loc: any) => {
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
      updateData['settings.securitySettings.allowedWifiNetworks'] = securityData.allowedWifiNetworks.map((wifi: any) => {
        const { _id, ...rest } = wifi;
        // Strip temporary frontend IDs
        if (_id && _id.startsWith('local_')) {
          return rest;
        }
        return wifi;
      });
    }

    const organization = await OrganizationDAL.updateById(organizationId, updateData);
    if (!organization) {
      throw new Error('Organization not found');
    }
    return organization;
  }
}

