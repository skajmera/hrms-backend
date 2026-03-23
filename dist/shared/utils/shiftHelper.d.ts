import { IShiftTime } from '../interfaces/user.interface';
export declare class ShiftHelper {
    private static roundToTwo;
    /**
     * Check if employee is late based on shift time
     */
    static isLate(checkInTime: Date, shiftTime: IShiftTime): {
        isLate: boolean;
        lateByMinutes: number;
    };
    /**
     * Check if employee left early
     */
    static isEarlyExit(checkOutTime: Date, shiftTime: IShiftTime): {
        earlyExit: boolean;
        earlyExitByMinutes: number;
    };
    /**
     * Calculate working hours
     */
    static calculateWorkingHours(checkInTime: Date, checkOutTime: Date, breakHours?: number): number;
    /**
     * Calculate overtime hours
     */
    static calculateOvertimeHours(workingHours: number, shiftTime: IShiftTime): number;
    /**
     * Check if working hours meet minimum requirement
     */
    static meetsMinimumHours(workingHours: number, shiftTime: IShiftTime): boolean;
    /**
     * Get shift status based on check-in time
     */
    static getShiftStatus(checkInTime: Date | null, shiftTime: IShiftTime): 'ON_TIME' | 'LATE' | 'NOT_MARKED';
    /**
     * Parse time string to minutes
     */
    static timeToMinutes(timeStr: string): number;
    /**
     * Convert minutes to time string
     */
    static minutesToTime(minutes: number): string;
    /**
     * Check if current time is within shift time
     */
    static isWithinShift(currentTime: Date, shiftTime: IShiftTime): boolean;
}
//# sourceMappingURL=shiftHelper.d.ts.map