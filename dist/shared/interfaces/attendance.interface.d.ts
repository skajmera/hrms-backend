import { Document, Types } from 'mongoose';
import { ATTENDANCE_STATUS, SHIFT_TYPES } from '../../config/constants';
/**
 * Attendance related interfaces
 */
export interface IAttendance extends Document {
    userId: Types.ObjectId | string;
    date: Date;
    status: keyof typeof ATTENDANCE_STATUS;
    shift: keyof typeof SHIFT_TYPES;
    checkInTime?: Date;
    checkOutTime?: Date;
    workingHours?: number;
    breakHours?: number;
    isLate?: boolean;
    lateByMinutes?: number;
    earlyExit?: boolean;
    earlyExitByMinutes?: number;
    remarks?: string;
    biometricId?: string;
    location?: {
        type: 'Point';
        coordinates: [number, number];
        address?: string;
    };
    isApproved?: boolean;
    approvedBy?: Types.ObjectId | string;
    approvedAt?: Date;
    overtimeHours?: number;
    overtimeApproved?: boolean;
    deviceId?: string;
    gpsLatitude?: number;
    gpsLongitude?: number;
    wifiBSSID?: string;
    isMockLocation?: boolean;
    selfie?: string;
    clientRequestId?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IAttendanceCreateInput {
    userId: string;
    date: Date;
    status: keyof typeof ATTENDANCE_STATUS;
    shift: keyof typeof SHIFT_TYPES;
    checkInTime?: Date;
    checkOutTime?: Date;
    remarks?: string;
    isLate?: boolean;
    lateByMinutes?: number;
    earlyExit?: boolean;
    earlyExitByMinutes?: number;
    location?: {
        type: 'Point';
        coordinates: [number, number];
        address?: string;
    };
    workingHours?: number;
    breakHours?: number;
    overtimeHours?: number;
    isApproved?: boolean;
    deviceId?: string;
    gpsLatitude?: number;
    gpsLongitude?: number;
    wifiBSSID?: string;
    isMockLocation?: boolean;
    selfie?: string;
    clientRequestId?: string;
}
export interface IAttendanceReport {
    userId: string;
    userName: string;
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    wfhDays: number;
    halfDays: number;
    totalWorkingHours: number;
    averageWorkingHours: number;
}
//# sourceMappingURL=attendance.interface.d.ts.map