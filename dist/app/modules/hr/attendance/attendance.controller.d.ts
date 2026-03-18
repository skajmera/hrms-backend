import { Response, NextFunction } from 'express';
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
    getAttendanceById(req: any, res: Response, next: NextFunction): Promise<void>;
    getAllAttendance(req: any, res: Response, next: NextFunction): Promise<void>;
    updateAttendance(req: any, res: Response, next: NextFunction): Promise<void>;
    deleteAttendance(req: any, res: Response, next: NextFunction): Promise<void>;
    getTodayAttendance(req: any, res: Response, next: NextFunction): Promise<void>;
    getUserAttendanceReport(req: any, res: Response, next: NextFunction): Promise<void>;
    getEmployeeTodayAttendance(req: any, res: Response, next: NextFunction): Promise<void>;
    /**
     * HR upsert attendance (create or update for a specific date)
     * POST /api/v1/hr/attendance/admin/upsert
     */
    upsertAttendanceByAdmin(req: any, res: Response, next: NextFunction): Promise<void>;
}
export declare const attendanceController: AttendanceController;
//# sourceMappingURL=attendance.controller.d.ts.map