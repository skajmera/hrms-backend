import { Document, Types } from 'mongoose';
import { USER_ROLES, EMPLOYMENT_STATUS, SHIFT_TYPES } from '../../config/constants';

/**
 * User related interfaces
 */

export interface IAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface IEducation {
  degree: string;
  institution: string;
  yearOfCompletion: number;
  percentage?: number;
  grade?: string;
}

export interface IExperience {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  responsibilities?: string;
  location?: string;
}

export interface ISalaryDetails {
  basic: number;
  hra: number;
  allowances: {
    transport: number;
    medical: number;
    special: number;
    other: number;
  };
  deductions: {
    providentFund: number;
    tax: number;
    professionalTax: number;
    other: number;
  };
  grossSalary: number;
  netSalary: number;
}

export interface IProfessionalDetails {
  employeeId: string;
  designation: string;
  department: any |Types.ObjectId | string;
  joiningDate: Date;
  employmentStatus: keyof typeof EMPLOYMENT_STATUS;
  probationEndDate?: Date;
  reportingManager?: Types.ObjectId | string;
  shift: keyof typeof SHIFT_TYPES;
  workLocation: string;
  salaryDetails?: ISalaryDetails;
}

export interface IUser extends Document {
  // Personal Details
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  alternatePhone?: string;
  dateOfBirth: Date;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup?: string;
  maritalStatus?: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
  profilePicture?: string;
  
  // Address
  currentAddress: IAddress;
  permanentAddress?: IAddress;
  
  // Professional Details
  professionalDetails: IProfessionalDetails;
  
  // Education & Experience
  education: IEducation[];
  experience: IExperience[];
  
  // Emergency Contact
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  
  // System Fields
  role: keyof typeof USER_ROLES;
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  createdBy?: Types.ObjectId | string;
  updatedBy?: Types.ObjectId | string;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
  getFullName(): string;
}

export interface IUserCreateInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  role: keyof typeof USER_ROLES;
  currentAddress: IAddress;
  professionalDetails: IProfessionalDetails;
}

export interface IUserUpdateInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  alternatePhone?: string;
  dateOfBirth?: Date;
  bloodGroup?: string;
  maritalStatus?: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
  profilePicture?: string;
  currentAddress?: IAddress;
  permanentAddress?: IAddress;
  education?: IEducation[];
  experience?: IExperience[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: Partial<IUser>;
  token: string;
  refreshToken?: string;
}