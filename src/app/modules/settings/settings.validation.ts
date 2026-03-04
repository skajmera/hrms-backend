import { body, param } from 'express-validator';

export class SettingsValidation {
  /**
   * Update company info
   */
  static updateCompanyInfo = [
    body('name').optional().notEmpty().withMessage('Company name is required'),
    body('website').optional().isURL().withMessage('Invalid website URL'),
    body('email').optional().isEmail().withMessage('Invalid email'),
    body('phone').optional().notEmpty().withMessage('Phone is required')
  ];

  /**
   * Update locale settings
   */
  static updateLocale = [
    body('country').optional(),
    body('timezone').optional(),
    body('timeFormat').optional().isIn(['12', '24']),
    body('dateFormat').optional(),
    body('nameFormat').optional()
  ];

  /**
   * Create work schedule
   */
  static createWorkSchedule = [
    body('scheduleName').notEmpty().withMessage('Schedule name is required'),
    body('scheduleType').isIn(['DURATION_BASED', 'CLOCK_BASED']).withMessage('Invalid schedule type'),
    body('effectiveFrom').isISO8601().withMessage('Invalid date'),
    body('standardWorkingHoursPerDay').isNumeric().withMessage('Must be a number'),
    body('workingDays').isObject().withMessage('Working days must be an object')
  ];

  /**
   * Update notification settings
   */
  static updateNotifications = [
    body('attendance').optional().isObject(),
    body('leaves').optional().isObject(),
    body('announcements').optional().isObject(),
    body('reminders').optional().isObject()
  ];

  /**
   * Create designation
   */
  static createDesignation = [
    body('name').notEmpty().withMessage('Designation name is required'),
    body('code').notEmpty().withMessage('Designation code is required'),
    body('level').optional().isNumeric()
  ];

  /**
   * Change password
   */
  static changePassword = [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').notEmpty().withMessage('New password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('confirmPassword').notEmpty().withMessage('Confirm password is required')
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
  static updateSecurity = [
    body('requireFaceCapture').optional().isBoolean().withMessage('requireFaceCapture must be a boolean'),
    body('blockMockLocations').optional().isBoolean().withMessage('blockMockLocations must be a boolean'),
    body('officeLocations').optional().isArray().withMessage('officeLocations must be an array'),
    body('officeLocations.*.name').optional().notEmpty().withMessage('Location name is required'),
    body('officeLocations.*.latitude').optional().isFloat().withMessage('Latitude must be a number'),
    body('officeLocations.*.longitude').optional().isFloat().withMessage('Longitude must be a number'),
    body('officeLocations.*.radius').optional().isFloat().withMessage('Radius must be a number'),
    body('allowedWifiNetworks').optional().isArray().withMessage('allowedWifiNetworks must be an array'),
    body('allowedWifiNetworks.*.name').optional().notEmpty().withMessage('WiFi name is required'),
    body('allowedWifiNetworks.*.bssid').optional().notEmpty().withMessage('BSSID is required')
  ];
}