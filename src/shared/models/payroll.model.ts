import mongoose, { Schema } from 'mongoose';
import { IPayroll } from '../interfaces/payroll.interface';
import { PAYMENT_STATUS } from '../../config/constants';

const SalaryComponentSchema = new Schema({
  basic: { type: Number, required: true },
  hra: { type: Number, required: true },
  allowances: {
    transport: { type: Number, default: 0 },
    medical: { type: Number, default: 0 },
    special: { type: Number, default: 0 },
    foodAllowance: { type: Number, default: 0 },
    statutoryBonus: { type: Number, default: 0 },
    byodPayment: { type: Number, default: 0 },
    taskBasedIncentive: { type: Number, default: 0 },
    arrearAmount: { type: Number, default: 0 },
    arrearMonth: { type: String },
    specialPay: { type: Number, default: 0 },
    miscellaneous: { type: Number, default: 0 },
    nonWorkingDayCompensation: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  deductions: {
    providentFund: { type: Number, default: 0 },
    professionalTax: { type: Number, default: 0 },
    incomeTax: { type: Number, default: 0 },
    esi: { type: Number, default: 0 },
    leaveWithoutPay: { type: Number, default: 0 },
    lateWithoutPay: { type: Number, default: 0 },
    lateArrivalDeductions: { type: Number, default: 0 },
    loanDeduction: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  // Custom Fields
  customEarnings: [{
    fieldName: { type: String },
    fieldValue: { type: Number, default: 0 }
  }],
  customDeductions: [{
    fieldName: { type: String },
    fieldValue: { type: Number, default: 0 }
  }]
}, { _id: false });

const PayrollSchema = new Schema<IPayroll>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employeeId: { type: String, required: true },
  month: { type: Number, required: true, min: 1, max: 12 },
  year: { type: Number, required: true },

  // Salary Components
  salaryComponents: { type: SalaryComponentSchema, required: true },

  // Calculations
  grossSalary: { type: Number, required: true },
  totalDeductions: { type: Number, required: true },
  netSalary: { type: Number, required: true },

  // Attendance Data
  workingDays: { type: Number, required: true },
  presentDays: { type: Number, required: true },
  absentDays: { type: Number, default: 0 },
  paidLeaveDays: { type: Number, default: 0 },
  unpaidLeaveDays: { type: Number, default: 0 },
  weekendDays: { type: Number, default: 0 },
  holidayDays: { type: Number, default: 0 },

  // Overtime & Bonus
  overtimeHours: { type: Number, default: 0 },
  overtimeAmount: { type: Number, default: 0 },
  bonus: { type: Number, default: 0 },
  incentives: { type: Number, default: 0 },

  // Revision
  isRevised: { type: Boolean, default: false },
  revisionDate: { type: Date },
  revisionReason: { type: String },

  // Payment Details
  paymentDate: { type: Date },
  paymentStatus: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.PENDING
  },
  paymentMode: {
    type: String,
    enum: ['BANK_TRANSFER', 'CASH', 'CHEQUE']
  },
  transactionId: { type: String },
  bankName: { type: String },
  accountNumber: { type: String },

  // Additional Info
  remarks: { type: String },
  payslipPath: { type: String },

  // Approval
  generatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },

  // Status tracking for Figma design
  isDraft: { type: Boolean, default: true },
  isGenerated: { type: Boolean, default: false },
  isPending: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Indexes
PayrollSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });
PayrollSchema.index({ employeeId: 1 });
PayrollSchema.index({ paymentStatus: 1 });

// Calculate totals before save
// PayrollSchema.pre('save', function(next) {
//   // Calculate gross salary
//   const { basic, hra, allowances } = this.salaryComponents;
//   const totalAllowances = Object.values(allowances).reduce((sum: number, val: any) => sum + val, 0);
//   this.grossSalary = basic + hra + totalAllowances + (this.bonus || 0) + (this.incentives || 0) + (this.overtimeAmount || 0);

//   // Calculate total deductions
//   const deductions = this.salaryComponents.deductions;
//   this.totalDeductions = Object.values(deductions).reduce((sum: number, val: any) => sum + val, 0);

//   // Calculate net salary
//   this.netSalary = this.grossSalary - this.totalDeductions;


// Calculate gross and net salary before save
PayrollSchema.pre('save', function (next) {
  const allowances = this.salaryComponents.allowances;
  const deductions = this.salaryComponents.deductions;

  // Calculate total allowances
  const totalAllowances = Object.values(allowances).reduce((sum: number, val: any) => {
    if (typeof val === 'number') return sum + val;
    return sum;
  }, 0);

  // Calculate custom earnings
  const customEarningsTotal = this.salaryComponents.customEarnings?.reduce((sum, item) => sum + (item.fieldValue || 0), 0) || 0;

  // Calculate gross salary
  this.grossSalary = this.salaryComponents.basic +
    this.salaryComponents.hra +
    totalAllowances +
    customEarningsTotal;

  // Calculate total deductions
  const totalStandardDeductions = Object.values(deductions).reduce((sum: number, val: any) => {
    if (typeof val === 'number') return sum + val;
    return sum;
  }, 0);

  // Calculate custom deductions
  const customDeductionsTotal = this.salaryComponents.customDeductions?.reduce((sum, item) => sum + (item.fieldValue || 0), 0) || 0;

  this.totalDeductions = totalStandardDeductions + customDeductionsTotal;

  // Calculate net salary
  this.netSalary = this.grossSalary - this.totalDeductions;

  // Status flag enforcement
  if (this.isGenerated) Object.assign(this, { isDraft: false, isPending: false });
  else Object.assign(this, { isDraft: false, isPending: true });

  next();
});

export const PayrollModel = mongoose.model<IPayroll>('Payroll', PayrollSchema);