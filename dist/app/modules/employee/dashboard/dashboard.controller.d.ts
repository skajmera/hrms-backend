import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
export declare class EmployeeDashboardController {
    getMyDashboard(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const employeeDashboardController: EmployeeDashboardController;
//# sourceMappingURL=dashboard.controller.d.ts.map