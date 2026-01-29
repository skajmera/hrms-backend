import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config/env';
import { userDAL } from '../dal/user.dal';
import { sendErrorResponse } from '../utils/response';
import { HTTP_STATUS, USER_ROLES } from '../../config/constants';

export interface AuthRequest extends Request {
  user?: any;
}

/**
 * Verify JWT token and authenticate user
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendErrorResponse(res, 'No token provided', HTTP_STATUS.UNAUTHORIZED);
      return;
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded: any = jwt.verify(token, config.jwt.secret);

    // Get user from database
    const user = await userDAL.findById(decoded.id);

    if (!user) {
      sendErrorResponse(res, 'User not found', HTTP_STATUS.UNAUTHORIZED);
      return;
    }

    if (!user.isActive) {
      sendErrorResponse(res, 'User account is deactivated', HTTP_STATUS.UNAUTHORIZED);
      return;
    }

    // Attach user to request
    req.user = user;
    next();

  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      sendErrorResponse(res, 'Invalid token', HTTP_STATUS.UNAUTHORIZED);
    } else if (error.name === 'TokenExpiredError') {
      sendErrorResponse(res, 'Token expired', HTTP_STATUS.UNAUTHORIZED);
    } else {
      sendErrorResponse(res, 'Authentication failed', HTTP_STATUS.UNAUTHORIZED);
    }
  }
};

/**
 * Authorize based on user roles
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendErrorResponse(res, 'Not authenticated', HTTP_STATUS.UNAUTHORIZED);
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendErrorResponse(
        res,
        'You do not have permission to perform this action',
        HTTP_STATUS.FORBIDDEN
      );
      return;
    }

    next();
  };
};

/**
 * Optional authentication - ajmerasn't fail if no token
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded: any = jwt.verify(token, config.jwt.secret);
      const user = await userDAL.findById(decoded.id);
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without user
    next();
  }
};

/**
 * Check if user owns the resource or is admin
 */
export const authorizeOwnerOrAdmin = (userIdParam: string = 'id') => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendErrorResponse(res, 'Not authenticated', HTTP_STATUS.UNAUTHORIZED);
      return;
    }

    const requestedUserId = req.params[userIdParam] || req.body.userId;
    const isOwner = req.user._id.toString() === requestedUserId;
    const isAdmin = [USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN].includes(req.user.role);

    if (!isOwner && !isAdmin) {
      sendErrorResponse(
        res,
        'You can only access your own resources',
        HTTP_STATUS.FORBIDDEN
      );
      return;
    }

    next();
  };
};