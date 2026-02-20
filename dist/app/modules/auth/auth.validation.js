"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordValidation = exports.forgotPasswordValidation = exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
exports.registerValidation = [
    (0, express_validator_1.body)('firstName').trim().notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lastName').trim().notEmpty().withMessage('Last name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    // body('phone').notEmpty().withMessage('Phone number is required'),
    // body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
    // body('gender').isIn(['MALE', 'FEMALE', 'OTHER']).withMessage('Valid gender is required'),
    (0, express_validator_1.body)('role').optional().isIn(['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE']),
    // body('currentAddress.street').notEmpty().withMessage('Street is required'),
    // body('currentAddress.city').notEmpty().withMessage('City is required'),
    // body('currentAddress.state').notEmpty().withMessage('State is required'),
    // body('currentAddress.country').notEmpty().withMessage('Country is required'),
    // body('currentAddress.pincode').notEmpty().withMessage('Pincode is required'),
    // body('professionalDetails.employeeId').notEmpty().withMessage('Employee ID is required'),
    // body('professionalDetails.designation').notEmpty().withMessage('Designation is required'),
    // body('professionalDetails.department').notEmpty().withMessage('Department is required'),
    // body('professionalDetails.joiningDate').isISO8601().withMessage('Valid joining date is required'),
    // body('professionalDetails.workLocation').notEmpty().withMessage('Work location is required')
];
exports.loginValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required')
];
exports.forgotPasswordValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required')
];
exports.resetPasswordValidation = [
    (0, express_validator_1.body)('token').notEmpty().withMessage('Reset token is required'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];
//# sourceMappingURL=auth.validation.js.map