"use strict";
// import { Response, NextFunction } from 'express';
// import { payrollService } from './payroll.service';
// import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
// import { sendSuccessResponse, sendErrorResponse, sendPaginatedResponse } from '../../../../shared/utils/response';
// import { HTTP_STATUS } from '../../../../config/constants';
// import path from 'path';
// export class PayrollController {
//   async generatePayroll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const payroll = await payrollService.generatePayroll({ ...req.body, generatedBy: req.user._id });
//       sendSuccessResponse(res, 'Payroll generated successfully', payroll, HTTP_STATUS.CREATED);
//     } catch (error: any) {
//       sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
//     }
//   }
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollController = void 0;
const payroll_service_1 = require("./payroll.service");
const response_1 = require("../../../../shared/utils/response");
/**
 * Payroll Controller
 * Handles HTTP requests for payroll operations
 */
class PayrollController {
    /**
     * Create payroll
     * POST /api/v1/hr/payroll
     */
    static async createPayroll(req, res, next) {
        try {
            const payrollData = req.body;
            const generatedBy = req.user?.id;
            const payroll = await payroll_service_1.PayrollService.createPayroll(payrollData, generatedBy);
            (0, response_1.sendSuccessResponse)(res, 'Payroll created successfully as draft', payroll);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get all payrolls
     * GET /api/v1/hr/payroll
     */
    static async getAllPayrolls(req, res, next) {
        try {
            const { month, year, status, search, page, limit, sortBy, sortOrder } = req.query;
            const filters = {};
            if (month)
                filters.month = parseInt(month);
            if (year)
                filters.year = parseInt(year);
            if (status)
                filters.paymentStatus = status;
            const options = {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                sortBy: sortBy || 'createdAt',
                sortOrder: sortOrder || 'desc'
            };
            const result = await payroll_service_1.PayrollService.getAllPayrolls(filters, options);
            (0, response_1.sendSuccessResponse)(res, 'Payrolls retrieved successfully', result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get payroll by ID
     * GET /api/v1/hr/payroll/:id
     */
    static async getPayrollById(req, res, next) {
        try {
            const { id } = req.params;
            const payroll = await payroll_service_1.PayrollService.getPayrollById(id);
            (0, response_1.sendSuccessResponse)(res, 'Payroll retrieved successfully', payroll);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update payroll
     * PUT /api/v1/hr/payroll/:id
     */
    static async updatePayroll(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const payroll = await payroll_service_1.PayrollService.updatePayroll(id, updateData);
            (0, response_1.sendSuccessResponse)(res, 'Payroll updated successfully', payroll);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Delete payroll
     * DELETE /api/v1/hr/payroll/:id
     */
    static async deletePayroll(req, res, next) {
        try {
            const { id } = req.params;
            await payroll_service_1.PayrollService.deletePayroll(id);
            (0, response_1.sendSuccessResponse)(res, 'Payroll deleted successfully');
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Generate payslip (move from draft to generated)
     * POST /api/v1/hr/payroll/:id/generate
     */
    static async generatePayslip(req, res, next) {
        try {
            const { id } = req.params;
            const approvedBy = req.user?.id;
            const payroll = await payroll_service_1.PayrollService.generatePayslip(id, approvedBy);
            (0, response_1.sendSuccessResponse)(res, 'Payslip generated successfully', payroll);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Mark payroll as paid
     * POST /api/v1/hr/payroll/:id/mark-paid
     */
    static async markAsPaid(req, res, next) {
        try {
            const { id } = req.params;
            const paymentDetails = req.body;
            const payroll = await payroll_service_1.PayrollService.markAsPaid(id, paymentDetails);
            (0, response_1.sendSuccessResponse)(res, 'Payroll marked as paid successfully', payroll);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get payroll statistics
     * GET /api/v1/hr/payroll/stats
     */
    static async getPayrollStats(req, res, next) {
        try {
            const { month, year } = req.query;
            const currentDate = new Date();
            const currentMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
            const currentYear = year ? parseInt(year) : currentDate.getFullYear();
            const stats = await payroll_service_1.PayrollService.getPayrollStats(currentMonth, currentYear);
            (0, response_1.sendSuccessResponse)(res, 'Payroll statistics retrieved successfully', stats);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get draft payrolls
     * GET /api/v1/hr/payroll/drafts
     */
    static async getDrafts(req, res, next) {
        try {
            const { month, year } = req.query;
            const drafts = await payroll_service_1.PayrollService.getDrafts(month ? parseInt(month) : undefined, year ? parseInt(year) : undefined);
            (0, response_1.sendSuccessResponse)(res, 'Draft payrolls retrieved successfully', drafts);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get pending payrolls
     * GET /api/v1/hr/payroll/pending
     */
    static async getPending(req, res, next) {
        try {
            const { month, year } = req.query;
            const pending = await payroll_service_1.PayrollService.getPending(month ? parseInt(month) : undefined, year ? parseInt(year) : undefined);
            (0, response_1.sendSuccessResponse)(res, 'Pending payrolls retrieved successfully', pending);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Bulk generate payrolls
     * POST /api/v1/hr/payroll/bulk-generate
     */
    static async bulkGenerate(req, res, next) {
        try {
            const { userIds, month, year } = req.body;
            const generatedBy = req.user._id.toString();
            const payrolls = await payroll_service_1.PayrollService.bulkGeneratePayrolls(userIds, month, year, generatedBy);
            (0, response_1.sendSuccessResponse)(res, `${payrolls.length} payrolls generated successfully`, payrolls);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Revise payroll
     * POST /api/v1/hr/payroll/:id/revise
     */
    static async revisePayroll(req, res, next) {
        try {
            const { id } = req.params;
            const { revisionReason, ...revisionData } = req.body;
            const payroll = await payroll_service_1.PayrollService.revisePayroll(id, revisionData, revisionReason);
            (0, response_1.sendSuccessResponse)(res, 'Payroll revised successfully', payroll);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Download payslip
     * GET /api/v1/hr/payroll/:id/download
     */
    static async downloadPayslip(req, res, next) {
        try {
            const { id } = req.params;
            const filePath = await payroll_service_1.PayrollService.downloadPayslip(id);
            (0, response_1.sendSuccessResponse)(res, 'Payslip download link generated', { filePath });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PayrollController = PayrollController;
//# sourceMappingURL=payroll.controller.js.map