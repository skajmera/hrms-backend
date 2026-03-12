import { Document, Types } from 'mongoose';
export declare enum NotificationType {
    LEAVE_APPROVED = "LEAVE_APPROVED",
    LEAVE_REJECTED = "LEAVE_REJECTED",
    LEAVE_REQUESTED = "LEAVE_REQUESTED",
    PAYROLL_GENERATED = "PAYROLL_GENERATED",
    ANNOUNCEMENT = "ANNOUNCEMENT",
    BIRTHDAY = "BIRTHDAY",
    WORK_ANNIVERSARY = "WORK_ANNIVERSARY",
    NEW_HIRE = "NEW_HIRE",
    SYSTEM = "SYSTEM"
}
export interface INotification extends Document {
    userId: Types.ObjectId | string;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    targetApp: 'EMPLOYEE' | 'HR';
    data?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=notification.interface.d.ts.map