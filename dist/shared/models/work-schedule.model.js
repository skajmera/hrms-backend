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
exports.WorkScheduleModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const WorkingDaySchema = new mongoose_1.Schema({
    isWorking: { type: Boolean, default: false },
    startTime: { type: String },
    endTime: { type: String },
    duration: { type: Number, default: 0 }
}, { _id: false });
const WorkScheduleSchema = new mongoose_1.Schema({
    organizationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    scheduleName: {
        type: String,
        required: true
    },
    scheduleType: {
        type: String,
        enum: ['DURATION_BASED', 'CLOCK_BASED'],
        required: true
    },
    effectiveFrom: {
        type: Date,
        required: true
    },
    standardWorkingHoursPerDay: {
        type: Number,
        default: 8
    },
    workingDays: {
        monday: { type: WorkingDaySchema, default: () => ({}) },
        tuesday: { type: WorkingDaySchema, default: () => ({}) },
        wednesday: { type: WorkingDaySchema, default: () => ({}) },
        thursday: { type: WorkingDaySchema, default: () => ({}) },
        friday: { type: WorkingDaySchema, default: () => ({}) },
        saturday: { type: WorkingDaySchema, default: () => ({}) },
        sunday: { type: WorkingDaySchema, default: () => ({}) }
    },
    totalWeeklyHours: {
        type: Number,
        default: 40
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});
// Indexes
WorkScheduleSchema.index({ organizationId: 1 });
WorkScheduleSchema.index({ isDefault: 1 });
// Calculate total weekly hours before save
WorkScheduleSchema.pre('save', function (next) {
    let totalHours = 0;
    Object.keys(this.workingDays).forEach((day) => {
        const dayData = this.workingDays[day];
        if (dayData.isWorking && dayData.duration) {
            totalHours += dayData.duration;
        }
    });
    this.totalWeeklyHours = totalHours;
    next();
});
exports.WorkScheduleModel = mongoose_1.default.model('WorkSchedule', WorkScheduleSchema);
//# sourceMappingURL=work-schedule.model.js.map