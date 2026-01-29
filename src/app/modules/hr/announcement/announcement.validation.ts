import { body, param } from 'express-validator';

export const createAnnouncementValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('priority').isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).withMessage('Valid priority is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('targetAudience.isGlobal').isBoolean().withMessage('isGlobal must be boolean')
];