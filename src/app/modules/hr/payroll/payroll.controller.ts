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

//   async getPayrollById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const payroll = await payrollService.getPayrollById(req.params.id);
//       sendSuccessResponse(res, 'Payroll retrieved successfully', payroll);
//     } catch (error: any) {
//       sendErrorResponse(res, error.message, HTTP_STATUS.NOT_FOUND);
//     }
//   }

//   async getAllPayroll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = req.query;
//       const result = await payrollService.getAllPayroll(filters, { page: Number(page), limit: Number(limit), sortBy: sortBy as string, sortOrder: sortOrder as 'asc' | 'desc' });
//       sendPaginatedResponse(res, result.records, result.total, Number(page), Number(limit), 'Payroll records retrieved successfully');
//     } catch (error: any) {
//       sendErrorResponse(res, error.message);
//     }
//   }

//   async getUserPayrollHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const { userId } = req.params;
//       const { limit = 12 } = req.query;
//       const history = await payrollService.getUserPayrollHistory(userId, Number(limit));
//       sendSuccessResponse(res, 'Payroll history retrieved successfully', history);
//     } catch (error: any) {
//       sendErrorResponse(res, error.message);
//     }
//   }

//   async getPayrollStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const { month, year } = req.params;
//       const stats = await payrollService.getPayrollStats(Number(month), Number(year));
//       sendSuccessResponse(res, 'Payroll statistics retrieved successfully', stats);
//     } catch (error: any) {
//       sendErrorResponse(res, error.message);
//     }
//   }

//   async markAsPaid(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const payroll = await payrollService.markAsPaid(req.params.id, req.body);
//       sendSuccessResponse(res, 'Payroll marked as paid successfully', payroll);
//     } catch (error: any) {
//       sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
//     }
//   }

//   /**
//    * Download payslip PDF
//    */
//   async downloadPayslip(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const pdfPath = await payrollService.downloadPayslip(req.params.id);
//       const fullPath = path.join(process.cwd(), pdfPath);
      
//       res.download(fullPath, (err) => {
//         if (err) {
//           sendErrorResponse(res, 'Failed to download payslip', HTTP_STATUS.INTERNAL_SERVER_ERROR);
//         }
//       });
//     } catch (error: any) {
//       sendErrorResponse(res, error.message, HTTP_STATUS.NOT_FOUND);
//     }
//   }

//   /**
//    * Regenerate payslip
//    */
//   async regeneratePayslip(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const pdfPath = await payrollService.regeneratePayslip(req.params.id);
//       sendSuccessResponse(res, 'Payslip regenerated successfully', { path: pdfPath });
//     } catch (error: any) {
//       sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
//     }
//   }

//   /**
//    * Bulk generate payroll
//    */
//   async bulkGeneratePayroll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const { month, year, departmentId } = req.body;
//       const results = await payrollService.bulkGeneratePayroll(month, year, departmentId);
      
//       const successCount = results.filter(r => r.success).length;
//       const failCount = results.filter(r => !r.success).length;

//       sendSuccessResponse(res, `Payroll generation completed. Success: ${successCount}, Failed: ${failCount}`, results);
//     } catch (error: any) {
//       sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
//     }
//   }
// }

// export const payrollController = new PayrollController();


import { Request, Response, NextFunction } from 'express';
import { PayrollService } from './payroll.service';
import { sendSuccessResponse, sendErrorResponse } from '../../../../shared/utils/response';
import { HTTP_STATUS } from '../../../../config/constants';
import path from 'path';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
/**
 * Payroll Controller
 * Handles HTTP requests for payroll operations
 */

export class PayrollController {
  /**
   * Create payroll
   * POST /api/v1/hr/payroll
   */
  static async createPayroll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const payrollData = req.body;
      const generatedBy = req.user?.id;

      const payroll = await PayrollService.createPayroll(payrollData, generatedBy);

