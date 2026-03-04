import { Document, Types } from 'mongoose';
/**
 * Offboarding/Resignation related interfaces
 */
export interface IOffboarding extends Document {
    userId: Types.ObjectId | string | any;
    employeeId: string;
    employeeName: string;
    designation: string;
    department: Types.ObjectId | string;
    resignationDate: Date;
    lastWorkingDate: Date;
    noticePeriodDays: number;
    reason: 'BETTER_OPPORTUNITY' | 'PERSONAL_REASONS' | 'HEALTH_ISSUES' | 'RELOCATION' | 'HIGHER_STUDIES' | 'RETIREMENT' | 'OTHER';
    reasonExplanation?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOTICE_PERIOD' | 'COMPLETED' | 'WITHDRAWN';
    employeeNotes?: string;
    hrNotes?: string;
    managerNotes?: string;
    exitInterviewScheduled: boolean;
    exitInterviewDate?: Date;
    exitInterviewNotes?: string;
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
    finalSettlement: {
        isPending: boolean;
        amount?: number;
        paidOn?: Date;
    };
    approvedBy?: Types.ObjectId | string;
    approvedAt?: Date;
    rejectedBy?: Types.ObjectId | string;
    rejectedAt?: Date;
    rejectionReason?: string;
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
//# sourceMappingURL=offboarding.interface.d.ts.map