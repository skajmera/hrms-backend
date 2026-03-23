import { IAttendance, IAttendanceCreateInput } from '../../../../shared/interfaces/attendance.interface';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';
export declare class AttendanceService {
    private normalizeBssid;
    private pickUserId;
    /**
     * Mark attendance with Zero-Trust Validation
     */
    markAttendance(attendanceData: IAttendanceCreateInput): Promise<{
        type: string;
        attendance: IAttendance | null;
    }>;
    /**
     * Register Device & Face (One-time setup)
     */
    registerDevice(registrationData: {
        userId: string;
        deviceId: string;
        selfie: string;
        gpsLatitude?: number;
        gpsLongitude?: number;
        wifiBSSID?: string;
    }): Promise<{
        message: string;
        registeredDeviceId: string;
        isFaceRegistered: boolean;
    }>;
    /**
     * Helper to perform multi-layered validation
     */
    private validateAttendance;
    /**
     * Get attendance by ID
     */
    getAttendanceById(id: string): Promise<IAttendance>;
    /**
     * Get all attendance records
     */
    getAllAttendance(filters: any, options: IPaginationOptions): Promise<{
        records: IAttendance[];
        total: number;
    }>;
    /**
     * Update attendance
     */
    updateAttendance(id: string, updateData: any): Promise<IAttendance | null>;
    /**
     * Delete attendance
     */
    deleteAttendance(id: string): Promise<IAttendance>;
    /**
     * Upsert attendance for a user by HR (no device/geo/face checks)
     * - If record exists for given user + date -> update it
     * - If not -> create a new record
     */
    upsertAttendanceByAdmin(payload: {
        userId: string;
        date: string | Date;
        status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LATE' | 'WFH' | 'ON_LEAVE';
        shift: string;
        checkInTime?: string | Date;
        checkOutTime?: string | Date;
        remarks?: string;
    }): Promise<{
        attendance: IAttendance | null;
        isNew: boolean;
    }>;
    /**
     * Get today's attendance
     */
    getTodayAttendance(organizationId?: string): Promise<any[]>;
    /**
     * Get user attendance report
     */
    getUserAttendanceReport(userId: string, month: number, year: number): Promise<{
        present: any;
        absent: any;
        wfh: any;
        onLeave: any;
        late: any;
        halfDay: any;
    }>;
    /**
    * Get attendance by date range
    */
    getAttendanceByDateRange(userId: string, startDate: Date, endDate: Date): Promise<IAttendance[]>;
    /**
     * Get today's attendance for a specific employee
     */
    getEmployeeTodayAttendance(userId: string): Promise<IAttendance | null>;
}
export declare const attendanceService: AttendanceService;
//# sourceMappingURL=attendance.service.d.ts.map