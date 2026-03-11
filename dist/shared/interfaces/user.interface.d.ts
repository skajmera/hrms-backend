import { Document, Types } from 'mongoose';
import { USER_ROLES, EMPLOYMENT_STATUS, SHIFT_TYPES, EMPLOYMENT_TYPE } from '../../config/constants';
/**
 * User related interfaces
 */
export interface IShiftTime {
    startTime: string;
    endTime: string;
    gracePeriod?: number;
    minimumHours?: number;
}
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
    specialisation?: string;
}
export interface IExperience {
    company: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    isCurrent: boolean;
    isRelevant?: boolean;
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
    sourceOfHire?: string;
    employeeId?: string;
    biometricId?: string;
    designation: Types.ObjectId | string;
    department?: any | Types.ObjectId | string;
    joiningDate?: Date;
    employmentStatus?: keyof typeof EMPLOYMENT_STATUS;
    employmentType?: keyof typeof EMPLOYMENT_TYPE;
    probationEndDate?: Date;
    reportingManager?: Types.ObjectId | string;
    shift?: keyof typeof SHIFT_TYPES;
    shiftTime?: IShiftTime;
    workLocation: string;
    salaryDetails?: ISalaryDetails;
    totalExperience?: string;
    currentExperience?: string;
}
export interface IUser extends Document {
    organizationId: Types.ObjectId | string;
    firstName: string;
    lastName: string;
    email: string;
    personalEmail?: string;
    password: string;
    phone?: string;
    alternatePhone?: string;
    dateOfBirth?: Date;
    anniversary?: Date;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    bloodGroup?: string;
    maritalStatus?: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
    profilePicture?: string;
    profileImage?: string;
    separationInfo?: {
        dateOfExit: Date;
        previousCompany: string;
    };
    currentAddress?: IAddress;
    permanentAddress?: IAddress;
    professionalDetails?: IProfessionalDetails | any;
    education?: IEducation[];
    experience?: IExperience[];
    emergencyContact?: {
        name: string;
        relationship: string;
        phone: string;
        email?: string;
    };
    aboutMe?: string;
    adhaarNumber?: string;
    panNumber?: string;
    role: keyof typeof USER_ROLES;
    isActive?: boolean;
    isEmailVerified?: boolean;
    emailVerificationToken?: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    lastLogin?: Date;
    registeredDeviceId?: string;
    azurePersonId?: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: Types.ObjectId | string;
    updatedBy?: Types.ObjectId | string;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateAuthToken(): string;
    getFullName(): string;
}
export interface IUserCreateInput {
    createdBy?: Types.ObjectId | string;
    firstName: string;
    lastName: string;
    email?: string;
    password?: string;
    personalEmail?: string;
    phone?: string;
    dateOfBirth?: Date;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    role: keyof typeof USER_ROLES;
    currentAddress?: IAddress;
    professionalDetails?: IProfessionalDetails | any;
}
export interface IUserUpdateInput {
    password?: string;
    updatedBy?: Types.ObjectId | string;
    firstName?: string;
    lastName?: string;
    personalEmail?: string;
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
    isActive?: boolean;
    professionalDetails?: IProfessionalDetails | any;
    registeredDeviceId?: string | null;
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
//# sourceMappingURL=user.interface.d.ts.map