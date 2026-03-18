import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { sendErrorResponse } from '../utils/response';
import { HTTP_STATUS } from '../../config/constants';

/**
 * Validation middleware
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check for errors
    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
      return next();
    }

    const rawErrors = errors.array();
    // Lightweight debug log to inspect failing payloads and rules
    console.error('[ValidationError]', {
      path: req.path,
      method: req.method,
      errors: rawErrors
    });

    const formattedErrors = rawErrors.map(err => ({
      field: err.type === 'field' ? (err as any).path : 'unknown',
      message: err.msg
    }));

    sendErrorResponse(
      res,
      'Validation failed',
      HTTP_STATUS.BAD_REQUEST,
      formattedErrors
    );
  };
};

/**
 * Sanitize request body
 */
export const sanitizeBody = (req: Request, res: Response, next: NextFunction): void => {
  if (req.body) {
    // Remove any fields starting with $
    Object.keys(req.body).forEach(key => {
      if (key.startsWith('$')) {
        delete req.body[key];
      }
    });
  }
  next();
};