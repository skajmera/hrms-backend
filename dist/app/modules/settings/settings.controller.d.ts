import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from "../../../shared/middlewares/auth.middleware";
/**
 * Settings Controller
 */
export declare class SettingsController {
    /**
     * Update company info
     * PUT /api/v1/settings/company-info
     */
    static updateCompanyInfo(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update locale settings
     * PUT /api/v1/settings/locale
     */
    static updateLocale(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Create work schedule
     * POST /api/v1/settings/work-schedules
     */
    static createWorkSchedule(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get work schedules
     * GET /api/v1/settings/work-schedules
     */
    static getWorkSchedules(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get work schedule by ID
     * GET /api/v1/settings/work-schedules/:id
     */
    static getWorkScheduleById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update work schedule
     * PUT /api/v1/settings/work-schedules/:id
     */
    static updateWorkSchedule(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Delete work schedule
     * DELETE /api/v1/settings/work-schedules/:id
     */
    static deleteWorkSchedule(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get notification settings
     * GET /api/v1/settings/notifications
     */
    static getNotifications(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update notification settings
     * PUT /api/v1/settings/notifications
     */
    static updateNotifications(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Create designation
     * POST /api/v1/settings/designations
     */
    static createDesignation(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get designations
     * GET /api/v1/settings/designations
     */
    static getDesignations(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get designation by ID
     * GET /api/v1/settings/designations/:id
     */
    static getDesignationById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update designation
     * PUT /api/v1/settings/designations/:id
     */
    static updateDesignation(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Delete designation
     * DELETE /api/v1/settings/designations/:id
     */
    static deleteDesignation(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Change password
     * POST /api/v1/settings/change-password
     */
    static changePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get security settings
     * GET /api/v1/settings/security
     */
    static getSecuritySettings(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update security settings
     * PUT /api/v1/settings/security
     */
    static updateSecuritySettings(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=settings.controller.d.ts.map