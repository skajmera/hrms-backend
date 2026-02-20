"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollImportController = void 0;
const XLSX = __importStar(require("xlsx"));
const payroll_import_service_1 = require("./payroll-import.service");
const fileParser_1 = require("../../../../shared/utils/fileParser");
const response_1 = require("../../../../shared/utils/response");
const constants_1 = require("../../../../config/constants");
class PayrollImportController {
    /**
     * Upload and import payroll file
     * POST /api/v1/hr/payroll/import
     */
    static async importPayroll(req, res, next) {
        try {
            if (!req.file) {
                res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                    status: 'error',
                    message: 'No file uploaded'
                });
                return;
            }
            const { importBasedOn } = req.body;
            if (!importBasedOn || !['employeeName', 'employeeId'].includes(importBasedOn)) {
                res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                    status: 'error',
                    message: 'Import based on must be either "employeeName" or "employeeId"'
                });
                return;
            }
            const generatedBy = req.user?.id;
            // Process the file
            const result = await payroll_import_service_1.PayrollImportService.processPayrollFile(req.file.path, importBasedOn, generatedBy);
            (0, response_1.sendSuccessResponse)(res, `Payroll import completed. ${result.success} successful, ${result.failed} failed`, {
                summary: {
                    totalRecords: result.success + result.failed,
                    successfulRecords: result.success,
                    failedRecords: result.failed
                },
                successfulPayrolls: result.successfulPayrolls,
                errors: result.errors
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Download sample template
     * GET /api/v1/hr/payroll/template
     */
    static async downloadTemplate(req, res, next) {
        try {
            const workbook = fileParser_1.FileParser.generateSampleTemplate();
            // Generate buffer
            const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
            // Set headers for file download
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=Payroll_Template.xlsx');
            res.setHeader('Content-Length', buffer.length);
            res.send(buffer);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Preview payroll data from uploaded file
     * POST /api/v1/hr/payroll/preview
     */
    static async previewPayroll(req, res, next) {
        try {
            if (!req.file) {
                res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                    status: 'error',
                    message: 'No file uploaded'
                });
                return;
            }
            const ext = req.file.path.split('.').pop()?.toLowerCase();
            let parsedData;
            if (ext === 'csv') {
                parsedData = await fileParser_1.FileParser.parseCSV(req.file.path);
            }
            else {
                parsedData = await fileParser_1.FileParser.parseExcel(req.file.path);
            }
            // Validate data
            const { valid, invalid } = fileParser_1.FileParser.validatePayrollData(parsedData);
            (0, response_1.sendSuccessResponse)(res, 'File preview generated successfully', {
                totalRecords: parsedData.length,
                validRecords: valid.length,
                invalidRecords: invalid.length,
                preview: valid.slice(0, 10), // Show first 10 records
                errors: invalid
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PayrollImportController = PayrollImportController;
//# sourceMappingURL=payroll-import.controller.js.map