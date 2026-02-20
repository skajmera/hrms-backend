import { Response } from 'express';
/**
 * Send success response
 */
export declare const sendSuccessResponse: <T>(res: Response, message: string, data?: T, statusCode?: number) => void;
/**
 * Send error response
 */
export declare const sendErrorResponse: (res: Response, message: string, statusCode?: number, error?: any) => void;
/**
 * Send paginated response
 */
export declare const sendPaginatedResponse: <T>(res: Response, data: T[], total: number, page: number, limit: number, message?: string) => void;
//# sourceMappingURL=response.d.ts.map