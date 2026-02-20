"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCastError = exports.handleDuplicateKeyError = exports.handleValidationError = exports.notFound = exports.CustomError = exports.asyncHandler = exports.errorHandler = void 0;
const env_1 = require("../../config/env");
/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    // Log error in development
    if (env_1.config.nodeEnv === 'development') {
        console.error('❌ Error:', err);
    }
    // Send error response
    res.status(statusCode).json({
        status: 'error',
        message,
        ...(env_1.config.nodeEnv === 'development' && {
            stack: err.stack,
            error: err
        })
    });
};
exports.errorHandler = errorHandler;
/**
 * Handle async errors
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
/**
 * Create custom error
 */
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomError = CustomError;
/**
 * Handle 404 errors
 */
const notFound = (req, res, next) => {
    const error = new CustomError(`Route ${req.originalUrl} not found`, 404);
    next(error);
};
exports.notFound = notFound;
/**
 * Handle mongoose validation errors
 */
const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map((e) => e.message);
    const message = `Validation Error: ${errors.join(', ')}`;
    return new CustomError(message, 400);
};
exports.handleValidationError = handleValidationError;
/**
 * Handle mongoose duplicate key errors
 */
const handleDuplicateKeyError = (err) => {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    return new CustomError(message, 409);
};
exports.handleDuplicateKeyError = handleDuplicateKeyError;
/**
 * Handle mongoose cast errors
 */
const handleCastError = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new CustomError(message, 400);
};
exports.handleCastError = handleCastError;
//# sourceMappingURL=errorHandler.js.map