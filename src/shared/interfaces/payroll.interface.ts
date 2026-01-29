import { Document, Types } from 'mongoose';
import { PAYMENT_STATUS } from '../../config/constants';

/**
 * Payroll related interfaces
 */

export interface ISalaryComponent {
  basic: number;
  hra: number;
  allowances: {
    transport: number;
    medical: number;
    special: number;
    foodAllowance: number;
    other: number;
  };
  deductions: {
    providentFund: number;
    professionalTax: number;
    incomeTax: number;
    esi?: number;
    loanDeduction?: number;
    other: number;
  };
}

export interface IPayroll extends Document {
  userId: Types.ObjectId | string;
  employeeId: string;
  month: number;
  year: number;
  
  // Salary Components
  salaryComponents: ISalaryComponent;
  
  // Calculations
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  
  // Attendance Data
  workingDays: number;
  presentDays: number;
  absentDays: number;
  paidLeaveDays: number;
  unpaidLeaveDays: number;
  weekendDays: number;
  holidayDays: number;
  
  // Overtime & Bonus
  overtimeHours?: number;
  overtimeAmount?: number;
  bonus?: number;
  incentives?: number;
  
  // Payment Details
  paymentDate?: Date;
  paymentStatus: keyof typeof PAYMENT_STATUS;
  paymentMode?: 'BANK_TRANSFER' | 'CASH' | 'CHEQUE';
  transactionId?: string;
  bankName?: string;
  accountNumber?: string;
  
  // Additional Info
  remarks?: string;
  payslipPath?: string;
  
  // Approval
  generatedBy: Types.ObjectId | string;
  approvedBy?: Types.ObjectId | string;
  approvedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface IPayrollCreateInput {
  userId: string;
  month: number;
  year: number;
  salaryComponents: ISalaryComponent;
  workingDays: number;
  presentDays: number;
}