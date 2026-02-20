import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
export declare class AnalyticsController {
    getAttendanceStatistics(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getDepartmentWiseAnalytics(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getEmployeePerformanceAnalytics(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getAttendanceTrend(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getLeaveStatistics(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getRealTimeDashboardStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const analyticsController: AnalyticsController;
//# sourceMappingURL=analytics.controller.d.ts.map