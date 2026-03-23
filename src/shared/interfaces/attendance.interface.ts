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

  // Time tracking
  checkInTime?: Date;
  checkOutTime?: Date;
  workingHours?: number;
  breakHours?: number;

  // Late/Early tracking
  isLate?: boolean;
  lateByMinutes?: number;
  earlyExit?: boolean;
  earlyExitByMinutes?: number;

  // Additional info
  remarks?: string;
  biometricId?: string;

  // Location tracking (for WFH/Field work)
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
    address?: string;
  };

  // Approval
  isApproved?: boolean;
  approvedBy?: Types.ObjectId | string;
  approvedAt?: Date;

  // Overtime
  overtimeHours?: number;
  overtimeApproved?: boolean;

  // Zero-Trust Fields
  deviceId?: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
  wifiBSSID?: string;
  isMockLocation?: boolean;
  selfie?: string; // URL or path
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

  // Zero-Trust Payload Fields
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