import { body, param, query } from 'express-validator';

export const generatePayrollValidation = [
  body('userId').isMongoId().withMessage('Valid user ID is required'),
  body('month').isInt({ min: 1, max: 12 }).withMessage('Valid month is required'),
  body('year').isInt({ min: 2000 }).withMessage('Valid year is required'),
  body('salaryComponents').isObject().withMessage('Salary components are required'),
  body('workingDays').isInt({ min: 0 }).withMessage('Valid working days required'),
  body('presentDays').isInt({ min: 0 }).withMessage('Valid present days required')
];