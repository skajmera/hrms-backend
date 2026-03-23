import mongoose, { Schema } from 'mongoose';
import { IOrganization } from '../interfaces/organization.interface';

const OrganizationAddressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true, default: 'India' },
  pincode: { type: String, required: true }
}, { _id: false });

const WorkingDaysSchema = new Schema({
  monday: { type: Boolean, default: true },
  tuesday: { type: Boolean, default: true },
  wednesday: { type: Boolean, default: true },
  thursday: { type: Boolean, default: true },
  friday: { type: Boolean, default: true },
  saturday: { type: Boolean, default: false },
  sunday: { type: Boolean, default: false }
}, { _id: false });

const LocaleSettingsSchema = new Schema({
  country: { type: String, default: 'India' },
  timezone: { type: String, default: 'Asia/Kolkata' },
  timeFormat: { type: String, enum: ['12', '24'], default: '12' },
  dateFormat: { type: String, default: 'dd/mm/yyyy' },
  nameFormat: { type: String, enum: ['FIRST_LAST', 'LAST_FIRST'], default: 'FIRST_LAST' }
}, { _id: false });

const OrganizationSettingsSchema = new Schema({
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
    requiresEnrollment: { type: Boolean, default: false },
    requireFaceCapture: { type: Boolean, default: false },
    isSelfieRequired: { type: Boolean, default: false },
    blockMockLocations: { type: Boolean, default: true }
  },
  locale: { type: LocaleSettingsSchema, default: () => ({}) }
}, { _id: false });

const OrganizationSchema = new Schema<IOrganization>({
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
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  admins: [{
    type: Schema.Types.ObjectId,
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

export const OrganizationModel = mongoose.model<IOrganization>('Organization', OrganizationSchema);