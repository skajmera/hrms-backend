import mongoose, { Schema } from 'mongoose';
import { IOffboarding } from '../interfaces/offboarding.interface';

const OffboardingSchema = new Schema<IOffboarding>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employeeId: {
    type: String,
    required: true
  },
  biometricId: { type: String },
  employeeName: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },

  // Resignation Details
  resignationDate: {
    type: Date,
    required: true
  },
  lastWorkingDate: {
    type: Date,
    required: true
  },
  noticePeriodDays: {
    type: Number,
    default: 0
  },

  // Reason
  reason: {
    type: String,
    enum: ['BETTER_OPPORTUNITY', 'PERSONAL_REASONS', 'HEALTH_ISSUES', 'RELOCATION', 'HIGHER_STUDIES', 'RETIREMENT', 'OTHER'],
    required: true
  },
  reasonExplanation: { type: String },

  // Status
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'NOTICE_PERIOD', 'COMPLETED', 'WITHDRAWN'],
    default: 'PENDING'
  },

  // Notes
  employeeNotes: { type: String },
  hrNotes: { type: String },
  managerNotes: { type: String },

  // Exit Interview
  exitInterviewScheduled: {
    type: Boolean,
    default: false
  },
  exitInterviewDate: { type: Date },
  exitInterviewNotes: { type: String },

  // Clearance
  clearance: {
    assetReturn: {
      status: {
        type: String,
        enum: ['PENDING', 'COMPLETED'],
        default: 'PENDING'
      },
      completedAt: { type: Date },
      notes: { type: String }
    },
    itClearance: {
      status: {
        type: String,
        enum: ['PENDING', 'COMPLETED'],
        default: 'PENDING'
      },
      completedAt: { type: Date },
      notes: { type: String }
    },
    financeClearance: {
      status: {
        type: String,
        enum: ['PENDING', 'COMPLETED'],
        default: 'PENDING'
      },
      completedAt: { type: Date },
      notes: { type: String }
    },
    hrClearance: {
      status: {
        type: String,
        enum: ['PENDING', 'COMPLETED'],
        default: 'PENDING'
      },
      completedAt: { type: Date },
      notes: { type: String }
    }
  },

  // Final Settlement
  finalSettlement: {
    isPending: {
      type: Boolean,
      default: true
    },
    amount: { type: Number },
    paidOn: { type: Date }
  },

  // Approval
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  rejectedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  rejectedAt: { type: Date },
  rejectionReason: { type: String },

  // Metadata
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
OffboardingSchema.index({ userId: 1 });
OffboardingSchema.index({ status: 1 });
OffboardingSchema.index({ resignationDate: 1 });
OffboardingSchema.index({ lastWorkingDate: 1 });

// Calculate notice period before save
OffboardingSchema.pre('save', function (next) {
  if (this.resignationDate && this.lastWorkingDate) {
    const diffTime = Math.abs(this.lastWorkingDate.getTime() - this.resignationDate.getTime());
    this.noticePeriodDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  next();
});

export const OffboardingModel = mongoose.model<IOffboarding>('Offboarding', OffboardingSchema);