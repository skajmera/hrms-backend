import { Document, Types } from 'mongoose';

export enum NotificationType {
    LEAVE_APPROVED = 'LEAVE_APPROVED',
    LEAVE_REJECTED = 'LEAVE_REJECTED',
    LEAVE_REQUESTED = 'LEAVE_REQUESTED',
    PAYROLL_GENERATED = 'PAYROLL_GENERATED',
    ANNOUNCEMENT = 'ANNOUNCEMENT',
    BIRTHDAY = 'BIRTHDAY',
    WORK_ANNIVERSARY = 'WORK_ANNIVERSARY',
    NEW_HIRE = 'NEW_HIRE',
    SYSTEM = 'SYSTEM'
}

export interface INotification extends Document {
    userId: Types.ObjectId | string;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    targetApp: 'EMPLOYEE' | 'HR';
    data?: Record<string, any>; // Used for frontend routing/deep links
    createdAt: Date;
    updatedAt: Date;
}
