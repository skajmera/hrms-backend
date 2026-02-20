import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
export declare class EmployeeAttendanceController {
    markMyAttendance(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getMyAttendance(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getMyAttendanceSummary(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const employeeAttendanceController: EmployeeAttendanceController;
//# sourceMappingURL=attendance.controller.d.ts.map