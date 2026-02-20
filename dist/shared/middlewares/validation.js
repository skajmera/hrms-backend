"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeBody = exports.validate = void 0;
const express_validator_1 = require("express-validator");
const response_1 = require("../utils/response");
const constants_1 = require("../../config/constants");
/**
 * Validation middleware
 */
const validate = (validations) => {
    return async (req, res, next) => {
        // Run all validations
        await Promise.all(validations.map(validation => validation.run(req)));
        // Check for errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            return next();
        }
        // Format errors
        const formattedErrors = errors.array().map(err => ({
            field: err.type === 'field' ? err.path : 'unknown',
            message: err.msg
        }));
        (0, response_1.sendErrorResponse)(res, 'Validation failed', constants_1.HTTP_STATUS.BAD_REQUEST, formattedErrors);
    };
};
exports.validate = validate;
/**
 * Sanitize request body
 */
const sanitizeBody = (req, res, next) => {
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
exports.sanitizeBody = sanitizeBody;
//# sourceMappingURL=validation.js.map