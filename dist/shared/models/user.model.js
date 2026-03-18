"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const constants_1 = require("../../config/constants");
const ShiftTimeSchema = new mongoose_1.Schema({
    startTime: { type: String, required: false }, // "HH:mm" format
    endTime: { type: String, required: false },
    gracePeriod: { type: Number, default: 15 }, // minutes
    minimumHours: { type: Number, default: 8 }
}, { _id: false });
const AddressSchema = new mongoose_1.Schema({
    street: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    country: { type: String, required: false, default: 'India' },
    pincode: { type: String, required: false }
}, { _id: false });
const EducationSchema = new mongoose_1.Schema({
    degree: { type: String, required: false },
    institution: { type: String, required: false },
    yearOfCompletion: { type: Number, required: false },
    percentage: { type: Number },
    grade: { type: String },
    specialisation: { type: String }
}, { _id: false });
const ExperienceSchema = new mongoose_1.Schema({
    company: { type: String, required: false },
    position: { type: String, required: false },
    startDate: { type: Date, required: false },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
    isRelevant: { type: Boolean, default: false }, // NEW
    responsibilities: { type: String },
    location: { type: String }
}, { _id: false });
const SalaryDetailsSchema = new mongoose_1.Schema({
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
const ProfessionalDetailsSchema = new mongoose_1.Schema({
    sourceOfHire: { type: String, required: false },
    employeeId: { type: String, required: false, unique: true, sparse: true },
    biometricId: { type: String, unique: true, sparse: true }, // NEW - For biometric attendance integration
    designation: { type: String, required: false },
    department: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Department', required: false },
    joiningDate: { type: Date, required: false },
    employmentStatus: {
        type: String,
        enum: Object.values(constants_1.EMPLOYMENT_STATUS),
        default: constants_1.EMPLOYMENT_STATUS.PROBATION
    },
    employmentType: {
        type: String,
        enum: Object.values(constants_1.EMPLOYMENT_TYPE),
        default: constants_1.EMPLOYMENT_TYPE.FULL_TIME
    },
    probationEndDate: { type: Date },
    reportingManager: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    shift: {
        type: String,
        enum: Object.values(constants_1.SHIFT_TYPES),
        default: constants_1.SHIFT_TYPES.MORNING
    },
    shiftTime: ShiftTimeSchema, // Custom shift time
    workLocation: { type: String, required: false },
    salaryDetails: SalaryDetailsSchema,
    totalExperience: { type: String }, // NEW
    currentExperience: { type: String } // NEW
}, { _id: false });
const UserSchema = new mongoose_1.Schema({
    organizationId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        default: undefined,
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
        enum: Object.values(constants_1.USER_ROLES),
        default: constants_1.USER_ROLES.EMPLOYEE
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
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ personalEmail: 1 }, { unique: true, partialFilterExpression: { personalEmail: { $type: 'string', $ne: '' } } });
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
}).set(function (val) {
    this.profilePicture = val;
});
// Pre-save middleware to hash password
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcryptjs_1.default.genSalt(10);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcryptjs_1.default.compare(candidatePassword, this.password);
    }
    catch (error) {
        throw new Error('Password comparison failed');
    }
};
// Method to generate auth token
UserSchema.methods.generateAuthToken = function () {
    const options = {
        expiresIn: env_1.config.jwt.expiresIn
    };
    return jsonwebtoken_1.default.sign({
        id: this._id,
        email: this.email,
        role: this.role
    }, env_1.config.jwt.secret, options
    // { expiresIn: config.jwt.expiresIn }
    );
};
// Method to get full name
UserSchema.methods.getFullName = function () {
    return `${this.firstName} ${this.lastName}`;
};
// Sync department employees when user department changes
UserSchema.post('save', async function (doc) {
    const departmentDAL = (await Promise.resolve().then(() => __importStar(require('../dal/department.dal')))).departmentDAL;
    const dept = doc.professionalDetails?.department;
    const departmentId = dept?._id ? dept._id.toString() : dept?.toString();
    if (departmentId && departmentId !== '[object Object]') {
        await departmentDAL.syncEmployees(departmentId);
    }
});
// Sync when user is updated
UserSchema.post('findOneAndUpdate', async function (doc) {
    if (doc && doc.professionalDetails?.department) {
        const departmentDAL = (await Promise.resolve().then(() => __importStar(require('../dal/department.dal')))).departmentDAL;
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
        const shiftType = this.professionalDetails.shift;
        const defaultTiming = constants_1.SHIFT_TIMINGS[shiftType];
        this.professionalDetails.shiftTime = {
            startTime: defaultTiming.startTime,
            endTime: defaultTiming.endTime,
            gracePeriod: defaultTiming.gracePeriod,
            minimumHours: defaultTiming.minimumHours
        };
    }
    next();
});
exports.UserModel = mongoose_1.default.model('User', UserSchema);
//# sourceMappingURL=user.model.js.map