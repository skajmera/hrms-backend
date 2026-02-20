import { Request, Response, NextFunction } from 'express';
import { ValidationChain } from 'express-validator';
/**
 * Validation middleware
 */
export declare const validate: (validations: ValidationChain[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Sanitize request body
 */
export declare const sanitizeBody: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validation.d.ts.map