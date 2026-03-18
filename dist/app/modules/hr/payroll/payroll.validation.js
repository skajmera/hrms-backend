"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollValidation = exports.generatePayrollValidation = void 0;
const express_validator_1 = require("express-validator");
exports.generatePayrollValidation = [
    (0, express_validator_1.body)('userId').isMongoId().withMessage('Valid user ID is required'),
    (0, express_validator_1.body)('month').isInt({ min: 1, max: 12 }).withMessage('Valid month is required'),
    (0, express_validator_1.body)('year').isInt({ min: 2000 }).withMessage('Valid year is required'),
    (0, express_validator_1.body)('salaryComponents').isObject().withMessage('Salary components are required'),
    (0, express_validator_1.body)('workingDays').isInt({ min: 0 }).withMessage('Valid working days required'),
    (0, express_validator_1.body)('presentDays').isInt({ min: 0 }).withMessage('Valid present days required')
];
class PayrollValidation {
}
exports.PayrollValidation = PayrollValidation;
/**
 * Validation for creating payroll
 */
PayrollValidation.createPayroll = [
    (0, express_validator_1.body)('userId').notEmpty().withMessage('User ID is required').isMongoId().withMessage('Invalid user ID'),
    (0, express_validator_1.body)('month').notEmpty().withMessage('Month is required').isInt({ min: 1, max: 12 }).withMessage('Month must be between 1 and 12'),
    (0, express_validator_1.body)('year').notEmpty().withMessage('Year is required').isInt({ min: 2000 }).withMessage('Invalid year'),
    (0, express_validator_1.body)('salaryComponents.basic').notEmpty().withMessage('Basic salary is required').isNumeric().withMessage('Basic salary must be a number'),
    (0, express_validator_1.body)('salaryComponents.hra').notEmpty().withMessage('HRA is required').isNumeric().withMessage('HRA must be a number'),
    (0, express_validator_1.body)('workingDays').notEmpty().withMessage('Working days is required').isInt({ min: 1 }).withMessage('Invalid working days'),
    (0, express_validator_1.body)('presentDays').notEmpty().withMessage('Present days is required').isInt({ min: 0 }).withMessage('Invalid present days')
];
/**
 * Validation for updating payroll
 */
PayrollValidation.updatePayroll = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid payroll ID'),
    (0, express_validator_1.body)('salaryComponents').optional().isObject().withMessage('Salary components must be an object'),
    (0, express_validator_1.body)('paymentStatus').optional().isIn(['PENDING', 'PROCESSING', 'PAID', 'FAILED']).withMessage('Invalid payment status'),
    (0, express_validator_1.body)('paymentMode').optional().isIn(['BANK_TRANSFER', 'CASH', 'CHEQUE']).withMessage('Invalid payment mode')
];
/**
 * Validation for generating payslip
 */
PayrollValidation.generatePayslip = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid payroll ID')
];
/**
 * Validation for bulk payroll generation
 */
PayrollValidation.bulkGenerate = [
    (0, express_validator_1.body)('month').notEmpty().withMessage('Month is required').isInt({ min: 1, max: 12 }),
    (0, express_validator_1.body)('year').notEmpty().withMessage('Year is required').isInt({ min: 2000 }),
    (0, express_validator_1.body)('userIds').isArray({ min: 1 }).withMessage('User IDs must be an array with at least one user')
];
/**
 * Validation for payroll query
 */
PayrollValidation.getPayrolls = [
    (0, express_validator_1.query)('month').optional().isInt({ min: 1, max: 12 }).withMessage('Invalid month'),
    (0, express_validator_1.query)('year').optional().isInt({ min: 2000 }).withMessage('Invalid year'),
    (0, express_validator_1.query)('status').optional().customSanitizer(v => String(v).trim().toUpperCase()).isIn(['DRAFT', 'PENDING', 'GENERATED', 'PROCESSING', 'PAID', 'FAILED']).withMessage('Invalid status'),
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];
/**
 * Validation for payroll ID param
 */
PayrollValidation.payrollId = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid payroll ID')
];
/**
 * Validation for revision
 */
PayrollValidation.revisePayroll = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid payroll ID'),
    (0, express_validator_1.body)('revisionReason').notEmpty().withMessage('Revision reason is required'),
    (0, express_validator_1.body)('salaryComponents').optional().isObject().withMessage('Salary components must be an object')
];
//# sourceMappingURL=payroll.validation.js.map