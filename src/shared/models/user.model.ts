import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUser } from '../interfaces/user.interface';
import { config } from '../../config/env';
import { USER_ROLES, EMPLOYMENT_STATUS, SHIFT_TYPES, SHIFT_TIMINGS, EMPLOYMENT_TYPE } from '../../config/constants';
const ShiftTimeSchema = new Schema({
  startTime: { type: String, required: false }, // "HH:mm" format
  endTime: { type: String, required: false },
  gracePeriod: { type: Number, default: 15 }, // minutes
  minimumHours: { type: Number, default: 8 }
}, { _id: false });

const AddressSchema = new Schema({
  street: { type: String, required: false },
  city: { type: String, required: false },
  state: { type: String, required: false },
  country: { type: String, required: false, default: 'India' },
  pincode: { type: String, required: false }
}, { _id: false });

const EducationSchema = new Schema({
  degree: { type: String, required: false },
  institution: { type: String, required: false },
  yearOfCompletion: { type: Number, required: false },
  percentage: { type: Number },
  grade: { type: String },
  specialisation: { type: String }
}, { _id: false });

const ExperienceSchema = new Schema({
  company: { type: String, required: false },
  position: { type: String, required: false },
  startDate: { type: Date, required: false },
  endDate: { type: Date },
  isCurrent: { type: Boolean, default: false },
  isRelevant: { type: Boolean, default: false }, // NEW
  responsibilities: { type: String },
  location: { type: String }
}, { _id: false });

const SalaryDetailsSchema = new Schema({
  basic: { type: Number, required: false },
  hra: { type: Number, required: false },
  allowances: {
    transport: { type: Number, default: 0 },
    medical: { type: Number, default: 0 },
    special: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  deductions: {
    providentFund: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    professionalTax: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  grossSalary: { type: Number, required: false },
  netSalary: { type: Number, required: false }
}, { _id: false });

const ProfessionalDetailsSchema = new Schema({
  sourceOfHire: { type: String, required: false },
  employeeId: { type: String, required: false, unique: true, sparse: true },
  biometricId: { type: String, unique: true, sparse: true }, // NEW - For biometric attendance integration
  designation: { type: String, required: false },
  department: { type: Schema.Types.ObjectId, ref: 'Department', required: false },
  joiningDate: { type: Date, required: false },
  employmentStatus: {
    type: String,
    enum: Object.values(EMPLOYMENT_STATUS),
    default: EMPLOYMENT_STATUS.PROBATION
  },
  employmentType: {
    type: String,
    enum: Object.values(EMPLOYMENT_TYPE),
    default: EMPLOYMENT_TYPE.FULL_TIME
  },
  probationEndDate: { type: Date },
  reportingManager: { type: Schema.Types.ObjectId, ref: 'User' },
  shift: {
    type: String,
    enum: Object.values(SHIFT_TYPES),
    default: SHIFT_TYPES.MORNING
  },

  shiftTime: ShiftTimeSchema, // Custom shift time

  workLocation: { type: String, required: false },
  salaryDetails: SalaryDetailsSchema,
  totalExperience: { type: String }, // NEW
  currentExperience: { type: String } // NEW
}, { _id: false });

const UserSchema = new Schema<IUser>({
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: false // Make this required after migration
  },
  // Personal Details
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: false, // Changed for Drafts
    unique: true,
    sparse: true, // Allow multiple nulls/undefined for Drafts
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  personalEmail: {
    type: String,
    required: false,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: { type: String, required: false, minlength: 6, select: false },
  phone: { type: String, required: false },
  alternatePhone: { type: String },
  dateOfBirth: { type: Date, required: false },
  gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], required: false },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  maritalStatus: { type: String, enum: ['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'] },
  profilePicture: { type: String },
  anniversary: { type: Date, required: false },
  aboutMe: { type: String, required: false },
  adhaarNumber: { type: String, required: false, unique: true, sparse: true },
  panNumber: { type: String, required: false, unique: true, sparse: true },
  // Address
  currentAddress: { type: AddressSchema, required: false },
  permanentAddress: AddressSchema,
  separationInfo: {
    dateOfExit: { type: Date },
    previousCompany: { type: String }
  },

  // Professional Details
  professionalDetails: { type: ProfessionalDetailsSchema, required: false },

  // Education & Experience
  education: [EducationSchema],
  experience: [ExperienceSchema],

  // Emergency Contact
  emergencyContact: {
    name: { type: String },
    relationship: { type: String },
    phone: { type: String },
    email: { type: String, match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'] }
  },

  // System Fields
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.EMPLOYEE
  },
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String, select: false },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  lastLogin: { type: Date },
  registeredDeviceId: { type: String, unique: true, sparse: true },
  azurePersonId: { type: String, unique: true, sparse: true },
  fcmTokens: [{ type: String }], // Array of Firebase Cloud Messaging device tokens

  // Metadata
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ 'professionalDetails.employeeId': 1 });
UserSchema.index({ 'professionalDetails.department': 1 });
UserSchema.index({ role: 1 });

// Virtual for full name
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for profileImage (alias for profilePicture)
UserSchema.virtual('profileImage').get(function () {
  return this.profilePicture;
}).set(function (val: string) {
  this.profilePicture = val;
});

// Pre-save middleware to hash password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to generate auth token
UserSchema.methods.generateAuthToken = function (): string {
  const options: any = {
    expiresIn: config.jwt.expiresIn
  };
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role
    },
    config.jwt.secret,
    options
    // { expiresIn: config.jwt.expiresIn }
  );
};

// Method to get full name
UserSchema.methods.getFullName = function (): string {
  return `${this.firstName} ${this.lastName}`;
};


// Sync department employees when user department changes
UserSchema.post('save', async function (doc) {
  const departmentDAL = (await import('../dal/department.dal')).departmentDAL;

  const dept = doc.professionalDetails?.department;
  const departmentId = dept?._id ? dept._id.toString() : dept?.toString();

  if (departmentId && departmentId !== '[object Object]') {
    await departmentDAL.syncEmployees(departmentId);
  }
});

// Sync when user is updated
UserSchema.post('findOneAndUpdate', async function (doc) {
  if (doc && doc.professionalDetails?.department) {
    const departmentDAL = (await import('../dal/department.dal')).departmentDAL;
    const dept = doc.professionalDetails.department;
    const departmentId = dept?._id ? dept._id.toString() : dept?.toString();

    if (departmentId && departmentId !== '[object Object]') {
      await departmentDAL.syncEmployees(departmentId);
    }
  }
});

// Pre-save middleware to set default shift time if not provided
UserSchema.pre('save', function (next) {
  if (this.professionalDetails?.shift && !this.professionalDetails?.shiftTime) {
    const shiftType = this.professionalDetails.shift as keyof typeof SHIFT_TIMINGS;
    const defaultTiming = SHIFT_TIMINGS[shiftType]

    this.professionalDetails.shiftTime = {
      startTime: defaultTiming.startTime,
      endTime: defaultTiming.endTime,
      gracePeriod: defaultTiming.gracePeriod,
      minimumHours: defaultTiming.minimumHours
    };
  }
  next();
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);