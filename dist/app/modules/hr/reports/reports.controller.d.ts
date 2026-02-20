import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
export declare class ReportsController {
    getAttendanceReport(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getLeaveReport(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getPayrollReport(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getHeadcountReport(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const reportsController: ReportsController;
//# sourceMappingURL=reports.controller.d.ts.map