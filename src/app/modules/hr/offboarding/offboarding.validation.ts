import { body, param, query } from 'express-validator';

export class OffboardingValidation {
  /**
   * Validation for creating resignation request
   */
  static createResignation = [
    body('userId').notEmpty().withMessage('User ID is required').isMongoId().withMessage('Invalid user ID'),
    body('resignationDate').notEmpty().withMessage('Resignation date is required').isISO8601().withMessage('Invalid date format'),
    body('lastWorkingDate').notEmpty().withMessage('Last working date is required').isISO8601().withMessage('Invalid date format'),
    body('reason').notEmpty().withMessage('Reason is required').isIn(['BETTER_OPPORTUNITY', 'PERSONAL_REASONS', 'HEALTH_ISSUES', 'RELOCATION', 'HIGHER_STUDIES', 'RETIREMENT', 'OTHER']).withMessage('Invalid reason'),
    body('employeeNotes').optional().isString().withMessage('Employee notes must be a string')
  ];

  /**
   * Validation for updating resignation
   */
  static updateResignation = [
    param('id').isMongoId().withMessage('Invalid offboarding ID'),
    body('lastWorkingDate').optional().isISO8601().withMessage('Invalid date format'),
    body('status').optional().isIn(['PENDING', 'APPROVED', 'REJECTED', 'NOTICE_PERIOD', 'COMPLETED', 'WITHDRAWN']).withMessage('Invalid status'),
    body('hrNotes').optional().isString(),
    body('managerNotes').optional().isString()
  ];

  /**
   * Validation for approving resignation
   */
  static approveResignation = [
    param('id').isMongoId().withMessage('Invalid offboarding ID'),
    body('hrNotes').optional().isString()
  ];

  /**
   * Validation for rejecting resignation
   */
  static rejectResignation = [
    param('id').isMongoId().withMessage('Invalid offboarding ID'),
    // body('rejectionReason').notEmpty().withMessage('Rejection reason is required')
  ];

  /**
   * Validation for offboarding ID param
   */
  static offboardingId = [
    param('id').isMongoId().withMessage('Invalid offboarding ID')
  ];

  /**
   * Validation for query params
   */
  static getResignations = [
    query('status').optional().isIn(['PENDING', 'APPROVED', 'REJECTED', 'NOTICE_PERIOD', 'COMPLETED', 'WITHDRAWN']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ];
}