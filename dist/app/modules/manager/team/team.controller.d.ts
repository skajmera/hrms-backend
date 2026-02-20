import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
export declare class ManagerTeamController {
    getTeamMembers(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getTeamAttendanceToday(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getTeamLeaveRequests(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getTeamMemberDetails(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const managerTeamController: ManagerTeamController;
//# sourceMappingURL=team.controller.d.ts.map