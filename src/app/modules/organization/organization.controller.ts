import { Request, Response, NextFunction } from 'express';
import { OrganizationService } from './organization.service';
import { sendSuccessResponse } from '../../../shared/utils/response';
import { HTTP_STATUS } from '../../../config/constants';
import { AuthRequest } from '../../../shared/middlewares/auth.middleware';
/**
 * Organization Controller
 */

export class OrganizationController {
  /**
   * Create organization
   * POST /api/v1/organization
   */
  static async createOrganization(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizationData = req.body;
      const ownerId = req.user?._id?.toString();

      if (!ownerId) throw new Error('Not authenticated');
      const organization = await OrganizationService.createOrganization(organizationData, ownerId);

      sendSuccessResponse(res, 'Organization created successfully',
        organization
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all organizations
   * GET /api/v1/organization
   */
  static async getAllOrganizations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, page, limit, sortBy, sortOrder } = req.query;

      const filters: any = {};
      if (search) {
        filters.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      const options = {
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 10,
        sortBy: (sortBy as string) || 'createdAt',
        sortOrder: (sortOrder as 'asc' | 'desc') || 'desc'
      };

      const result = await OrganizationService.getAllOrganizations(filters, options);

      sendSuccessResponse(res, 'Organizations retrieved successfully',
        result,
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get organization by ID
   * GET /api/v1/organization/:id
   */
  static async getOrganizationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const organization = await OrganizationService.getOrganizationById(id);

      sendSuccessResponse(res, 'Organization retrieved successfully',
        organization
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user's organization
   * GET /api/v1/organization/my-organization
   */
  static async getMyOrganization(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?._id?.toString();
      const organizationId = req.user?.organizationId?.toString?.() ?? req.user?.organizationId;
      if (!userId) throw new Error('Not authenticated');
      const organization = await OrganizationService.getUserOrganization({ userId, organizationId });

      sendSuccessResponse(res, 'Organization retrieved successfully',
        organization
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update organization
   * PUT /api/v1/organization/:id
   */
  static async updateOrganization(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const organization = await OrganizationService.updateOrganization(id, updateData);

      sendSuccessResponse(res, 'Organization updated successfully',
        organization
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete organization
   * DELETE /api/v1/organization/:id
   */
  static async deleteOrganization(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await OrganizationService.deleteOrganization(id);

      sendSuccessResponse(res, 'Organization deleted successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update settings
   * PUT /api/v1/organization/:id/settings
   */
  static async updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const settings = req.body.settings;

      const organization = await OrganizationService.updateSettings(id, settings);

      sendSuccessResponse(res, 'Settings updated successfully',
        organization
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add admin
   * POST /api/v1/organization/:id/admins
   */
  static async addAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { adminId } = req.body;

      const organization = await OrganizationService.addAdmin(id, adminId);

      sendSuccessResponse(res, 'Admin added successfully',
        organization
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove admin
   * DELETE /api/v1/organization/:id/admins/:adminId
   */
  static async removeAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, adminId } = req.params;

      const organization = await OrganizationService.removeAdmin(id, adminId);

      sendSuccessResponse(res, 'Admin removed successfully',
        organization
      );
    } catch (error) {
      next(error);
    }
  }

  // --- Security Settings: Office Locations ---

  /**
   * Add office location
   */
  static async addOfficeLocation(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const organization = await OrganizationService.addOfficeLocation(req.user.organizationId as string, req.body);
      sendSuccessResponse(res, 'Office location added successfully', organization.settings.securitySettings.officeLocations);
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Update office location
   */
  static async updateOfficeLocation(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const organization = await OrganizationService.updateOfficeLocation(req.user.organizationId as string, req.params.id, req.body);
      sendSuccessResponse(res, 'Office location updated successfully', organization.settings.securitySettings.officeLocations);
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Remove office location
   */
  static async removeOfficeLocation(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const organization = await OrganizationService.removeOfficeLocation(req.user.organizationId as string, req.params.id);
      sendSuccessResponse(res, 'Office location removed successfully', organization.settings.securitySettings.officeLocations);
    } catch (error: any) {
      next(error);
    }
  }

  // --- Security Settings: WiFi Networks ---

  /**
   * Add WiFi network
   */
  static async addWifiNetwork(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const organization = await OrganizationService.addWifiNetwork(req.user.organizationId as string, req.body);
      sendSuccessResponse(res, 'WiFi network added successfully', organization.settings.securitySettings.allowedWifiNetworks);
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Update WiFi network
   */
  static async updateWifiNetwork(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const organization = await OrganizationService.updateWifiNetwork(req.user.organizationId as string, req.params.id, req.body);
      sendSuccessResponse(res, 'WiFi network updated successfully', organization.settings.securitySettings.allowedWifiNetworks);
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Remove WiFi network
   */
  static async removeWifiNetwork(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const organization = await OrganizationService.removeWifiNetwork(req.user.organizationId as string, req.params.id);
      sendSuccessResponse(res, 'WiFi network removed successfully', organization.settings.securitySettings.allowedWifiNetworks);
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Update subscription
   * PUT /api/v1/organization/:id/subscription
   */
  static async updateSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const subscription = req.body.subscription;

      const organization = await OrganizationService.updateSubscription(id, subscription);

      sendSuccessResponse(res, 'Subscription updated successfully',
        organization
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify organization
   * POST /api/v1/organization/:id/verify
   */
  static async verifyOrganization(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const organization = await OrganizationService.verifyOrganization(id);

      sendSuccessResponse(res, 'Organization verified successfully',
        organization
      );
    } catch (error) {
      next(error);
    }
  }
}