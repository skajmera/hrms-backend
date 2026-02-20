"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OffboardingValidation = void 0;
const express_validator_1 = require("express-validator");
class OffboardingValidation {
}
exports.OffboardingValidation = OffboardingValidation;
/**
 * Validation for creating resignation request
 */
OffboardingValidation.createResignation = [
    (0, express_validator_1.body)('userId').notEmpty().withMessage('User ID is required').isMongoId().withMessage('Invalid user ID'),
    (0, express_validator_1.body)('resignationDate').notEmpty().withMessage('Resignation date is required').isISO8601().withMessage('Invalid date format'),
    (0, express_validator_1.body)('lastWorkingDate').notEmpty().withMessage('Last working date is required').isISO8601().withMessage('Invalid date format'),
    (0, express_validator_1.body)('reason').notEmpty().withMessage('Reason is required').isIn(['BETTER_OPPORTUNITY', 'PERSONAL_REASONS', 'HEALTH_ISSUES', 'RELOCATION', 'HIGHER_STUDIES', 'RETIREMENT', 'OTHER']).withMessage('Invalid reason'),
    (0, express_validator_1.body)('employeeNotes').optional().isString().withMessage('Employee notes must be a string')
];
/**
 * Validation for updating resignation
 */
OffboardingValidation.updateResignation = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid offboarding ID'),
    (0, express_validator_1.body)('lastWorkingDate').optional().isISO8601().withMessage('Invalid date format'),
    (0, express_validator_1.body)('status').optional().isIn(['PENDING', 'APPROVED', 'REJECTED', 'NOTICE_PERIOD', 'COMPLETED', 'WITHDRAWN']).withMessage('Invalid status'),
    (0, express_validator_1.body)('hrNotes').optional().isString(),
    (0, express_validator_1.body)('managerNotes').optional().isString()
];
/**
 * Validation for approving resignation
 */
OffboardingValidation.approveResignation = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid offboarding ID'),
    (0, express_validator_1.body)('hrNotes').optional().isString()
];
/**
 * Validation for rejecting resignation
 */
OffboardingValidation.rejectResignation = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid offboarding ID'),
    (0, express_validator_1.body)('rejectionReason').notEmpty().withMessage('Rejection reason is required')
];
/**
 * Validation for offboarding ID param
 */
OffboardingValidation.offboardingId = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid offboarding ID')
];
/**
 * Validation for query params
 */
OffboardingValidation.getResignations = [
    (0, express_validator_1.query)('status').optional().isIn(['PENDING', 'APPROVED', 'REJECTED', 'NOTICE_PERIOD', 'COMPLETED', 'WITHDRAWN']),
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 })
];
//# sourceMappingURL=offboarding.validation.js.map