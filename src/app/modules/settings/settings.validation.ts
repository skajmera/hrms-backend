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
    body('country').optional().notEmpty(),
    body('timezone').optional().notEmpty(),
    body('timeFormat').optional().isIn(['12', '24']),
    body('dateFormat').optional().notEmpty(),
    body('nameFormat').optional().isIn(['FIRST_LAST', 'LAST_FIRST'])
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
}