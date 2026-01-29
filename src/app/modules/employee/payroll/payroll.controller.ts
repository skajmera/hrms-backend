import { Response, NextFunction } from 'express';
import { employeePayrollService } from './payroll.service';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
import { sendSuccessResponse, sendErrorResponse } from '../../../../shared/utils/response';
import { HTTP_STATUS } from '../../../../config/constants';

export class EmployeePayrollController {
  async getMyPayslips(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { limit = 12 } = req.query;
      const payslips = await employeePayrollService.getMyPayslips(req.user._id.toString(), Number(limit));
      sendSuccessResponse(res, 'Payslips retrieved successfully', payslips);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async getMyPayslip(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const payslip = await employeePayrollService.getMyPayslip(req.user._id.toString(), req.params.id);
      sendSuccessResponse(res, 'Payslip retrieved successfully', payslip);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
  }
}

export const employeePayrollController = new EmployeePayrollController();