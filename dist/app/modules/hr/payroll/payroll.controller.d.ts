import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
/**
 * Payroll Controller
 * Handles HTTP requests for payroll operations
 */
export declare class PayrollController {
    /**
     * Create payroll
     * POST /api/v1/hr/payroll
     */
    static createPayroll(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get all payrolls
     * GET /api/v1/hr/payroll
     */
    static getAllPayrolls(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get payroll by ID
     * GET /api/v1/hr/payroll/:id
     */
    static getPayrollById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update payroll
     * PUT /api/v1/hr/payroll/:id
     */
    static updatePayroll(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Delete payroll
     * DELETE /api/v1/hr/payroll/:id
     */
    static deletePayroll(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Generate payslip (move from draft to generated)
     * POST /api/v1/hr/payroll/:id/generate
     */
    static generatePayslip(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Mark payroll as paid
     * POST /api/v1/hr/payroll/:id/mark-paid
     */
    static markAsPaid(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get payroll statistics
     * GET /api/v1/hr/payroll/stats
     */
    static getPayrollStats(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get draft payrolls
     * GET /api/v1/hr/payroll/drafts
     */
    static getDrafts(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get pending payrolls
     * GET /api/v1/hr/payroll/pending
     */
    static getPending(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Bulk generate payrolls
     * POST /api/v1/hr/payroll/bulk-generate
     */
    static bulkGenerate(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Revise payroll
     * POST /api/v1/hr/payroll/:id/revise
     */
    static revisePayroll(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Download payslip
     * GET /api/v1/hr/payroll/:id/download
     */
    /**
     * Download payslip PDF
     */
    static downloadPayslip(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    static getUserPayrollHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=payroll.controller.d.ts.map