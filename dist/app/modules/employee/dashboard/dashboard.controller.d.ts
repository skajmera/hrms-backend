import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
export declare class EmployeeDashboardController {
    getMyDashboard(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getBirthdays(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getAnniversary(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getNewHires(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getAllAnnouncements(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const employeeDashboardController: EmployeeDashboardController;
//# sourceMappingURL=dashboard.controller.d.ts.map