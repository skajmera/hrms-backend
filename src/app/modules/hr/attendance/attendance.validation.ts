import { body, param, query } from 'express-validator';

export const markAttendanceValidation = [
  body('userId').optional().isMongoId().withMessage('Valid user ID is required'),
  body('date').optional().isISO8601().withMessage('Valid date is required'),
  body('status').isIn(['PRESENT', 'ABSENT', 'HALF_DAY', 'LATE', 'WFH', 'ON_LEAVE']).withMessage('Valid status is required'),
  body('shift').isIn(['MORNING', 'EVENING', 'NIGHT', 'FLEXIBLE']).withMessage('Valid shift is required'),
  body('checkInTime').optional().isISO8601().withMessage('Valid check-in time required'),
  body('checkOutTime').optional().isISO8601().withMessage('Valid check-out time required'),
  body('deviceId').optional().isString().withMessage('Device ID is required'),
  body('gpsLatitude').optional().isFloat().withMessage('Valid GPS latitude is required'),
  body('gpsLongitude').optional().isFloat().withMessage('Valid GPS longitude is required'),
  body('isMockLocation').optional().isBoolean().withMessage('Mock location flag must be boolean')
];

export const registerDeviceValidation = [
  body('deviceId').notEmpty().withMessage('Device ID is required'),
  body('gpsLatitude').optional().isFloat(),
  body('gpsLongitude').optional().isFloat(),
  body('wifiBSSID').optional().isString()
];


export const updateAttendanceValidation = [
  param('id').isMongoId().withMessage('Valid attendance ID is required'),
  body('status').optional().isIn(['PRESENT', 'ABSENT', 'HALF_DAY', 'LATE', 'WFH']),
  body('checkInTime').optional().isISO8601(),
  body('checkOutTime').optional().isISO8601(),
  body('remarks').optional().isString()
];

export const adminUpsertAttendanceValidation = [
  body('userId').optional().isMongoId().withMessage('Valid user ID is required'),
  body('date').notEmpty().isISO8601().withMessage('Valid date is required'),
  body('status').notEmpty().isIn(['PRESENT', 'ABSENT', 'HALF_DAY', 'LATE', 'WFH', 'ON_LEAVE']).withMessage('Valid status is required'),
  body('shift').notEmpty().isIn(['MORNING', 'EVENING', 'NIGHT', 'FLEXIBLE']).withMessage('Valid shift is required'),
  body('checkInTime').optional().isISO8601().withMessage('Valid check-in time required'),
  body('checkOutTime').optional().isISO8601().withMessage('Valid check-out time required'),
  body('remarks').optional().isString()
];

export const getAttendanceValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('userId').optional().isMongoId(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
];