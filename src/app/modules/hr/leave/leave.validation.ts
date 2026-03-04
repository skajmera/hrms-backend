import { body, param, query } from 'express-validator';

export const applyLeaveValidation = [
  body('userId').isMongoId().withMessage('Valid user ID is required'),
  body('leaveType').isIn(['CASUAL', 'SICK', 'EARNED', 'MATERNITY', 'PATERNITY', 'UNPAID']).withMessage('Valid leave type is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('reason').trim().notEmpty().withMessage('Reason is required')
];

export const approveRejectLeaveValidation = [
  param('id').isMongoId().withMessage('Valid leave ID is required'),
  body('rejectionReason').optional().trim().notEmpty()
];

export const getEmployeeLeavesValidation = [
  param('userId').isMongoId().withMessage('Valid user ID is required'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer')
];

export const getLeaveBalanceValidation = [
  param('userId').isMongoId().withMessage('Valid user ID is required'),
  param('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('Valid year is required')
];