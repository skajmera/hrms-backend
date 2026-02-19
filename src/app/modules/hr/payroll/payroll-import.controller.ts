import { Request, Response, NextFunction } from 'express';
import * as XLSX from 'xlsx';
import { PayrollImportService } from './payroll-import.service';
import { FileParser } from '../../../../shared/utils/fileParser';
import { sendSuccessResponse } from '../../../../shared/utils/response';
import { HTTP_STATUS } from '../../../../config/constants';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
export class PayrollImportController {
  /**
   * Upload and import payroll file
   * POST /api/v1/hr/payroll/import
   */
  static async importPayroll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          status: 'error',
          message: 'No file uploaded'
        });
        return;
      }

      const { importBasedOn } = req.body;
      
      if (!importBasedOn || !['employeeName', 'employeeId'].includes(importBasedOn)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          status: 'error',
          message: 'Import based on must be either "employeeName" or "employeeId"'
        });
        return;
      }

      const generatedBy = req.user?.id;

      // Process the file
      const result = await PayrollImportService.processPayrollFile(
        req.file.path,
        importBasedOn,
        generatedBy
      );

      sendSuccessResponse(res, `Payroll import completed. ${result.success} successful, ${result.failed} failed`,
     {
          summary: {
            totalRecords: result.success + result.failed,
            successfulRecords: result.success,
            failedRecords: result.failed
          },
          successfulPayrolls: result.successfulPayrolls,
          errors: result.errors
        }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Download sample template
   * GET /api/v1/hr/payroll/template
   */
  static async downloadTemplate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const workbook = FileParser.generateSampleTemplate();
      
      // Generate buffer
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      
      // Set headers for file download
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=Payroll_Template.xlsx');
      res.setHeader('Content-Length', buffer.length);
      
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Preview payroll data from uploaded file
   * POST /api/v1/hr/payroll/preview
   */
  static async previewPayroll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          status: 'error',
          message: 'No file uploaded'
        });
        return;
      }

      const ext = req.file.path.split('.').pop()?.toLowerCase();
      let parsedData;

      if (ext === 'csv') {
        parsedData = await FileParser.parseCSV(req.file.path);
      } else {
        parsedData = await FileParser.parseExcel(req.file.path);
      }

      // Validate data
      const { valid, invalid } = FileParser.validatePayrollData(parsedData);

      sendSuccessResponse(res,'File preview generated successfully',
         {
          totalRecords: parsedData.length,
          validRecords: valid.length,
          invalidRecords: invalid.length,
          preview: valid.slice(0, 10), // Show first 10 records
          errors: invalid
        });
    } catch (error) {
      next(error);
    }
  }
}