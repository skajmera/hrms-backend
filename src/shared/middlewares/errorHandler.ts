import { Request, Response, NextFunction } from 'express';
import { config } from '../../config/env';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error in development
  if (config.nodeEnv === 'development') {
    console.error('❌ Error:', err);
  }

  // Send error response
  res.status(statusCode).json({
    status: 'error',
    message,
    ...(config.nodeEnv === 'development' && {
      stack: err.stack,
      error: err
    })
  });
};

/**
 * Handle async errors
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Create custom error
 */
export class CustomError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle 404 errors
 */
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new CustomError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

/**
 * Handle mongoose validation errors
 */
export const handleValidationError = (err: any): AppError => {
  const errors = Object.values(err.errors).map((e: any) => e.message);
  const message = `Validation Error: ${errors.join(', ')}`;
  return new CustomError(message, 400);
};

/**
 * Handle mongoose duplicate key errors
 */
export const handleDuplicateKeyError = (err: any): AppError => {
  const field = Object.keys(err.keyValue)[0];
  const message = `${field} already exists`;
  return new CustomError(message, 409);
};

/**
 * Handle mongoose cast errors
 */
export const handleCastError = (err: any): AppError => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new CustomError(message, 400);
};