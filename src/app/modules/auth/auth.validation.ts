import { body } from 'express-validator';

export const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('gender').isIn(['MALE', 'FEMALE', 'OTHER']).withMessage('Valid gender is required'),
  body('role').optional().isIn(['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE']),
  body('currentAddress.street').notEmpty().withMessage('Street is required'),
  body('currentAddress.city').notEmpty().withMessage('City is required'),
  body('currentAddress.state').notEmpty().withMessage('State is required'),
  body('currentAddress.country').notEmpty().withMessage('Country is required'),
  body('currentAddress.pincode').notEmpty().withMessage('Pincode is required'),
  body('professionalDetails.employeeId').notEmpty().withMessage('Employee ID is required'),
  body('professionalDetails.designation').notEmpty().withMessage('Designation is required'),
  body('professionalDetails.department').notEmpty().withMessage('Department is required'),
  body('professionalDetails.joiningDate').isISO8601().withMessage('Valid joining date is required'),
  body('professionalDetails.workLocation').notEmpty().withMessage('Work location is required')
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

export const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Valid email is required')
];

export const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];