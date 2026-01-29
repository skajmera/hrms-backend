import { body, param, query } from 'express-validator';

export const markAttendanceValidation = [
  body('userId').isMongoId().withMessage('Valid user ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('status').isIn(['PRESENT', 'ABSENT', 'HALF_DAY', 'LATE', 'WFH', 'ON_LEAVE']).withMessage('Valid status is required'),
  body('shift').isIn(['MORNING', 'EVENING', 'NIGHT', 'FLEXIBLE']).withMessage('Valid shift is required'),
  body('checkInTime').optional().isISO8601().withMessage('Valid check-in time required'),
  body('checkOutTime').optional().isISO8601().withMessage('Valid check-out time required')
];

export const updateAttendanceValidation = [
  param('id').isMongoId().withMessage('Valid attendance ID is required'),
  body('status').optional().isIn(['PRESENT', 'ABSENT', 'HALF_DAY', 'LATE', 'WFH']),
  body('checkInTime').optional().isISO8601(),
  body('checkOutTime').optional().isISO8601()
];

export const getAttendanceValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('userId').optional().isMongoId(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
];