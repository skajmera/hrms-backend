import mongoose, { Schema } from 'mongoose';
import { IHoliday } from '../interfaces/holiday.interface';

const HolidaySchema = new Schema<IHoliday>({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  type: { 
    type: String, 
    enum: ['PUBLIC', 'RESTRICTED', 'OPTIONAL'],
    default: 'PUBLIC'
  },
  description: { type: String },
  isActive: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

HolidaySchema.index({ date: 1 });
HolidaySchema.index({ type: 1 });

export const HolidayModel = mongoose.model<IHoliday>('Holiday', HolidaySchema);