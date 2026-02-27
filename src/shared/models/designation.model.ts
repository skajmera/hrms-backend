import mongoose, { Schema } from 'mongoose';
import { IDesignation } from '../interfaces/settings.interface';

const DesignationSchema = new Schema<IDesignation>({
  organizationId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Organization', 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  code: { 
    type: String, 
    required: true,
    uppercase: true
  },
  description: { type: String },
  level: { 
    type: Number, 
    default: 0 
  },
  parentDesignation: { 
    type: Schema.Types.ObjectId, 
    ref: 'Designation' 
  },
  associatedUsers: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  isActive: { 
    type: Boolean, 
    default: true 
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
DesignationSchema.index({ organizationId: 1, code: 1 }, { unique: true });
DesignationSchema.index({ organizationId: 1, name: 1 });

export const DesignationModel = mongoose.model<IDesignation>('Designation', DesignationSchema);