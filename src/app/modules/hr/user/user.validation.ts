import { body, param, query } from 'express-validator';

export const createUserValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone')
    .optional()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^\+?[0-9\s\-()]{7,15}$/).withMessage('Valid phone number is required (7-15 digits)'),
  body('alternatePhone')
    .optional({ checkFalsy: true })
    .matches(/^\+?[0-9\s\-()]{7,15}$/)
    .withMessage('Valid alternate phone number is required (7-15 digits)'),

  body('dateOfBirth').optional().isISO8601().withMessage('Valid date of birth is required'),
  body('gender').optional().isIn(['MALE', 'FEMALE', 'OTHER']).withMessage('Valid gender is required'),
  body('profileImage').optional().isString().withMessage('Profile image must be a URL string'),
  body('permanentAddress').optional().isObject(),
  body('sameAsPermanentAddress').optional().isBoolean().toBoolean().withMessage('sameAsPermanentAddress must be a boolean'),
  body('currentAddressSameAsPermanent').optional().isBoolean().toBoolean().withMessage('currentAddressSameAsPermanent must be a boolean'),
  body('usePermanentAddressAsCurrent').optional().isBoolean().toBoolean().withMessage('usePermanentAddressAsCurrent must be a boolean'),
  body('role').optional().isIn(['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE']).withMessage('Valid role is required'),

  // Professional Details
  body('professionalDetails.employeeId').notEmpty().withMessage('Employee ID is required'),
  body('professionalDetails.designation').notEmpty().withMessage('Designation is required'),
  body('professionalDetails.department').notEmpty().withMessage('Department is required'),
  body('professionalDetails.totalExperience').optional().isString(),
  body('professionalDetails.currentExperience').optional().isString(),

  // Experience
  body('experience').optional().isArray(),
  body('experience.*.company').optional().isString(),
  body('experience.*.isRelevant').optional().isBoolean(),

  // Separation Info
  body('separationInfo').optional().isObject(),
  body('separationInfo.dateOfExit').optional().isISO8601()
];

export const updateUserValidation = [
  param('id').isMongoId().withMessage('Valid user ID is required'),
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('phone')
    .optional()
    .notEmpty().withMessage('Phone cannot be empty')
    .matches(/^\+?[0-9\s\-()]{7,15}$/).withMessage('Valid phone number is required (7-15 digits)'),
  body('alternatePhone')
    .optional({ checkFalsy: true })
    .matches(/^\+?[0-9\s\-()]{7,15}$/)
    .withMessage('Valid alternate phone number is required (7-15 digits)'),

  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('profileImage').optional().isString(),
  body('sameAsPermanentAddress').optional().isBoolean().toBoolean().withMessage('sameAsPermanentAddress must be a boolean'),
  body('currentAddressSameAsPermanent').optional().isBoolean().toBoolean().withMessage('currentAddressSameAsPermanent must be a boolean'),
  body('usePermanentAddressAsCurrent').optional().isBoolean().toBoolean().withMessage('usePermanentAddressAsCurrent must be a boolean'),
  body('professionalDetails.totalExperience').optional().isString(),
  body('professionalDetails.currentExperience').optional().isString(),
  body('experience.*.isRelevant').optional().isBoolean(),
  body('separationInfo.dateOfExit').optional().isISO8601()
];

export const getUserValidation = [
  param('id').isMongoId().withMessage('Valid user ID is required')
];

export const queryUsersValidation = [
  query('page').optional().toInt().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().toInt().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isIn(['asc', 'desc']),
  query('status').optional().customSanitizer(v => String(v).trim().toUpperCase()).isIn(['ACTIVE', 'PROBATION', 'RESIGNED', 'TERMINATED', 'RETIRED', 'DRAFT']).withMessage('Invalid status')
];

export const createDraftValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('phone')
    .optional()
    .matches(/^\+?[0-9\s\-()]{7,15}$/).withMessage('Valid phone number is required (7-15 digits)'),
  body('alternatePhone')
    .optional({ checkFalsy: true })
    .matches(/^\+?[0-9\s\-()]{7,15}$/)
    .withMessage('Valid alternate phone number is required (7-15 digits)'),
  body('sameAsPermanentAddress').optional().isBoolean().toBoolean().withMessage('sameAsPermanentAddress must be a boolean'),
  body('currentAddressSameAsPermanent').optional().isBoolean().toBoolean().withMessage('currentAddressSameAsPermanent must be a boolean'),
  body('usePermanentAddressAsCurrent').optional().isBoolean().toBoolean().withMessage('usePermanentAddressAsCurrent must be a boolean')

];