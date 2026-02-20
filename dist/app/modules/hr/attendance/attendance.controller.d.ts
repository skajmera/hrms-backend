import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
export declare class AttendanceController {
    markAttendance(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getAttendanceById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getAllAttendance(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    updateAttendance(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    deleteAttendance(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getTodayAttendance(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getUserAttendanceReport(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const attendanceController: AttendanceController;
//# sourceMappingURL=attendance.controller.d.ts.map