"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveBalanceModel = exports.LeaveModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const constants_1 = require("../../config/constants");
const LeaveSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    leaveType: {
        type: String,
        enum: Object.values(constants_1.LEAVE_TYPES),
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
        enum: Object.values(constants_1.LEAVE_STATUS),
        default: constants_1.LEAVE_STATUS.PENDING
    },
    // Dates
    appliedDate: { type: Date, default: Date.now },
    approvedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    approvedDate: { type: Date },
    rejectedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    rejectedDate: { type: Date },
    rejectionReason: { type: String },
    // Additional info
    attachments: [{ type: String }],
    contactDuringLeave: { type: String },
    addressDuringLeave: { type: String },
    // Handover details
    handoverTo: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
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
exports.LeaveModel = mongoose_1.default.model('Leave', LeaveSchema);
// Leave Balance Schema
const LeaveBalanceSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.LeaveBalanceModel = mongoose_1.default.model('LeaveBalance', LeaveBalanceSchema);
//# sourceMappingURL=leave.model.js.map