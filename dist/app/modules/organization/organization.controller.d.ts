import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../../shared/middlewares/auth.middleware';
/**
 * Organization Controller
 */
export declare class OrganizationController {
    /**
     * Create organization
     * POST /api/v1/organization
     */
    static createOrganization(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get all organizations
     * GET /api/v1/organization
     */
    static getAllOrganizations(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get organization by ID
     * GET /api/v1/organization/:id
     */
    static getOrganizationById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get user's organization
     * GET /api/v1/organization/my-organization
     */
    static getMyOrganization(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update organization
     * PUT /api/v1/organization/:id
     */
    static updateOrganization(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Delete organization
     * DELETE /api/v1/organization/:id
     */
    static deleteOrganization(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update settings
     * PUT /api/v1/organization/:id/settings
     */
    static updateSettings(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Add admin
     * POST /api/v1/organization/:id/admins
     */
    static addAdmin(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Remove admin
     * DELETE /api/v1/organization/:id/admins/:adminId
     */
    static removeAdmin(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Add office location
     */
    static addOfficeLocation(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update office location
     */
    static updateOfficeLocation(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Remove office location
     */
    static removeOfficeLocation(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Add WiFi network
     */
    static addWifiNetwork(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update WiFi network
     */
    static updateWifiNetwork(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Remove WiFi network
     */
    static removeWifiNetwork(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update subscription
     * PUT /api/v1/organization/:id/subscription
     */
    static updateSubscription(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Verify organization
     * POST /api/v1/organization/:id/verify
     */
    static verifyOrganization(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=organization.controller.d.ts.map