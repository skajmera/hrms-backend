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
exports.AttendanceModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const constants_1 = require("../../config/constants");
const AttendanceSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(constants_1.ATTENDANCE_STATUS),
        required: true
    },
    shift: {
        type: String,
        enum: Object.values(constants_1.SHIFT_TYPES),
        required: true
    },
    // Time tracking
    checkInTime: { type: Date },
    checkOutTime: { type: Date },
    workingHours: { type: Number, default: 0 },
    breakHours: { type: Number, default: 0 },
    // Late/Early tracking
    isLate: { type: Boolean, default: false },
    lateByMinutes: { type: Number, default: 0 },
    earlyExit: { type: Boolean, default: false },
    earlyExitByMinutes: { type: Number, default: 0 },
    // Additional info
    remarks: { type: String },
    biometricId: { type: String },
    // Location tracking
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        },
        address: { type: String }
    },
    // Approval
    isApproved: { type: Boolean, default: false },
    approvedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    // Overtime
    overtimeHours: { type: Number, default: 0 },
    overtimeApproved: { type: Boolean, default: false },
    // Zero-Trust Fields
    deviceId: { type: String },
    gpsLatitude: { type: Number },
    gpsLongitude: { type: Number },
    wifiBSSID: { type: String },
    isMockLocation: { type: Boolean, default: false },
    selfie: { type: String },
    clientRequestId: { type: String }
}, {
    timestamps: true,
    toJSON: {
        transform: (_doc, ret) => {
            if (typeof ret?.workingHours === 'number')
                ret.workingHours = Math.round((ret.workingHours + Number.EPSILON) * 100) / 100;
            if (typeof ret?.overtimeHours === 'number')
                ret.overtimeHours = Math.round((ret.overtimeHours + Number.EPSILON) * 100) / 100;
            return ret;
        }
    },
    toObject: {
        transform: (_doc, ret) => {
            if (typeof ret?.workingHours === 'number')
                ret.workingHours = Math.round((ret.workingHours + Number.EPSILON) * 100) / 100;
            if (typeof ret?.overtimeHours === 'number')
                ret.overtimeHours = Math.round((ret.overtimeHours + Number.EPSILON) * 100) / 100;
            return ret;
        }
    }
});
// Indexes
AttendanceSchema.index({ userId: 1, date: 1 }, { unique: true });
AttendanceSchema.index({ date: 1 });
AttendanceSchema.index({ status: 1 });
AttendanceSchema.index({ location: '2dsphere' });
// Calculate working hours before save
AttendanceSchema.pre('save', function (next) {
    if (this.checkInTime && this.checkOutTime) {
        const diffMs = this.checkOutTime.getTime() - this.checkInTime.getTime();
        this.workingHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
    }
    next();
});
exports.AttendanceModel = mongoose_1.default.model('Attendance', AttendanceSchema);
//# sourceMappingURL=attendance.model.js.map