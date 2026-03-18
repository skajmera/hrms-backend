import { body, param, query } from 'express-validator';

export const generatePayrollValidation = [
  body('userId').isMongoId().withMessage('Valid user ID is required'),
  body('month').isInt({ min: 1, max: 12 }).withMessage('Valid month is required'),
  body('year').isInt({ min: 2000 }).withMessage('Valid year is required'),
  body('salaryComponents').isObject().withMessage('Salary components are required'),
  body('workingDays').isInt({ min: 0 }).withMessage('Valid working days required'),
  body('presentDays').isInt({ min: 0 }).withMessage('Valid present days required')
];


export class PayrollValidation {
  /**
   * Validation for creating payroll
   */
  static createPayroll = [
    body('userId').notEmpty().withMessage('User ID is required').isMongoId().withMessage('Invalid user ID'),
    body('month').notEmpty().withMessage('Month is required').isInt({ min: 1, max: 12 }).withMessage('Month must be between 1 and 12'),
    body('year').notEmpty().withMessage('Year is required').isInt({ min: 2000 }).withMessage('Invalid year'),
    body('salaryComponents.basic').notEmpty().withMessage('Basic salary is required').isNumeric().withMessage('Basic salary must be a number'),
    body('salaryComponents.hra').notEmpty().withMessage('HRA is required').isNumeric().withMessage('HRA must be a number'),
    body('workingDays').notEmpty().withMessage('Working days is required').isInt({ min: 1 }).withMessage('Invalid working days'),
    body('presentDays').notEmpty().withMessage('Present days is required').isInt({ min: 0 }).withMessage('Invalid present days')
  ];

  /**
   * Validation for updating payroll
   */
  static updatePayroll = [
    param('id').isMongoId().withMessage('Invalid payroll ID'),
    body('salaryComponents').optional().isObject().withMessage('Salary components must be an object'),
    body('paymentStatus').optional().isIn(['PENDING', 'PROCESSING', 'PAID', 'FAILED']).withMessage('Invalid payment status'),
    body('paymentMode').optional().isIn(['BANK_TRANSFER', 'CASH', 'CHEQUE']).withMessage('Invalid payment mode')
  ];

  /**
   * Validation for generating payslip
   */
  static generatePayslip = [
    param('id').isMongoId().withMessage('Invalid payroll ID')
  ];

  /**
   * Validation for bulk payroll generation
   */
  static bulkGenerate = [
    body('month').notEmpty().withMessage('Month is required').isInt({ min: 1, max: 12 }),
    body('year').notEmpty().withMessage('Year is required').isInt({ min: 2000 }),
    body('userIds').isArray({ min: 1 }).withMessage('User IDs must be an array with at least one user')
  ];

  /**
   * Validation for payroll query
   */
  static getPayrolls = [
    query('month').optional().isInt({ min: 1, max: 12 }).withMessage('Invalid month'),
    query('year').optional().isInt({ min: 2000 }).withMessage('Invalid year'),
    query('status').optional().customSanitizer(v => String(v).trim().toUpperCase()).isIn(['DRAFT', 'PENDING', 'GENERATED', 'PROCESSING', 'PAID', 'FAILED']).withMessage('Invalid status'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
  ];

  /**
   * Validation for payroll ID param
   */
  static payrollId = [
    param('id').isMongoId().withMessage('Invalid payroll ID')
  ];

  /**
   * Validation for revision
   */
  static revisePayroll = [
    param('id').isMongoId().withMessage('Invalid payroll ID'),
    body('revisionReason').notEmpty().withMessage('Revision reason is required'),
    body('salaryComponents').optional().isObject().withMessage('Salary components must be an object')
  ];
}