"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttendanceValidation = exports.adminUpsertAttendanceValidation = exports.updateAttendanceValidation = exports.registerDeviceValidation = exports.markAttendanceValidation = void 0;
const express_validator_1 = require("express-validator");
exports.markAttendanceValidation = [
    (0, express_validator_1.body)('userId').optional().isMongoId().withMessage('Valid user ID is required'),
    (0, express_validator_1.body)('date').optional().isISO8601().withMessage('Valid date is required'),
    (0, express_validator_1.body)('status').isIn(['PRESENT', 'ABSENT', 'HALF_DAY', 'LATE', 'WFH', 'ON_LEAVE']).withMessage('Valid status is required'),
    (0, express_validator_1.body)('shift').isIn(['MORNING', 'EVENING', 'NIGHT', 'FLEXIBLE']).withMessage('Valid shift is required'),
    (0, express_validator_1.body)('checkInTime').optional().isISO8601().withMessage('Valid check-in time required'),
    (0, express_validator_1.body)('checkOutTime').optional().isISO8601().withMessage('Valid check-out time required'),
    (0, express_validator_1.body)('deviceId').optional().isString().withMessage('Device ID is required'),
    (0, express_validator_1.body)('gpsLatitude').optional().isFloat().withMessage('Valid GPS latitude is required'),
    (0, express_validator_1.body)('gpsLongitude').optional().isFloat().withMessage('Valid GPS longitude is required'),
    (0, express_validator_1.body)('isMockLocation').optional().isBoolean().withMessage('Mock location flag must be boolean')
];
exports.registerDeviceValidation = [
    (0, express_validator_1.body)('deviceId').notEmpty().withMessage('Device ID is required'),
    (0, express_validator_1.body)('gpsLatitude').optional().isFloat(),
    (0, express_validator_1.body)('gpsLongitude').optional().isFloat(),
    (0, express_validator_1.body)('wifiBSSID').optional().isString()
];
exports.updateAttendanceValidation = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Valid attendance ID is required'),
    (0, express_validator_1.body)('status').optional().isIn(['PRESENT', 'ABSENT', 'HALF_DAY', 'LATE', 'WFH']),
    (0, express_validator_1.body)('checkInTime').optional().isISO8601(),
    (0, express_validator_1.body)('checkOutTime').optional().isISO8601(),
    (0, express_validator_1.body)('remarks').optional().isString()
];
exports.adminUpsertAttendanceValidation = [
    (0, express_validator_1.body)('userId').optional().isMongoId().withMessage('Valid user ID is required'),
    (0, express_validator_1.body)('date').notEmpty().isISO8601().withMessage('Valid date is required'),
    (0, express_validator_1.body)('status').notEmpty().isIn(['PRESENT', 'ABSENT', 'HALF_DAY', 'LATE', 'WFH', 'ON_LEAVE']).withMessage('Valid status is required'),
    (0, express_validator_1.body)('shift').notEmpty().isIn(['MORNING', 'EVENING', 'NIGHT', 'FLEXIBLE']).withMessage('Valid shift is required'),
    (0, express_validator_1.body)('checkInTime').optional().isISO8601().withMessage('Valid check-in time required'),
    (0, express_validator_1.body)('checkOutTime').optional().isISO8601().withMessage('Valid check-out time required'),
    (0, express_validator_1.body)('remarks').optional().isString()
];
exports.getAttendanceValidation = [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }),
    (0, express_validator_1.query)('userId').optional().isMongoId(),
    (0, express_validator_1.query)('startDate').optional().isISO8601(),
    (0, express_validator_1.query)('endDate').optional().isISO8601()
];
//# sourceMappingURL=attendance.validation.js.map