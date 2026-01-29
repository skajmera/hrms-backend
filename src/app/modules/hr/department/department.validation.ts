import { body, param } from 'express-validator';

export const createDepartmentValidation = [
  body('name').trim().notEmpty().withMessage('Department name is required'),
  body('code').trim().notEmpty().withMessage('Department code is required'),
  body('parentDepartment').optional().isMongoId().withMessage('Valid parent department ID required')
];
