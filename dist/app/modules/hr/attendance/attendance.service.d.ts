import { IAttendanceCreateInput } from '../../../../shared/interfaces/attendance.interface';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';
export declare class AttendanceService {
    /**
     * Mark attendance
     */
    markAttendance(attendanceData: IAttendanceCreateInput): Promise<import("../../../../shared/interfaces/attendance.interface").IAttendance>;
    /**
     * Get attendance by ID
     */
    getAttendanceById(id: string): Promise<import("../../../../shared/interfaces/attendance.interface").IAttendance>;
    /**
     * Get all attendance records
     */
    getAllAttendance(filters: any, options: IPaginationOptions): Promise<{
        records: import("../../../../shared/interfaces/attendance.interface").IAttendance[];
        total: number;
    }>;
    /**
     * Update attendance
     */
    updateAttendance(id: string, updateData: any): Promise<import("../../../../shared/interfaces/attendance.interface").IAttendance | null>;
    /**
     * Delete attendance
     */
    deleteAttendance(id: string): Promise<import("../../../../shared/interfaces/attendance.interface").IAttendance>;
    /**
     * Get today's attendance
     */
    getTodayAttendance(): Promise<any[]>;
    /**
     * Get user attendance report
     */
    getUserAttendanceReport(userId: string, month: number, year: number): Promise<any>;
    /**
     * Get attendance by date range
     */
    getAttendanceByDateRange(userId: string, startDate: Date, endDate: Date): Promise<import("../../../../shared/interfaces/attendance.interface").IAttendance[]>;
}
export declare const attendanceService: AttendanceService;
//# sourceMappingURL=attendance.service.d.ts.map