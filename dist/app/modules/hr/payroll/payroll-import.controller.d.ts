import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
export declare class PayrollImportController {
    /**
     * Upload and import payroll file
     * POST /api/v1/hr/payroll/import
     */
    static importPayroll(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Download sample template
     * GET /api/v1/hr/payroll/template
     */
    static downloadTemplate(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Preview payroll data from uploaded file
     * POST /api/v1/hr/payroll/preview
     */
    static previewPayroll(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=payroll-import.controller.d.ts.map