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