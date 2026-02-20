"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeOwnerOrAdmin = exports.optionalAuth = exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const user_dal_1 = require("../dal/user.dal");
const response_1 = require("../utils/response");
const constants_1 = require("../../config/constants");
/**
 * Verify JWT token and authenticate user
 */
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            (0, response_1.sendErrorResponse)(res, 'No token provided', constants_1.HTTP_STATUS.UNAUTHORIZED);
            return;
        }
        const token = authHeader.split(' ')[1];
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, env_1.config.jwt.secret);
        // Get user from database
        const user = await user_dal_1.userDAL.findById(decoded.id);
        if (!user) {
            (0, response_1.sendErrorResponse)(res, 'User not found', constants_1.HTTP_STATUS.UNAUTHORIZED);
            return;
        }
        if (!user.isActive) {
            (0, response_1.sendErrorResponse)(res, 'User account is deactivated', constants_1.HTTP_STATUS.UNAUTHORIZED);
            return;
        }
        // Attach user to request
        req.user = user;
        next();
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError') {
            (0, response_1.sendErrorResponse)(res, 'Invalid token', constants_1.HTTP_STATUS.UNAUTHORIZED);
        }
        else if (error.name === 'TokenExpiredError') {
            (0, response_1.sendErrorResponse)(res, 'Token expired', constants_1.HTTP_STATUS.UNAUTHORIZED);
        }
        else {
            (0, response_1.sendErrorResponse)(res, 'Authentication failed', constants_1.HTTP_STATUS.UNAUTHORIZED);
        }
    }
};
exports.authenticate = authenticate;
/**
 * Authorize based on user roles
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            (0, response_1.sendErrorResponse)(res, 'Not authenticated', constants_1.HTTP_STATUS.UNAUTHORIZED);
            return;
        }
        if (!roles.includes(req.user.role)) {
            (0, response_1.sendErrorResponse)(res, 'You do not have permission to perform this action', constants_1.HTTP_STATUS.FORBIDDEN);
            return;
        }
        next();
    };
};
exports.authorize = authorize;
/**
 * Optional authentication - ajmerasn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jsonwebtoken_1.default.verify(token, env_1.config.jwt.secret);
            const user = await user_dal_1.userDAL.findById(decoded.id);
            if (user && user.isActive) {
                req.user = user;
            }
        }
        next();
    }
    catch (error) {
        // Continue without user
        next();
    }
};
exports.optionalAuth = optionalAuth;
/**
 * Check if user owns the resource or is admin
 */
const authorizeOwnerOrAdmin = (userIdParam = 'id') => {
    return (req, res, next) => {
        if (!req.user) {
            (0, response_1.sendErrorResponse)(res, 'Not authenticated', constants_1.HTTP_STATUS.UNAUTHORIZED);
            return;
        }
        const requestedUserId = req.params[userIdParam] || req.body.userId;
        const isOwner = req.user._id.toString() === requestedUserId;
        const isAdmin = [constants_1.USER_ROLES.SUPER_ADMIN, constants_1.USER_ROLES.HR_ADMIN].includes(req.user.role);
        if (!isOwner && !isAdmin) {
            (0, response_1.sendErrorResponse)(res, 'You can only access your own resources', constants_1.HTTP_STATUS.FORBIDDEN);
            return;
        }
        next();
    };
};
exports.authorizeOwnerOrAdmin = authorizeOwnerOrAdmin;
//# sourceMappingURL=auth.middleware.js.map