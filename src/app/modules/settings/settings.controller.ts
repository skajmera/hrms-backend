import { Request, Response, NextFunction } from 'express';
import { SettingsService } from './settings.service';
import { sendSuccessResponse } from '../../../shared/utils/response';
import { HTTP_STATUS } from '../../../config/constants';
import { AuthRequest } from "../../../shared/middlewares/auth.middleware";
/**
 * Settings Controller
 */

export class SettingsController {
  /**
   * Update company info
   * PUT /api/v1/settings/company-info
   */
  static async updateCompanyInfo(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizationId = req.user?.organizationId;
      const updateData = req.body;

      const organization = await SettingsService.updateCompanyInfo(organizationId, updateData);

      sendSuccessResponse(res, 'Company information updated successfully',
        organization
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update locale settings
   * PUT /api/v1/settings/locale
   */
  static async updateLocale(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizationId = req.user?.organizationId;
      const localeData = req.body;

      const organization = await SettingsService.updateLocaleSettings(organizationId, localeData);

      sendSuccessResponse(res, 'Locale settings updated successfully',
        organization
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create work schedule
   * POST /api/v1/settings/work-schedules
   */
  static async createWorkSchedule(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizationId = req.user?.organizationId;
      const createdBy = req.user?.id;
      const scheduleData = { ...req.body, organizationId };

      const schedule = await SettingsService.createWorkSchedule(scheduleData, createdBy);

      sendSuccessResponse(res, 'Work schedule created successfully',
        schedule
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get work schedules
   * GET /api/v1/settings/work-schedules
   */
  static async getWorkSchedules(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizationId = req.user?.organizationId;
      const schedules = await SettingsService.getWorkSchedules(organizationId);

      sendSuccessResponse(res, 'Work schedules retrieved successfully',
        schedules
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get work schedule by ID
   * GET /api/v1/settings/work-schedules/:id
   */
  static async getWorkScheduleById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const schedule = await SettingsService.getWorkScheduleById(id);

      sendSuccessResponse(res, 'Work schedule retrieved successfully',
        schedule
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update work schedule
   * PUT /api/v1/settings/work-schedules/:id
   */
  static async updateWorkSchedule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const schedule = await SettingsService.updateWorkSchedule(id, updateData);

      sendSuccessResponse(res, 'Work schedule updated successfully',
        schedule
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete work schedule
   * DELETE /api/v1/settings/work-schedules/:id
   */
  static async deleteWorkSchedule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await SettingsService.deleteWorkSchedule(id);

      sendSuccessResponse(res, 'Work schedule deleted successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get notification settings
   * GET /api/v1/settings/notifications
   */
  static async getNotifications(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizationId = req.user?.organizationId;
      const userId = req.user?.id;

      const settings = await SettingsService.getNotificationSettings(organizationId, userId);

      sendSuccessResponse(res, 'Notification settings retrieved successfully',
        settings
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update notification settings
   * PUT /api/v1/settings/notifications
   */
  static async updateNotifications(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizationId = req.user?.organizationId;
      const userId = req.user?.id;
      const updateData = req.body;

      const settings = await SettingsService.updateNotificationSettings(organizationId, userId, updateData);

      sendSuccessResponse(res, 'Notification settings updated successfully',
        settings
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create designation
   * POST /api/v1/settings/designations
   */
  static async createDesignation(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizationId = req.user?.organizationId;
      const createdBy = req.user?.id;
      const designationData = { ...req.body, organizationId };

      const designation = await SettingsService.createDesignation(designationData, createdBy);

      sendSuccessResponse(res, 'Designation created successfully',
        designation
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get designations
   * GET /api/v1/settings/designations
   */
  static async getDesignations(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizationId = req.user?.organizationId;
      const designations = await SettingsService.getDesignations(organizationId);

      sendSuccessResponse(res, 'Designations retrieved successfully',
        designations
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get designation by ID
   * GET /api/v1/settings/designations/:id
   */
  static async getDesignationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const designation = await SettingsService.getDesignationById(id);

      sendSuccessResponse(res, 'Designation retrieved successfully',
        designation
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update designation
   * PUT /api/v1/settings/designations/:id
   */
  static async updateDesignation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const designation = await SettingsService.updateDesignation(id, updateData);

      sendSuccessResponse(res, 'Designation updated successfully',
        designation
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete designation
   * DELETE /api/v1/settings/designations/:id
   */
  static async deleteDesignation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await SettingsService.deleteDesignation(id);

      sendSuccessResponse(res,
        'Designation deleted successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change password
   * POST /api/v1/settings/change-password
   */
  static async changePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const { currentPassword, newPassword } = req.body;

      await SettingsService.changePassword(userId, currentPassword, newPassword);

      sendSuccessResponse(res, 'Password changed successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get security settings
   * GET /api/v1/settings/security
   */
  static async getSecuritySettings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizationId = req.user?.organizationId;
      const userId = req.user?.id;

      const settings = await SettingsService.getSecuritySettings(organizationId, userId);

      sendSuccessResponse(res, 'Security settings retrieved successfully', settings);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update security settings
   * PUT /api/v1/settings/security
   */
  static async updateSecuritySettings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizationId = req.user?.organizationId;
      const securityData = req.body;

      const organization = await SettingsService.updateSecuritySettings(organizationId, securityData);

      sendSuccessResponse(res, 'Security settings updated successfully', organization.settings.securitySettings);
    } catch (error) {
      next(error);
    }
  }
}