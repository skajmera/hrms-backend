import mongoose, { Schema } from 'mongoose';
import { ILeave, ILeaveBalance } from '../interfaces/leave.interface';
import { LEAVE_STATUS, LEAVE_TYPES } from '../../config/constants';

const LeaveSchema = new Schema<ILeave>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    leaveType: {
        type: String,
        enum: Object.values(LEAVE_TYPES),
        required: true
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    numberOfDays: { type: Number, required: true },
    halfDay: {
        isHalfDay: { type: Boolean, default: false },
        halfDayDate: { type: Date },
        session: { type: String, enum: ['FIRST_HALF', 'SECOND_HALF'] }
    },
    reason: { type: String, required: true },
    status: {
        type: String,
        enum: Object.values(LEAVE_STATUS),
        default: LEAVE_STATUS.PENDING
    },
    // Dates
    appliedDate: { type: Date, default: Date.now },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    approvedDate: { type: Date },
    rejectedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    rejectedDate: { type: Date },
    rejectionReason: { type: String },
    // Additional info
    attachments: [{ type: String }],
    contactDuringLeave: { type: String },
    addressDuringLeave: { type: String },
    // Handover details
    handoverTo: { type: Schema.Types.ObjectId, ref: 'User' },
    handoverNotes: { type: String }
}, {
    timestamps: true
});
// Indexes
LeaveSchema.index({ userId: 1, startDate: 1 });
LeaveSchema.index({ status: 1 });
LeaveSchema.index({ leaveType: 1 });
// Calculate number of days before save
LeaveSchema.pre('save', function (next) {
    if (this.startDate && this.endDate) {
        const diffTime = Math.abs(this.endDate.getTime() - this.startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        this.numberOfDays = this.halfDay?.isHalfDay ? diffDays - 0.5 : diffDays;
    }
    next();
});
export const LeaveModel = mongoose.model<ILeave>('Leave', LeaveSchema);


// Leave Balance Schema
const LeaveBalanceSchema = new Schema<ILeaveBalance>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    year: { type: Number, required: true },
    casualLeave: {
        total: { type: Number, default: 12 },
        used: { type: Number, default: 0 },
        remaining: { type: Number, default: 12 }
    },
    sickLeave: {
        total: { type: Number, default: 10 },
        used: { type: Number, default: 0 },
        remaining: { type: Number, default: 10 }
    },
    earnedLeave: {
        total: { type: Number, default: 15 },
        used: { type: Number, default: 0 },
        remaining: { type: Number, default: 15 }
    },
    maternityLeave: {
        total: { type: Number, default: 180 },
        used: { type: Number, default: 0 },
        remaining: { type: Number, default: 180 }
    },
    paternityLeave: {
        total: { type: Number, default: 15 },
        used: { type: Number, default: 0 },
        remaining: { type: Number, default: 15 }
    }
}, {
    timestamps: true
});
// Indexes
LeaveBalanceSchema.index({ userId: 1, year: 1 }, { unique: true });
export const LeaveBalanceModel = mongoose.model<ILeaveBalance>('LeaveBalance', LeaveBalanceSchema);
