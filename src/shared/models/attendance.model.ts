import mongoose, { Schema } from 'mongoose';
import { IAttendance } from '../interfaces/attendance.interface';
import { ATTENDANCE_STATUS, SHIFT_TYPES, USER_ROLES } from '../../config/constants';

const AttendanceSchema = new Schema<IAttendance>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(ATTENDANCE_STATUS),
    required: true
  },
  shift: {
    type: String,
    enum: Object.values(SHIFT_TYPES),
    required: true
  },

  // Time tracking
  checkInTime: { type: Date },
  checkOutTime: { type: Date },
  workingHours: { type: Number, default: 0 },
  breakHours: { type: Number, default: 0 },

  // Late/Early tracking
  isLate: { type: Boolean, default: false },
  lateByMinutes: { type: Number, default: 0 },
  earlyExit: { type: Boolean, default: false },
  earlyExitByMinutes: { type: Number, default: 0 },

  // Additional info
  remarks: { type: String },
  biometricId: { type: String },

  // Location tracking
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    address: { type: String }
  },

  // Approval
  isApproved: { type: Boolean, default: false },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },

  // Overtime
  overtimeHours: { type: Number, default: 0 },
  overtimeApproved: { type: Boolean, default: false },

  // Zero-Trust Fields
  deviceId: { type: String },
  gpsLatitude: { type: Number },
  gpsLongitude: { type: Number },
  wifiBSSID: { type: String },
  isMockLocation: { type: Boolean, default: false },
  selfie: { type: String }
}, {
  timestamps: true
});

// Indexes
AttendanceSchema.index({ userId: 1, date: 1 }, { unique: true });
AttendanceSchema.index({ date: 1 });
AttendanceSchema.index({ status: 1 });
AttendanceSchema.index({ location: '2dsphere' });

// Calculate working hours before save
AttendanceSchema.pre('save', function (next) {
  if (this.checkInTime && this.checkOutTime) {
    const diffMs = this.checkOutTime.getTime() - this.checkInTime.getTime();
    this.workingHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
  }
  next();
});

export const AttendanceModel = mongoose.model<IAttendance>('Attendance', AttendanceSchema);