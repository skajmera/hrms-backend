import { Document, Types } from 'mongoose';
import { ANNOUNCEMENT_PRIORITY } from '../../config/constants';
/**
 * Announcement related interfaces
 */
export interface IAnnouncement extends Document {
    title: string;
    content: string;
    priority: keyof typeof ANNOUNCEMENT_PRIORITY;
    startDate: Date;
    expiryDate?: Date;
    announcementType: 'GENERAL' | 'BIRTHDAY' | 'ANNIVERSARY';
    targetAudience: {
        departments?: Types.ObjectId[] | string[];
        roles?: string[];
        specificUsers?: Types.ObjectId[] | string[];
        isGlobal: boolean;
    };
    attachments?: {
        name: string;
        url: string;
        type: string;
        size: number;
    }[];
    isPinned: boolean;
    isActive: boolean;
    createdBy: Types.ObjectId | string;
    viewedBy: {
        userId: Types.ObjectId | string;
        viewedAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
export interface IAnnouncementCreateInput {
    title: string;
    content: string;
    priority: keyof typeof ANNOUNCEMENT_PRIORITY;
    startDate: Date;
    expiryDate?: Date;
    targetAudience: {
        departments?: string[];
        roles?: string[];
        specificUsers?: string[];
        isGlobal: boolean;
    };
    attachments?: {
        name: string;
        url: string;
        type: string;
        size: number;
    }[];
    isPinned?: boolean;
    isActive: boolean;
}
//# sourceMappingURL=announcement.interface.d.ts.map