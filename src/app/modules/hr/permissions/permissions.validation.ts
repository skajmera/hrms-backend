import { body, param, query } from 'express-validator';

export class PermissionsValidation {
  /**
   * Validation for inviting user
   */
  static inviteUser = [
    body('userId').notEmpty().withMessage('User ID is required').isMongoId().withMessage('Invalid user ID'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
    body('role').notEmpty().withMessage('Role is required'),
    body('modules').notEmpty().withMessage('Module permissions are required').isObject().withMessage('Modules must be an object')
  ];

  /**
   * Validation for updating permissions
   */
  static updatePermissions = [
    param('userId').isMongoId().withMessage('Invalid user ID'),
    body('modules').optional().isObject().withMessage('Modules must be an object'),
    body('role').optional().isString().withMessage('Role must be a string')
  ];

  /**
   * Validation for user ID param
   */
  static userId = [
    param('userId').isMongoId().withMessage('Invalid user ID')
  ];

  /**
   * Validation for get permissions query
   */
  static getPermissions = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('role').optional().isString().withMessage('Role must be a string'),
    query('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive')
  ];
}