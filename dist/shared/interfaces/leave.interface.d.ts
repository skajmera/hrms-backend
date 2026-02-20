import { Document, Types } from 'mongoose';
import { LEAVE_STATUS, LEAVE_TYPES } from '../../config/constants';
/**
 * Leave related interfaces
 */
export interface ILeave extends Document {
    userId: Types.ObjectId | string | any;
    leaveType: keyof typeof LEAVE_TYPES;
    startDate: Date;
    endDate: Date;
    numberOfDays: number;
    halfDay?: {
        isHalfDay: boolean;
        halfDayDate?: Date;
        session?: 'FIRST_HALF' | 'SECOND_HALF';
    };
    reason: string;
    status: keyof typeof LEAVE_STATUS;
    appliedDate: Date;
    approvedBy?: Types.ObjectId | string;
    approvedDate?: Date;
    rejectedBy?: Types.ObjectId | string;
    rejectedDate?: Date;
    rejectionReason?: string;
    attachments?: string[];
    contactDuringLeave?: string;
    addressDuringLeave?: string;
    handoverTo?: Types.ObjectId | string;
    handoverNotes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ILeaveBalance extends Document {
    userId: Types.ObjectId | string;
    year: number;
    casualLeave: {
        total: number;
        used: number;
        remaining: number;
    };
    sickLeave: {
        total: number;
        used: number;
        remaining: number;
    };
    earnedLeave: {
        total: number;
        used: number;
        remaining: number;
    };
    maternityLeave?: {
        total: number;
        used: number;
        remaining: number;
    };
    paternityLeave?: {
        total: number;
        used: number;
        remaining: number;
    };
    createdAt: Date;
    updatedAt: Date;
}
export interface ILeaveCreateInput {
    userId: string;
    leaveType: keyof typeof LEAVE_TYPES;
    startDate: Date;
    endDate: Date;
    reason: string;
    halfDay?: {
        isHalfDay: boolean;
        halfDayDate?: Date;
        session?: 'FIRST_HALF' | 'SECOND_HALF';
    };
    contactDuringLeave?: string;
    addressDuringLeave?: string;
    attachments?: string[];
}
//# sourceMappingURL=leave.interface.d.ts.map