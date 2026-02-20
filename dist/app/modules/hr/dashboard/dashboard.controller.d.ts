import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
export declare class DashboardController {
    getDashboardStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getBirthdays(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getNewHires(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getRecentAnnouncements(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getAnniversary(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * ✅ NEW - Get leave statistics
     */
    getLeaveStatistics(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * ✅ NEW - Get top leave takers
     */
    getTopLeaveTakers(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const dashboardController: DashboardController;
//# sourceMappingURL=dashboard.controller.d.ts.map