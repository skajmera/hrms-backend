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

  /**
   * Validation for adding office location
   */
  static addOfficeLocation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('latitude').isFloat().withMessage('Latitude must be a number'),
    body('longitude').isFloat().withMessage('Longitude must be a number'),
    body('radius').optional().isFloat().withMessage('Radius must be a number')
  ];

  /**
   * Validation for updating office location
   */
  static updateOfficeLocation = [
    param('id').isMongoId().withMessage('Invalid location ID'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('latitude').optional().isFloat().withMessage('Latitude must be a number'),
    body('longitude').optional().isFloat().withMessage('Longitude must be a number'),
    body('radius').optional().isFloat().withMessage('Radius must be a number')
  ];

  /**
   * Validation for adding WiFi network
   */
  static addWifiNetwork = [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('bssid').notEmpty().withMessage('BSSID is required')
  ];

  /**
   * Validation for updating WiFi network
   */
  static updateWifiNetwork = [
    param('id').isMongoId().withMessage('Invalid WiFi ID'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('bssid').optional().notEmpty().withMessage('BSSID cannot be empty')
  ];

  /**
   * Generic Mongo ID validation for params
   */
  static paramId = [
    param('id').isMongoId().withMessage('Invalid ID')
  ];
}