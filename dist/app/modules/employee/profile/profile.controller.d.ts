import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
export declare class EmployeeProfileController {
    getMyProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    updateMyProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    changePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const employeeProfileController: EmployeeProfileController;
//# sourceMappingURL=profile.controller.d.ts.map