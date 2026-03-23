import mongoose, { Schema } from 'mongoose';
import { IUserPermission } from '../interfaces/permission.interface';

const PermissionSubSchema = new Schema({
  view: { type: Boolean, default: false },
  edit: { type: Boolean, default: false },
  fullAccess: { type: Boolean, default: false }
}, { _id: false });

const UserPermissionSchema = new Schema<IUserPermission>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  role: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  
  modules: {
    employees: {
      employeesList: PermissionSubSchema,
      employeeProfile: PermissionSubSchema,
      employeeCareerHistory: PermissionSubSchema,
      employeeDepartment: PermissionSubSchema,
      employeeAttendance: PermissionSubSchema,
      employeeLeave: PermissionSubSchema,
      employeePayslip: PermissionSubSchema
    },
    department: PermissionSubSchema,
    attendance: PermissionSubSchema,
    leaves: PermissionSubSchema,
    offboarding: PermissionSubSchema,
    payroll: PermissionSubSchema,
    announcements: PermissionSubSchema,
    usersPermissions: PermissionSubSchema,
    settings: {
      companyInfo: PermissionSubSchema,
      departments: PermissionSubSchema,
      designations: PermissionSubSchema,
      workSchedule: PermissionSubSchema,
      security: PermissionSubSchema,
      notifications: PermissionSubSchema
    }
  },
  
  isActive: { 
    type: Boolean, 
    default: true 
  },
  invitedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  invitedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Index
UserPermissionSchema.index({ userId: 1 });
UserPermissionSchema.index({ email: 1 });
UserPermissionSchema.index({ isActive: 1 });

export const UserPermissionModel = mongoose.model<IUserPermission>('UserPermission', UserPermissionSchema);