      sendSuccessResponse(res,'Payroll created successfully as draft',
       payroll
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all payrolls
   * GET /api/v1/hr/payroll
   */
  static async getAllPayrolls(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { month, year, status, search, page, limit, sortBy, sortOrder } = req.query;

      const filters: any = {};
      if (month) filters.month = parseInt(month as string);
      if (year) filters.year = parseInt(year as string);
      if (status) filters.paymentStatus = status;

      const options = {
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 10,
        sortBy: (sortBy as string) || 'createdAt',
        sortOrder: (sortOrder as 'asc' | 'desc') || 'desc'
      };

      const result = await PayrollService.getAllPayrolls(filters, options);

      sendSuccessResponse(res,'Payrolls retrieved successfully',
         result,
       );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get payroll by ID
   * GET /api/v1/hr/payroll/:id
   */
  static async getPayrollById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const payroll = await PayrollService.getPayrollById(id);

      sendSuccessResponse(res,'Payroll retrieved successfully',
      payroll
     );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update payroll
   * PUT /api/v1/hr/payroll/:id
   */
  static async updatePayroll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const payroll = await PayrollService.updatePayroll(id, updateData);

      sendSuccessResponse(res, 
       'Payroll updated successfully',
       payroll
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete payroll
   * DELETE /api/v1/hr/payroll/:id
   */
  static async deletePayroll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await PayrollService.deletePayroll(id);

      sendSuccessResponse(res, 'Payroll deleted successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate payslip (move from draft to generated)
   * POST /api/v1/hr/payroll/:id/generate
   */
  static async generatePayslip(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const approvedBy = req.user?.id;

      const payroll = await PayrollService.generatePayslip(id, approvedBy);

      sendSuccessResponse(res, 'Payslip generated successfully',
        payroll
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark payroll as paid
   * POST /api/v1/hr/payroll/:id/mark-paid
   */
  static async markAsPaid(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const paymentDetails = req.body;

      const payroll = await PayrollService.markAsPaid(id, paymentDetails);

      sendSuccessResponse(res,  'Payroll marked as paid successfully',
      payroll
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get payroll statistics
   * GET /api/v1/hr/payroll/stats
   */
  static async getPayrollStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { month, year } = req.query;
      
      const currentDate = new Date();
      const currentMonth = month ? parseInt(month as string) : currentDate.getMonth() + 1;
      const currentYear = year ? parseInt(year as string) : currentDate.getFullYear();

      const stats = await PayrollService.getPayrollStats(currentMonth, currentYear);

      sendSuccessResponse(res, 'Payroll statistics retrieved successfully',
        stats
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get draft payrolls
   * GET /api/v1/hr/payroll/drafts
   */
  static async getDrafts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { month, year } = req.query;
      
      const drafts = await PayrollService.getDrafts(
        month ? parseInt(month as string) : undefined,
        year ? parseInt(year as string) : undefined
      );

      sendSuccessResponse(res, 
        'Draft payrolls retrieved successfully',
        drafts
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get pending payrolls
   * GET /api/v1/hr/payroll/pending
   */
  static async getPending(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { month, year } = req.query;
      
      const pending = await PayrollService.getPending(
        month ? parseInt(month as string) : undefined,
        year ? parseInt(year as string) : undefined
      );

      sendSuccessResponse(res, 'Pending payrolls retrieved successfully',
      pending
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Bulk generate payrolls
   * POST /api/v1/hr/payroll/bulk-generate
   */
  static async bulkGenerate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userIds, month, year } = req.body;
      const generatedBy = req.user._id.toString()

      const payrolls = await PayrollService.bulkGeneratePayrolls(userIds, month, year, generatedBy);

      sendSuccessResponse(res,`${payrolls.length} payrolls generated successfully`,
     payrolls
     );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Revise payroll
   * POST /api/v1/hr/payroll/:id/revise
   */
  static async revisePayroll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { revisionReason, ...revisionData } = req.body;

      const payroll = await PayrollService.revisePayroll(id, revisionData, revisionReason);

      sendSuccessResponse(res,'Payroll revised successfully',
       payroll
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Download payslip
   * GET /api/v1/hr/payroll/:id/download
   */
  // static async downloadPayslip(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const { id } = req.params;
  //     const filePath = await PayrollService.downloadPayslip(id);

  //     sendSuccessResponse(res, 'Payslip download link generated',
  //      { filePath }
  //     );
  //   } catch (error) {
  //     next(error);
  //   }
  // }


  /**
   * Download payslip PDF
   */
  static async downloadPayslip(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const pdfPath = await PayrollService.downloadPayslip(req.params.id);
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

 static async getUserPayrollHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const { limit = 12 } = req.query;
      const history = await PayrollService.getUserPayrollHistory(userId, Number(limit));
      sendSuccessResponse(res, 'Payroll history retrieved successfully', history);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

}