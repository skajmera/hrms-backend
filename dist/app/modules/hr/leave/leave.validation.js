"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaveBalanceValidation = exports.getEmployeeLeavesValidation = exports.approveRejectLeaveValidation = exports.applyLeaveValidation = void 0;
const express_validator_1 = require("express-validator");
exports.applyLeaveValidation = [
    (0, express_validator_1.body)('userId').isMongoId().withMessage('Valid user ID is required'),
    (0, express_validator_1.body)('leaveType').isIn(['CASUAL', 'SICK', 'EARNED', 'MATERNITY', 'PATERNITY', 'UNPAID']).withMessage('Valid leave type is required'),
    (0, express_validator_1.body)('startDate').isISO8601().withMessage('Valid start date is required'),
    (0, express_validator_1.body)('endDate').isISO8601().withMessage('Valid end date is required'),
    (0, express_validator_1.body)('reason').trim().notEmpty().withMessage('Reason is required')
];
exports.approveRejectLeaveValidation = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Valid leave ID is required'),
    (0, express_validator_1.body)('rejectionReason').optional().trim().notEmpty()
];
exports.getEmployeeLeavesValidation = [
    (0, express_validator_1.param)('userId').isMongoId().withMessage('Valid user ID is required'),
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer')
];
exports.getLeaveBalanceValidation = [
    (0, express_validator_1.param)('userId').isMongoId().withMessage('Valid user ID is required'),
    (0, express_validator_1.param)('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('Valid year is required')
];
//# sourceMappingURL=leave.validation.js.map