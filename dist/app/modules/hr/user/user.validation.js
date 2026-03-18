"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDraftValidation = exports.queryUsersValidation = exports.getUserValidation = exports.updateUserValidation = exports.createUserValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createUserValidation = [
    (0, express_validator_1.body)('firstName').trim().notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lastName').trim().notEmpty().withMessage('Last name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('phone')
        .optional()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^\+?[0-9\s\-()]{7,15}$/).withMessage('Valid phone number is required (7-15 digits)'),
    (0, express_validator_1.body)('alternatePhone')
        .optional({ checkFalsy: true })
        .matches(/^\+?[0-9\s\-()]{7,15}$/)
        .withMessage('Valid alternate phone number is required (7-15 digits)'),
    (0, express_validator_1.body)('dateOfBirth').optional().isISO8601().withMessage('Valid date of birth is required'),
    (0, express_validator_1.body)('gender').optional().isIn(['MALE', 'FEMALE', 'OTHER']).withMessage('Valid gender is required'),
    (0, express_validator_1.body)('profileImage').optional().isString().withMessage('Profile image must be a URL string'),
    (0, express_validator_1.body)('permanentAddress').optional().isObject(),
    (0, express_validator_1.body)('role').optional().isIn(['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE']).withMessage('Valid role is required'),
    // Professional Details
    (0, express_validator_1.body)('professionalDetails.employeeId').notEmpty().withMessage('Employee ID is required'),
    (0, express_validator_1.body)('professionalDetails.designation').notEmpty().withMessage('Designation is required'),
    (0, express_validator_1.body)('professionalDetails.department').notEmpty().withMessage('Department is required'),
    (0, express_validator_1.body)('professionalDetails.totalExperience').optional().isString(),
    (0, express_validator_1.body)('professionalDetails.currentExperience').optional().isString(),
    // Experience
    (0, express_validator_1.body)('experience').optional().isArray(),
    (0, express_validator_1.body)('experience.*.company').optional().isString(),
    (0, express_validator_1.body)('experience.*.isRelevant').optional().isBoolean(),
    // Separation Info
    (0, express_validator_1.body)('separationInfo').optional().isObject(),
    (0, express_validator_1.body)('separationInfo.dateOfExit').optional().isISO8601()
];
exports.updateUserValidation = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Valid user ID is required'),
    (0, express_validator_1.body)('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
    (0, express_validator_1.body)('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
    (0, express_validator_1.body)('phone')
        .optional()
        .notEmpty().withMessage('Phone cannot be empty')
        .matches(/^\+?[0-9\s\-()]{7,15}$/).withMessage('Valid phone number is required (7-15 digits)'),
    (0, express_validator_1.body)('alternatePhone')
        .optional({ checkFalsy: true })
        .matches(/^\+?[0-9\s\-()]{7,15}$/)
        .withMessage('Valid alternate phone number is required (7-15 digits)'),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('profileImage').optional().isString(),
    (0, express_validator_1.body)('professionalDetails.totalExperience').optional().isString(),
    (0, express_validator_1.body)('professionalDetails.currentExperience').optional().isString(),
    (0, express_validator_1.body)('experience.*.isRelevant').optional().isBoolean(),
    (0, express_validator_1.body)('separationInfo.dateOfExit').optional().isISO8601()
];
exports.getUserValidation = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Valid user ID is required')
];
exports.queryUsersValidation = [
    (0, express_validator_1.query)('page').optional().toInt().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit').optional().toInt().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('sortBy').optional().isString(),
    (0, express_validator_1.query)('sortOrder').optional().isIn(['asc', 'desc']),
    (0, express_validator_1.query)('status').optional().customSanitizer(v => String(v).trim().toUpperCase()).isIn(['ACTIVE', 'PROBATION', 'RESIGNED', 'TERMINATED', 'RETIRED', 'DRAFT']).withMessage('Invalid status')
];
exports.createDraftValidation = [
    (0, express_validator_1.body)('firstName').trim().notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lastName').trim().notEmpty().withMessage('Last name is required'),
    (0, express_validator_1.body)('phone')
        .optional()
        .matches(/^\+?[0-9\s\-()]{7,15}$/).withMessage('Valid phone number is required (7-15 digits)'),
    (0, express_validator_1.body)('alternatePhone')
        .optional({ checkFalsy: true })
        .matches(/^\+?[0-9\s\-()]{7,15}$/)
        .withMessage('Valid alternate phone number is required (7-15 digits)')
];
//# sourceMappingURL=user.validation.js.map