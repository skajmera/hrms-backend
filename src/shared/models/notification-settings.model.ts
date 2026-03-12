import mongoose, { Schema } from 'mongoose';
import { INotificationSettings } from '../interfaces/settings.interface';

const NotificationSettingsSchema = new Schema<INotificationSettings>({
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  attendance: {
    checkInCheckOut: { type: Boolean, default: true },
    lateArrival: { type: Boolean, default: true },
    earlyExit: { type: Boolean, default: true }
  },

  leaves: {
    application: { type: Boolean, default: true },
    newRequest: { type: Boolean, default: true },
    approval: { type: Boolean, default: true },
    rejection: { type: Boolean, default: true }
  },

  announcements: {
    newAnnouncement: { type: Boolean, default: true },
    mentions: { type: Boolean, default: true },
    likes: { type: Boolean, default: false },
    comments: { type: Boolean, default: true }
  },

  reminders: {
    birthdays: { type: Boolean, default: true },
    anniversaries: { type: Boolean, default: true },
    newHiring: { type: Boolean, default: true }
  },

  payroll: {
    payslipGenerated: { type: Boolean, default: true },
    paymentProcessed: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Unique index
NotificationSettingsSchema.index({ organizationId: 1, userId: 1 }, { unique: true });

export const NotificationSettingsModel = mongoose.model<INotificationSettings>('NotificationSettings', NotificationSettingsSchema);