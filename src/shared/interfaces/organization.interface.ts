import { Document, Types } from 'mongoose';

/**
 * Organization related interfaces
 */

export interface IOrganizationAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface ILocaleSettings {
  country: string;
  timezone: string;
  timeFormat: '12' | '24';
  dateFormat: string;
  nameFormat: 'FIRST_LAST' | 'LAST_FIRST';
}

export interface IOrganizationSettings {
  workingDays: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  workingHours: {
    startTime: string; // "09:00"
    endTime: string; // "18:00"
  };
  leavePolicy: {
    casualLeave: number;
    sickLeave: number;
    earnedLeave: number;
  };
  payrollSettings: {
    payrollCycle: 'MONTHLY' | 'BI_WEEKLY' | 'WEEKLY';
    paymentDate: number; // Day of month (1-31)
  };
  attendanceSettings: {
    lateArrivalThreshold: number; // minutes
    halfDayHours: number;
    fullDayHours: number;
  };
  securitySettings: {
    officeLocations: {
      _id?: string | Types.ObjectId;
      name: string;
      latitude: number;
      longitude: number;
      radius: number; // in meters
    }[];
    allowedWifiNetworks: {
      _id?: string | Types.ObjectId;
      name: string;
      bssid: string;
    }[];
    requireFaceCapture: boolean;
    blockMockLocations: boolean;
  };
  locale: ILocaleSettings;
}

export interface IOrganization extends Document {
  // Basic Info
  name: string;
  legalName: string;
  logo?: string;
  website?: string;
  industry?: string;
  description?: string;

  // Contact Details
  email: string;
  phone: string;
  address: IOrganizationAddress;

  // Registration Details
  registrationNumber?: string;
  taxId?: string;
  gstNumber?: string;
  panNumber?: string;

  // Settings
  settings: IOrganizationSettings;

  // Subscription & Limits
  subscription: {
    plan: 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE';
    status: 'ACTIVE' | 'INACTIVE' | 'TRIAL' | 'EXPIRED';
    startDate: Date;
    endDate?: Date;
    maxEmployees: number;
  };

  // Features Enabled
  features: {
    attendance: boolean;
    leave: boolean;
    payroll: boolean;
    performance: boolean;
    recruitment: boolean;
    offboarding: boolean;
  };

  // Admin Details
  owner: Types.ObjectId | string;
  admins: Types.ObjectId[] | string[];

  // Status
  isActive: boolean;
  isVerified: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrganizationCreateInput {
  name: string;
  legalName: string;
  email: string;
  phone: string;
  address: IOrganizationAddress;
  website?: string;
  industry?: string;
  registrationNumber?: string;
  taxId?: string;
  gstNumber?: string;
  panNumber?: string;
}

export interface IOrganizationUpdateInput {
  name?: string;
  legalName?: string;
  logo?: string;
  website?: string;
  industry?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: IOrganizationAddress;
  registrationNumber?: string;
  taxId?: string;
  gstNumber?: string;
  panNumber?: string;
}