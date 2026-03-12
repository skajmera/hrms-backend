import mongoose, { Schema } from 'mongoose';
import { INotification, NotificationType } from '../interfaces/notification.interface';

const NotificationSchema = new Schema<INotification>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        type: {
            type: String,
            enum: Object.values(NotificationType),
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        isRead: {
            type: Boolean,
            default: false,
            index: true
        },
        targetApp: {
            type: String,
            enum: ['EMPLOYEE', 'HR'],
            default: 'EMPLOYEE',
            required: true,
            index: true
        },
        data: {
            type: Schema.Types.Mixed,
            default: {}
        }
    },
    {
        timestamps: true
    }
);

// Optimize querying for a user's unread notifications
NotificationSchema.index({ userId: 1, isRead: 1 });
// Optimize querying a user's notifications sorted by newest
NotificationSchema.index({ userId: 1, createdAt: -1 });

export const NotificationModel = mongoose.model<INotification>('Notification', NotificationSchema);
