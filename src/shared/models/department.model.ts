import mongoose, { Schema } from 'mongoose';
import { IDepartment } from '../interfaces/department.interface';

const DepartmentSchema = new Schema<IDepartment>({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: { type: String },
  
  // Hierarchy
  parentDepartment: { type: Schema.Types.ObjectId, ref: 'Department' },
  level: { type: Number, default: 0 },
  path: { type: String }, // e.g., "/Engineering/Backend"
  
  // Leadership
  headOfDepartment: { type: Schema.Types.ObjectId, ref: 'User' },
  
  // Members
  employees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  employeeCount: { type: Number, default: 0 },
  
  // Contact
  email: { type: String, lowercase: true, trim: true },
  phone: { type: String },
  location: { type: String },
  
  // Budget
  budget: {
    allocated: { type: Number, default: 0 },
    spent: { type: Number, default: 0 },
    fiscalYear: { type: Number }
  },
  
  // Status
  isActive: { type: Boolean, default: true },
  
  // Metadata
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

// Indexes
DepartmentSchema.index({ code: 1 });
DepartmentSchema.index({ parentDepartment: 1 });
DepartmentSchema.index({ level: 1 });

// Update employee count before save
DepartmentSchema.pre('save', function(next) {
  this.employeeCount = this.employees.length;
  next();
});

// Build path before save
DepartmentSchema.pre('save', async function(next) {
  if (this.parentDepartment) {
    const parent = await mongoose.model('Department').findById(this.parentDepartment);
    if (parent) {
      this.path = `${parent.path}/${this.name}`;
      this.level = parent.level + 1;
    }
  } else {
    this.path = `/${this.name}`;
    this.level = 0;
  }
  next();
});

export const DepartmentModel = mongoose.model<IDepartment>('Department', DepartmentSchema);