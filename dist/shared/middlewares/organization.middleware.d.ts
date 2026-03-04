import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
/**
 * Middleware to check if user belongs to organization
 */
export declare const checkOrganizationAccess: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Middleware to attach user's organization to request
 */
export declare const attachOrganization: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=organization.middleware.d.ts.map