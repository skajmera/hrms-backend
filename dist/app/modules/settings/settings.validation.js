"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsValidation = void 0;
const express_validator_1 = require("express-validator");
class SettingsValidation {
}
exports.SettingsValidation = SettingsValidation;
/**
 * Update company info
 */
SettingsValidation.updateCompanyInfo = [
    (0, express_validator_1.body)('name').optional().notEmpty().withMessage('Company name is required'),
    (0, express_validator_1.body)('website').optional().isURL().withMessage('Invalid website URL'),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Invalid email'),
    (0, express_validator_1.body)('phone').optional().notEmpty().withMessage('Phone is required')
];
/**
 * Update locale settings
 */
SettingsValidation.updateLocale = [
    (0, express_validator_1.body)('country').optional(),
    (0, express_validator_1.body)('timezone').optional(),
    (0, express_validator_1.body)('timeFormat').optional().isIn(['12', '24']),
    (0, express_validator_1.body)('dateFormat').optional(),
    (0, express_validator_1.body)('nameFormat').optional()
];
/**
 * Create work schedule
 */
SettingsValidation.createWorkSchedule = [
    (0, express_validator_1.body)('scheduleName').notEmpty().withMessage('Schedule name is required'),
    (0, express_validator_1.body)('scheduleType').isIn(['DURATION_BASED', 'CLOCK_BASED']).withMessage('Invalid schedule type'),
    (0, express_validator_1.body)('effectiveFrom').isISO8601().withMessage('Invalid date'),
    (0, express_validator_1.body)('standardWorkingHoursPerDay').isNumeric().withMessage('Must be a number'),
    (0, express_validator_1.body)('workingDays').isObject().withMessage('Working days must be an object')
];
/**
 * Update notification settings
 */
SettingsValidation.updateNotifications = [
    (0, express_validator_1.body)('attendance').optional().isObject(),
    (0, express_validator_1.body)('leaves').optional().isObject(),
    (0, express_validator_1.body)('announcements').optional().isObject(),
    (0, express_validator_1.body)('reminders').optional().isObject()
];
/**
 * Create designation
 */
SettingsValidation.createDesignation = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Designation name is required'),
    (0, express_validator_1.body)('code').notEmpty().withMessage('Designation code is required'),
    (0, express_validator_1.body)('level').optional().isNumeric()
];
/**
 * Change password
 */
SettingsValidation.changePassword = [
    (0, express_validator_1.body)('currentPassword').notEmpty().withMessage('Current password is required'),
    (0, express_validator_1.body)('newPassword').notEmpty().withMessage('New password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    (0, express_validator_1.body)('confirmPassword').notEmpty().withMessage('Confirm password is required')
        .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('Passwords do not match');
        }
        return true;
    })
];
/**
 * Update security settings
 */
SettingsValidation.updateSecurity = [
    (0, express_validator_1.body)('requireFaceCapture').optional().isBoolean().withMessage('requireFaceCapture must be a boolean'),
    (0, express_validator_1.body)('blockMockLocations').optional().isBoolean().withMessage('blockMockLocations must be a boolean'),
    (0, express_validator_1.body)('officeLocations').optional().isArray().withMessage('officeLocations must be an array'),
    (0, express_validator_1.body)('officeLocations.*.name').optional().notEmpty().withMessage('Location name is required'),
    (0, express_validator_1.body)('officeLocations.*.latitude').optional().isFloat().withMessage('Latitude must be a number'),
    (0, express_validator_1.body)('officeLocations.*.longitude').optional().isFloat().withMessage('Longitude must be a number'),
    (0, express_validator_1.body)('officeLocations.*.radius').optional().isFloat().withMessage('Radius must be a number'),
    (0, express_validator_1.body)('allowedWifiNetworks').optional().isArray().withMessage('allowedWifiNetworks must be an array'),
    (0, express_validator_1.body)('allowedWifiNetworks.*.name').optional().notEmpty().withMessage('WiFi name is required'),
    (0, express_validator_1.body)('allowedWifiNetworks.*.bssid').optional().notEmpty().withMessage('BSSID is required')
];
//# sourceMappingURL=settings.validation.js.map