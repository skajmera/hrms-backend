import { Response, NextFunction } from 'express';
import { payrollService } from './payroll.service';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
import { sendSuccessResponse, sendErrorResponse, sendPaginatedResponse } from '../../../../shared/utils/response';
import { HTTP_STATUS } from '../../../../config/constants';
import path from 'path';
export class PayrollController {
  async generatePayroll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const payroll = await payrollService.generatePayroll({ ...req.body, generatedBy: req.user._id });
      sendSuccessResponse(res, 'Payroll generated successfully', payroll, HTTP_STATUS.CREATED);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  async getPayrollById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const payroll = await payrollService.getPayrollById(req.params.id);
      sendSuccessResponse(res, 'Payroll retrieved successfully', payroll);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
  }

  async getAllPayroll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = req.query;
      const result = await payrollService.getAllPayroll(filters, { page: Number(page), limit: Number(limit), sortBy: sortBy as string, sortOrder: sortOrder as 'asc' | 'desc' });
      sendPaginatedResponse(res, result.records, result.total, Number(page), Number(limit), 'Payroll records retrieved successfully');
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getUserPayrollHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const { limit = 12 } = req.query;
      const history = await payrollService.getUserPayrollHistory(userId, Number(limit));
      sendSuccessResponse(res, 'Payroll history retrieved successfully', history);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getPayrollStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { month, year } = req.params;
      const stats = await payrollService.getPayrollStats(Number(month), Number(year));
      sendSuccessResponse(res, 'Payroll statistics retrieved successfully', stats);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async markAsPaid(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const payroll = await payrollService.markAsPaid(req.params.id, req.body);
      sendSuccessResponse(res, 'Payroll marked as paid successfully', payroll);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  /**
   * Download payslip PDF
   */
  async downloadPayslip(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const pdfPath = await payrollService.downloadPayslip(req.params.id);
      const fullPath = path.join(process.cwd(), pdfPath);
      
      res.download(fullPath, (err) => {
        if (err) {
          sendErrorResponse(res, 'Failed to download payslip', HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
      });
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
  }

  /**
   * Regenerate payslip
   */
  async regeneratePayslip(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const pdfPath = await payrollService.regeneratePayslip(req.params.id);
      sendSuccessResponse(res, 'Payslip regenerated successfully', { path: pdfPath });
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  /**
   * Bulk generate payroll
   */
  async bulkGeneratePayroll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { month, year, departmentId } = req.body;
      const results = await payrollService.bulkGeneratePayroll(month, year, departmentId);
      
      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;

      sendSuccessResponse(res, `Payroll generation completed. Success: ${successCount}, Failed: ${failCount}`, results);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }
}

export const payrollController = new PayrollController();