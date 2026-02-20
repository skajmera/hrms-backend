"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryUsersValidation = exports.getUserValidation = exports.updateUserValidation = exports.createUserValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createUserValidation = [
    (0, express_validator_1.body)('firstName').trim().notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lastName').trim().notEmpty().withMessage('Last name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    // body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    // body('phone').notEmpty().withMessage('Phone number is required'),
    // body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
    // body('gender').isIn(['MALE', 'FEMALE', 'OTHER']).withMessage('Valid gender is required'),
    (0, express_validator_1.body)('professionalDetails.employeeId').notEmpty().withMessage('Employee ID is required'),
    (0, express_validator_1.body)('professionalDetails.designation').notEmpty().withMessage('Designation is required'),
    (0, express_validator_1.body)('professionalDetails.department').notEmpty().withMessage('Department is required')
];
exports.updateUserValidation = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Valid user ID is required'),
    (0, express_validator_1.body)('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
    (0, express_validator_1.body)('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
    (0, express_validator_1.body)('phone').optional().notEmpty().withMessage('Phone cannot be empty'),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Valid email is required')
];
exports.getUserValidation = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Valid user ID is required')
];
exports.queryUsersValidation = [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('sortBy').optional().isString(),
    (0, express_validator_1.query)('sortOrder').optional().isIn(['asc', 'desc'])
];
//# sourceMappingURL=user.validation.js.map