import { body, param, query } from 'express-validator';

export const createAnnouncementValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('priority').isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).withMessage('Valid priority is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('targetAudience.isGlobal').isBoolean().withMessage('isGlobal must be boolean')
];

export const queryAnnouncementsValidation = [
  // pagination & sorting are validated globally or elsewhere; repeat minimal checks
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isIn(['asc', 'desc']),

  // new filter parameters
  query('startDate').optional().isISO8601().withMessage('startDate must be a valid date'),
  query('expiryDate').optional().isISO8601().withMessage('expiryDate must be a valid date'),
  query('announcementType')
    .optional()
    .isIn(['GENERAL', 'BIRTHDAY', 'ANNIVERSARY'])
    .withMessage('Invalid announcementType')
];