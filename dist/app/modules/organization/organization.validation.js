"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationValidation = void 0;
const express_validator_1 = require("express-validator");
class OrganizationValidation {
}
exports.OrganizationValidation = OrganizationValidation;
/**
 * Validation for creating organization
 */
OrganizationValidation.createOrganization = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Organization name is required'),
    (0, express_validator_1.body)('legalName').notEmpty().withMessage('Legal name is required'),
    (0, express_validator_1.body)('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
    (0, express_validator_1.body)('phone').notEmpty().withMessage('Phone is required'),
    (0, express_validator_1.body)('address.street').notEmpty().withMessage('Street address is required'),
    (0, express_validator_1.body)('address.city').notEmpty().withMessage('City is required'),
    (0, express_validator_1.body)('address.state').notEmpty().withMessage('State is required'),
    (0, express_validator_1.body)('address.country').notEmpty().withMessage('Country is required'),
    (0, express_validator_1.body)('address.pincode').notEmpty().withMessage('Pincode is required')
];
/**
 * Validation for updating organization
 */
OrganizationValidation.updateOrganization = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid organization ID'),
    (0, express_validator_1.body)('name').optional().notEmpty().withMessage('Name cannot be empty'),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Invalid email')
];
/**
 * Validation for organization ID
 */
OrganizationValidation.organizationId = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid organization ID')
];
/**
 * Validation for settings update
 */
OrganizationValidation.updateSettings = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid organization ID'),
    (0, express_validator_1.body)('settings').notEmpty().withMessage('Settings are required').isObject()
];
/**
 * Validation for admin management
 */
OrganizationValidation.manageAdmin = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid organization ID'),
    (0, express_validator_1.body)('adminId').notEmpty().withMessage('Admin ID is required').isMongoId().withMessage('Invalid admin ID')
];
/**
 * Validation for adding office location
 */
OrganizationValidation.addOfficeLocation = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('latitude').isFloat().withMessage('Latitude must be a number'),
    (0, express_validator_1.body)('longitude').isFloat().withMessage('Longitude must be a number'),
    (0, express_validator_1.body)('radius').optional().isFloat().withMessage('Radius must be a number')
];
/**
 * Validation for updating office location
 */
OrganizationValidation.updateOfficeLocation = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid location ID'),
    (0, express_validator_1.body)('name').optional().notEmpty().withMessage('Name cannot be empty'),
    (0, express_validator_1.body)('latitude').optional().isFloat().withMessage('Latitude must be a number'),
    (0, express_validator_1.body)('longitude').optional().isFloat().withMessage('Longitude must be a number'),
    (0, express_validator_1.body)('radius').optional().isFloat().withMessage('Radius must be a number')
];
/**
 * Validation for adding WiFi network
 */
OrganizationValidation.addWifiNetwork = [
    (0, express_validator_1.body)('name').optional().notEmpty().withMessage('Name cannot be empty'),
    (0, express_validator_1.body)('bssid').notEmpty().withMessage('BSSID is required')
];
/**
 * Validation for updating WiFi network
 */
OrganizationValidation.updateWifiNetwork = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid WiFi ID'),
    (0, express_validator_1.body)('name').optional().notEmpty().withMessage('Name cannot be empty'),
    (0, express_validator_1.body)('bssid').optional().notEmpty().withMessage('BSSID cannot be empty')
];
/**
 * Generic Mongo ID validation for params
 */
OrganizationValidation.paramId = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid ID')
];
//# sourceMappingURL=organization.validation.js.map