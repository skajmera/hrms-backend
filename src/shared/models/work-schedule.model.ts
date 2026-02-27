import mongoose, { Schema } from 'mongoose';
import { IWorkSchedule } from '../interfaces/settings.interface';

const WorkingDaySchema = new Schema({
  isWorking: { type: Boolean, default: false },
  startTime: { type: String },
  endTime: { type: String },
  duration: { type: Number, default: 0 }
}, { _id: false });

const WorkScheduleSchema = new Schema<IWorkSchedule>({
  organizationId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Organization', 
    required: true 
  },
  scheduleName: { 
    type: String, 
    required: true 
  },
  scheduleType: {
    type: String,
    enum: ['DURATION_BASED', 'CLOCK_BASED'],
    required: true
  },
  effectiveFrom: { 
    type: Date, 
    required: true 
  },
  standardWorkingHoursPerDay: { 
    type: Number, 
    default: 8 
  },
  
  workingDays: {
    monday: { type: WorkingDaySchema, default: () => ({}) },
    tuesday: { type: WorkingDaySchema, default: () => ({}) },
    wednesday: { type: WorkingDaySchema, default: () => ({}) },
    thursday: { type: WorkingDaySchema, default: () => ({}) },
    friday: { type: WorkingDaySchema, default: () => ({}) },
    saturday: { type: WorkingDaySchema, default: () => ({}) },
    sunday: { type: WorkingDaySchema, default: () => ({}) }
  },
  
  totalWeeklyHours: { 
    type: Number, 
    default: 40 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  isDefault: { 
    type: Boolean, 
    default: false 
  },
  
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, {
  timestamps: true
});

// Indexes
WorkScheduleSchema.index({ organizationId: 1 });
WorkScheduleSchema.index({ isDefault: 1 });

// Calculate total weekly hours before save
WorkScheduleSchema.pre('save', function(next) {
  let totalHours = 0;
  
  Object.keys(this.workingDays).forEach((day) => {
    const dayData = this.workingDays[day as keyof typeof this.workingDays];
    if (dayData.isWorking && dayData.duration) {
      totalHours += dayData.duration;
    }
  });
  
  this.totalWeeklyHours = totalHours;
  next();
});

export const WorkScheduleModel = mongoose.model<IWorkSchedule>('WorkSchedule', WorkScheduleSchema);