import { Document, Types } from 'mongoose';

/**
 * Offboarding/Resignation related interfaces
 */

export interface IOffboarding extends Document {
  userId: Types.ObjectId | string | any;
  employeeId: string;
  biometricId?: string;
  employeeName: string;
  designation: string;
  department: Types.ObjectId | string;

  // Resignation Details
  resignationDate: Date;
  lastWorkingDate: Date;
  noticePeriodDays: number;

  // Reason
  reason: 'BETTER_OPPORTUNITY' | 'PERSONAL_REASONS' | 'HEALTH_ISSUES' | 'RELOCATION' | 'HIGHER_STUDIES' | 'RETIREMENT' | 'OTHER';
  reasonExplanation?: string;

  // Status
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOTICE_PERIOD' | 'COMPLETED' | 'WITHDRAWN';

  // Employee Notes
  employeeNotes?: string;

  // HR/Management Notes
  hrNotes?: string;
  managerNotes?: string;

  // Exit Interview
  exitInterviewScheduled: boolean;
  exitInterviewDate?: Date;
  exitInterviewNotes?: string;

  // Clearance
  clearance: {
    assetReturn: {
      status: 'PENDING' | 'COMPLETED';
      completedAt?: Date;
      notes?: string;
    };
    itClearance: {
      status: 'PENDING' | 'COMPLETED';
      completedAt?: Date;
      notes?: string;
    };
    financeClearance: {
      status: 'PENDING' | 'COMPLETED';
      completedAt?: Date;
      notes?: string;
    };
    hrClearance: {
      status: 'PENDING' | 'COMPLETED';
      completedAt?: Date;
      notes?: string;
    };
  };

  // Final Settlement
  finalSettlement: {
    isPending: boolean;
    amount?: number;
    paidOn?: Date;
  };

  // Approval
  approvedBy?: Types.ObjectId | string;
  approvedAt?: Date;
  rejectedBy?: Types.ObjectId | string;
  rejectedAt?: Date;
  rejectionReason?: string;

  // Metadata
  createdBy: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOffboardingCreateInput {
  userId: string;
  resignationDate: Date;
  lastWorkingDate: Date;
  reason: IOffboarding['reason'];
  reasonExplanation?: string;
  employeeNotes?: string;
}

export interface IOffboardingUpdateInput {
  lastWorkingDate?: Date;
  reason?: IOffboarding['reason'];
  reasonExplanation?: string;
  employeeNotes?: string;
  status?: IOffboarding['status'];
  hrNotes?: string;
  managerNotes?: string;
}