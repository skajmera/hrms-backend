import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
export declare class AttendanceController {
    /**
     * Mark attendance (Check-In / Check-Out)
     * POST /api/v1/hr/attendance/mark
     */
    markAttendance(req: any, res: Response, next: NextFunction): Promise<void>;
    /**
     * Register Device & Face (One-time setup)
     * POST /api/v1/hr/attendance/register-device
     */
    registerDevice(req: any, res: Response, next: NextFunction): Promise<void>;
    getAttendanceById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getAllAttendance(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    updateAttendance(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    deleteAttendance(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getTodayAttendance(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getUserAttendanceReport(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getEmployeeTodayAttendance(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const attendanceController: AttendanceController;
//# sourceMappingURL=attendance.controller.d.ts.map