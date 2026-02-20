import { IAttendanceCreateInput } from '../../../../shared/interfaces/attendance.interface';
export declare class EmployeeAttendanceService {
    /**
     * Mark own attendance
     */
    markMyAttendance(userId: string, attendanceData: Omit<IAttendanceCreateInput, 'userId'>): Promise<import("../../../../shared/interfaces/attendance.interface").IAttendance>;
    /**
     * Check out - calculate working hours
     */
    checkOut(userId: string, attendanceId: string): Promise<import("../../../../shared/interfaces/attendance.interface").IAttendance | null>;
    /**
     * Get own attendance history
     */
    getMyAttendance(userId: string, startDate: Date, endDate: Date): Promise<import("../../../../shared/interfaces/attendance.interface").IAttendance[]>;
    /**
     * Get my attendance summary
     */
    getMyAttendanceSummary(userId: string, month: number, year: number): Promise<any>;
}
export declare const employeeAttendanceService: EmployeeAttendanceService;
//# sourceMappingURL=attendance.service.d.ts.map