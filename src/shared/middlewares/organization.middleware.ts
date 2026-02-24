import { Request, Response, NextFunction } from 'express';
import { OrganizationDAL } from '../dal/organization.dal';
import { HTTP_STATUS } from '../../config/constants';
import { AuthRequest } from './auth.middleware';
/**
 * Middleware to check if user belongs to organization
 */
export const checkOrganizationAccess = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const organizationId = req.params.id || req.body.organizationId || req.query.organizationId;
    const userId = req.user?.id;

    if (!organizationId) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: 'Organization ID is required'
      });
      return;
    }

    const hasAccess = await OrganizationDAL.isUserInOrganization(organizationId as string, userId);

    if (!hasAccess) {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        status: 'error',
        message: 'You do not have access to this organization'
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to attach user's organization to request
 */
export const attachOrganization = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const organization = await OrganizationDAL.findByOwner(userId);
    
    if (organization) {
      req.user = {
        ...req.user,
        organizationId: organization._id.toString()
      };
    }

    next();
  } catch (error) {
    next(error);
  }
};