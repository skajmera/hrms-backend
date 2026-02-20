"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsValidation = void 0;
const express_validator_1 = require("express-validator");
class PermissionsValidation {
}
exports.PermissionsValidation = PermissionsValidation;
/**
 * Validation for inviting user
 */
PermissionsValidation.inviteUser = [
    (0, express_validator_1.body)('userId').notEmpty().withMessage('User ID is required').isMongoId().withMessage('Invalid user ID'),
    (0, express_validator_1.body)('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
    (0, express_validator_1.body)('role').notEmpty().withMessage('Role is required'),
    (0, express_validator_1.body)('modules').notEmpty().withMessage('Module permissions are required').isObject().withMessage('Modules must be an object')
];
/**
 * Validation for updating permissions
 */
PermissionsValidation.updatePermissions = [
    (0, express_validator_1.param)('userId').isMongoId().withMessage('Invalid user ID'),
    (0, express_validator_1.body)('modules').optional().isObject().withMessage('Modules must be an object'),
    (0, express_validator_1.body)('role').optional().isString().withMessage('Role must be a string')
];
/**
 * Validation for user ID param
 */
PermissionsValidation.userId = [
    (0, express_validator_1.param)('userId').isMongoId().withMessage('Invalid user ID')
];
/**
 * Validation for get permissions query
 */
PermissionsValidation.getPermissions = [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('role').optional().isString().withMessage('Role must be a string'),
    (0, express_validator_1.query)('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive')
];
//# sourceMappingURL=permissions.validation.js.map