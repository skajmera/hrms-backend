import { body, param, query } from 'express-validator';

export class OrganizationValidation {
  /**
   * Validation for creating organization
   */
  static createOrganization = [
    body('name').notEmpty().withMessage('Organization name is required'),
    body('legalName').notEmpty().withMessage('Legal name is required'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('address.street').notEmpty().withMessage('Street address is required'),
    body('address.city').notEmpty().withMessage('City is required'),
    body('address.state').notEmpty().withMessage('State is required'),
    body('address.country').notEmpty().withMessage('Country is required'),
    body('address.pincode').notEmpty().withMessage('Pincode is required')
  ];

  /**
   * Validation for updating organization
   */
  static updateOrganization = [
    param('id').isMongoId().withMessage('Invalid organization ID'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Invalid email')
  ];

  /**
   * Validation for organization ID
   */
  static organizationId = [
    param('id').isMongoId().withMessage('Invalid organization ID')
  ];

  /**
   * Validation for settings update
   */
  static updateSettings = [
    param('id').isMongoId().withMessage('Invalid organization ID'),
    body('settings').notEmpty().withMessage('Settings are required').isObject()
  ];

  /**
   * Validation for admin management
   */
  static manageAdmin = [
    param('id').isMongoId().withMessage('Invalid organization ID'),
    body('adminId').notEmpty().withMessage('Admin ID is required').isMongoId().withMessage('Invalid admin ID')
  ];
}