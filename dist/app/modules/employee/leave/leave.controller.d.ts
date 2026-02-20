import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
export declare class EmployeeLeaveController {
    applyLeave(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getMyLeaves(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getMyLeaveBalance(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    cancelLeave(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const employeeLeaveController: EmployeeLeaveController;
//# sourceMappingURL=leave.controller.d.ts.map