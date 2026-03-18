import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
/**
 * Offboarding Controller
 */
export declare class OffboardingController {
    /**
     * Create resignation request
     * POST /api/v1/hr/offboarding
     */
    static createResignation(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get all resignations
     * GET /api/v1/hr/offboarding
     */
    static getAllResignations(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get resignation by ID
     * GET /api/v1/hr/offboarding/:id
     */
    static getResignationById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update resignation
     * PUT /api/v1/hr/offboarding/:id
     */
    static updateResignation(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Delete resignation
     * DELETE /api/v1/hr/offboarding/:id
     */
    static deleteResignation(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Approve resignation
     * POST /api/v1/hr/offboarding/:id/approve
     */
    static approveResignation(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Reject resignation
     * POST /api/v1/hr/offboarding/:id/reject
     */
    static rejectResignation(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Withdraw resignation
     * POST /api/v1/hr/offboarding/:id/withdraw
     */
    static withdrawResignation(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Complete offboarding
     * POST /api/v1/hr/offboarding/:id/complete
     */
    static completeOffboarding(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update clearance
     * PUT /api/v1/hr/offboarding/:id/clearance
     */
    static updateClearance(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Schedule exit interview
     * PUT /api/v1/hr/offboarding/:id/exit-interview
     */
    static scheduleExitInterview(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get pending resignations
     * GET /api/v1/hr/offboarding/pending
     */
    static getPendingResignations(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get notice period employees
     * GET /api/v1/hr/offboarding/notice-period
     */
    static getNoticePeriodEmployees(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get statistics
     * GET /api/v1/hr/offboarding/stats
     */
    static getStats(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=offboarding.controller.d.ts.map