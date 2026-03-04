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
exports.OrganizationModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const OrganizationAddressSchema = new mongoose_1.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true, default: 'India' },
    pincode: { type: String, required: true }
}, { _id: false });
const WorkingDaysSchema = new mongoose_1.Schema({
    monday: { type: Boolean, default: true },
    tuesday: { type: Boolean, default: true },
    wednesday: { type: Boolean, default: true },
    thursday: { type: Boolean, default: true },
    friday: { type: Boolean, default: true },
    saturday: { type: Boolean, default: false },
    sunday: { type: Boolean, default: false }
}, { _id: false });
const LocaleSettingsSchema = new mongoose_1.Schema({
    country: { type: String, default: 'India' },
    timezone: { type: String, default: 'Asia/Kolkata' },
    timeFormat: { type: String, enum: ['12', '24'], default: '12' },
    dateFormat: { type: String, default: 'dd/mm/yyyy' },
    nameFormat: { type: String, enum: ['FIRST_LAST', 'LAST_FIRST'], default: 'FIRST_LAST' }
}, { _id: false });
const OrganizationSettingsSchema = new mongoose_1.Schema({
    workingDays: { type: WorkingDaysSchema, default: () => ({}) },
    workingHours: {
        startTime: { type: String, default: '09:00' },
        endTime: { type: String, default: '18:00' }
    },
    leavePolicy: {
        casualLeave: { type: Number, default: 12 },
        sickLeave: { type: Number, default: 10 },
        earnedLeave: { type: Number, default: 15 }
    },
    payrollSettings: {
        payrollCycle: {
            type: String,
            enum: ['MONTHLY', 'BI_WEEKLY', 'WEEKLY'],
            default: 'MONTHLY'
        },
        paymentDate: { type: Number, default: 1 }
    },
    attendanceSettings: {
        lateArrivalThreshold: { type: Number, default: 15 }, // 15 minutes
        halfDayHours: { type: Number, default: 4 },
        fullDayHours: { type: Number, default: 8 }
    },
    securitySettings: {
        officeLocations: [{
                name: { type: String, required: true },
                latitude: { type: Number, required: true },
                longitude: { type: Number, required: true },
                radius: { type: Number, required: true, default: 100 } // default 100 meters
            }],
        allowedWifiNetworks: [{
                name: { type: String, required: true },
                bssid: { type: String, required: true }
            }],
        requireFaceCapture: { type: Boolean, default: false },
        blockMockLocations: { type: Boolean, default: true }
    },
    locale: { type: LocaleSettingsSchema, default: () => ({}) }
}, { _id: false });
const OrganizationSchema = new mongoose_1.Schema({
    // Basic Info
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    legalName: {
        type: String,
        required: true,
        trim: true
    },
    logo: { type: String },
    website: { type: String },
    industry: { type: String },
    description: { type: String },
    // Contact Details
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: OrganizationAddressSchema,
        required: true
    },
    // Registration Details
    registrationNumber: { type: String },
    taxId: { type: String },
    gstNumber: { type: String },
    panNumber: { type: String },
    // Settings
    settings: {
        type: OrganizationSettingsSchema,
        default: () => ({})
    },
    // Subscription
    subscription: {
        plan: {
            type: String,
            enum: ['FREE', 'BASIC', 'PRO', 'ENTERPRISE'],
            default: 'FREE'
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'INACTIVE', 'TRIAL', 'EXPIRED'],
            default: 'TRIAL'
        },
        startDate: {
            type: Date,
            default: Date.now
        },
        endDate: { type: Date },
        maxEmployees: {
            type: Number,
            default: 10
        }
    },
    // Features
    features: {
        attendance: { type: Boolean, default: true },
        leave: { type: Boolean, default: true },
        payroll: { type: Boolean, default: true },
        performance: { type: Boolean, default: false },
        recruitment: { type: Boolean, default: false },
        offboarding: { type: Boolean, default: true }
    },
    // Admin
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    admins: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }],
    // Status
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
// Indexes
OrganizationSchema.index({ name: 1 });
OrganizationSchema.index({ email: 1 });
OrganizationSchema.index({ owner: 1 });
OrganizationSchema.index({ 'subscription.status': 1 });
exports.OrganizationModel = mongoose_1.default.model('Organization', OrganizationSchema);
//# sourceMappingURL=organization.model.js.map