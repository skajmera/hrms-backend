import { Document, Types } from 'mongoose';

/**
 * Work Schedule Interface
 */
export interface IWorkSchedule extends Document {
  organizationId: Types.ObjectId | string;
  scheduleName: string;
  scheduleType: 'DURATION_BASED' | 'CLOCK_BASED';
  effectiveFrom: Date;
  standardWorkingHoursPerDay: number; // in hours (e.g., 8)
  
  workingDays: {
    monday: {
      isWorking: boolean;
      startTime?: string; // "09:00"
      endTime?: string; // "18:00"
      duration?: number; // in hours
    };
    tuesday: {
      isWorking: boolean;
      startTime?: string;
      endTime?: string;
      duration?: number;
    };
    wednesday: {
      isWorking: boolean;
      startTime?: string;
      endTime?: string;
      duration?: number;
    };
    thursday: {
      isWorking: boolean;
      startTime?: string;
      endTime?: string;
      duration?: number;
    };
    friday: {
      isWorking: boolean;
      startTime?: string;
      endTime?: string;
      duration?: number;
    };
    saturday: {
      isWorking: boolean;
      startTime?: string;
      endTime?: string;
      duration?: number;
    };
    sunday: {
      isWorking: boolean;
      startTime?: string;
      endTime?: string;
      duration?: number;
    };
  };
  
  totalWeeklyHours: number;
  isActive: boolean;
  isDefault: boolean;
  
  createdBy: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Notification Settings Interface
 */
export interface INotificationSettings extends Document {
  organizationId: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  
  attendance: {
    checkInCheckOut: boolean;
    lateArrival: boolean;
    earlyExit: boolean;
  };
  
  leaves: {
    newRequest: boolean;
    approval: boolean;
    rejection: boolean;
  };
  
  announcements: {
    newAnnouncement: boolean;
    mentions: boolean;
    likes: boolean;
    comments: boolean;
  };
  
  reminders: {
    birthdays: boolean;
    anniversaries: boolean;
    newHiring: boolean;
  };
  
  payroll: {
    payslipGenerated: boolean;
    paymentProcessed: boolean;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Designation/Role Interface
 */
export interface IDesignation extends Document {
  organizationId: Types.ObjectId | string;
  name: string;
  code: string;
  description?: string;
  level: number; // Hierarchy level
  parentDesignation?: Types.ObjectId | string;
  associatedUsers: Types.ObjectId[] | string[];
  isActive: boolean;
  
  createdBy: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}