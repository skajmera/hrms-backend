import { IAttendanceCreateInput } from '../../../../shared/interfaces/attendance.interface';
export declare class EmployeeAttendanceService {
    /**
     * Mark own attendance (Check-In or Check-Out)
     */
    markMyAttendance(userId: string, attendanceData: Omit<IAttendanceCreateInput, 'userId'>): Promise<import("../../../../shared/interfaces/attendance.interface").IAttendance | null>;
    /**
     * Check out - calculate working hours
     */
    checkOut(userId: string, attendanceId: string): Promise<import("../../../../shared/interfaces/attendance.interface").IAttendance | null>;
    /**
     * Get own attendance history with advanced filtering
     */
    getMyAttendance(userId: string, startDate: Date, endDate: Date, filters?: any): Promise<import("../../../../shared/interfaces/attendance.interface").IAttendance[]>;
    /**
     * Get my attendance summary
     */
    getMyAttendanceSummary(userId: string, month: number, year: number): Promise<any>;
    /**
     * Get my today attendance
     */
    getTodayAttendance(userId: string): Promise<import("../../../../shared/interfaces/attendance.interface").IAttendance | null>;
}
export declare const employeeAttendanceService: EmployeeAttendanceService;
//# sourceMappingURL=attendance.service.d.ts.map