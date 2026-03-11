import { IAttendance, IAttendanceCreateInput, IAttendanceReport } from '../interfaces/attendance.interface';
import { IQueryFilters, IPaginationOptions } from '../interfaces/common.interface';
export declare class AttendanceDAL {
    /**
     * Mark attendance
     */
    create(attendanceData: IAttendanceCreateInput): Promise<IAttendance>;
    /**
     * Find attendance by ID
     */
    findById(id: string): Promise<IAttendance | null>;
    /**
     * Find attendance by user and date
     */
    findByUserAndDate(userId: string, date: Date): Promise<IAttendance | null>;
    /**
     * Find all attendance records
     */
    findAll(filters?: IQueryFilters, options?: IPaginationOptions): Promise<{
        records: IAttendance[];
        total: number;
    }>;
    /**
     * Update attendance
     */
    update(id: string, updateData: Partial<IAttendance>): Promise<IAttendance | null>;
    /**
     * Delete attendance
     */
    delete(id: string): Promise<IAttendance | null>;
    /**
     * Get attendance by user and date range
     */
    findByUserAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<IAttendance[]>;
    /**
     * Get today's attendance
     */
    getTodayAttendance(): Promise<IAttendance[]>;
    /**
     * Get attendance statistics for a user
     */
    getUserAttendanceStats(userId: string, month: number, year: number): Promise<any>;
    /**
     * Get monthly check-in summary (total, late, on-time)
     */
    getUserMonthlyCheckInSummary(userId: string, month: number, year: number): Promise<any>;
    /**
     * Get monthly check-in summary for all users (total, late, on-time)
     */
    getMonthlyCheckInSummary(month: number, year: number): Promise<any>;
    /**
     * Get late arrivals
     */
    getLateArrivals(startDate: Date, endDate: Date): Promise<IAttendance[]>;
    /**
     * Get department-wise attendance
     */
    getDepartmentAttendance(departmentId: string, date: Date): Promise<any>;
    /**
     * Bulk create attendance
     */
    bulkCreate(attendanceRecords: IAttendanceCreateInput[]): Promise<IAttendance[]>;
    /**
   * Get late arrivals count for a specific month and year
   */
    getLateArrivalsCount(userId: string, month: number, year: number): Promise<number>;
    /**
     * Get late arrivals details for a specific month and year
     */
    getLateArrivalsWithUser(userId: string, month: number, year: number): Promise<IAttendance[]>;
    /**
      * Get daily attendance summary
      */
    static getDailySummary(date: Date): Promise<any>;
    /**
      * Get monthly attendance report
      */
    getMonthlyReport(userId: string, month: number, year: number): Promise<IAttendanceReport>;
    /**
       * Get WFH count for month
       */
    static getWFHCount(userId: string, month: number, year: number): Promise<number>;
}
export declare const attendanceDAL: AttendanceDAL;
//# sourceMappingURL=attendance.dal.d.ts.map