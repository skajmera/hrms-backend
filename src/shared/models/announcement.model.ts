import mongoose, { Schema } from 'mongoose';
import { IAnnouncement } from '../interfaces/announcement.interface';
import { ANNOUNCEMENT_PRIORITY } from '../../config/constants';

const AnnouncementSchema = new Schema<IAnnouncement>({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  priority: { 
    type: String, 
    enum: Object.values(ANNOUNCEMENT_PRIORITY),
    default: ANNOUNCEMENT_PRIORITY.MEDIUM
  },
  
  // Dates
  startDate: { type: Date, required: true, default: Date.now },
  expiryDate: { type: Date },
  announcementType: {
    type: String,
    enum: ["GENERAL", "BIRTHDAY", "ANNIVERSARY"],
    required: true
  },
  // Target Audience
  targetAudience: {
    departments: [{ type: Schema.Types.ObjectId, ref: 'Department' }],
    roles: [{ type: String }],
    specificUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isGlobal: { type: Boolean, default: false }
  },
  
  // Attachments
  attachments: [{
    name: { type: String },
    url: { type: String },
    type: { type: String },
    size: { type: Number }
  }],
  
  // Status
  isPinned: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  
  // Creator
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Tracking
  viewedBy: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    viewedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Indexes
AnnouncementSchema.index({ startDate: 1, expiryDate: 1 });
AnnouncementSchema.index({ priority: 1 });
AnnouncementSchema.index({ 'targetAudience.isGlobal': 1 });
AnnouncementSchema.index({ isPinned: 1 });

export const AnnouncementModel = mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);