import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
export declare class LeaveController {
    applyLeave(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getLeaveById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getAllLeaves(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    approveLeave(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    rejectLeave(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getPendingLeaves(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getEmployeesOnLeaveToday(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getLeaveBalance(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const leaveController: LeaveController;
//# sourceMappingURL=leave.controller.d.ts.map