import { Request, Response, NextFunction } from 'express';
export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}
/**
 * Global error handler middleware
 */
export declare const errorHandler: (err: AppError, req: Request, res: Response, next: NextFunction) => void;
/**
 * Handle async errors
 */
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
/**
 * Create custom error
 */
export declare class CustomError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode: number);
}
/**
 * Handle 404 errors
 */
export declare const notFound: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Handle mongoose validation errors
 */
export declare const handleValidationError: (err: any) => AppError;
/**
 * Handle mongoose duplicate key errors
 */
export declare const handleDuplicateKeyError: (err: any) => AppError;
/**
 * Handle mongoose cast errors
 */
export declare const handleCastError: (err: any) => AppError;
//# sourceMappingURL=errorHandler.d.ts.map