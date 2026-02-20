import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
export declare class ManagerLeaveController {
    approveLeave(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    rejectLeave(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const managerLeaveController: ManagerLeaveController;
//# sourceMappingURL=leave.controller.d.ts.map