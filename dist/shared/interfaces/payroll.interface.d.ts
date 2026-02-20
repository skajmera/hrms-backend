import { Document, Types } from 'mongoose';
import { PAYMENT_STATUS } from '../../config/constants';
export interface ICustomField {
    fieldName?: string;
    fieldValue?: number;
}
/**
 * Payroll related interfaces
 */
export interface ISalaryComponent {
    basic: number;
    hra: number;
    allowances: {
        transport?: number;
        medical?: number;
        special?: number;
        foodAllowance?: number;
        statutoryBonus?: number;
        byodPayment?: number;
        taskBasedIncentive?: number;
        arrearAmount?: number;
        arrearMonth?: string;
        specialPay?: number;
        miscellaneous?: number;
        nonWorkingDayCompensation?: number;
        other?: number;
    };
    deductions: {
        providentFund?: number;
        professionalTax?: number;
        incomeTax?: number;
        esi?: number;
        leaveWithoutPay?: number;
        lateWithoutPay?: number;
        lateArrivalDeductions?: number;
        loanDeduction?: number;
        other?: number;
    };
    customEarnings?: ICustomField[];
    customDeductions?: ICustomField[];
}
export interface IPayroll extends Document {
    userId: Types.ObjectId | string;
    employeeId: string;
    month: number;
    year: number;
    salaryComponents: ISalaryComponent;
    grossSalary: number;
    totalDeductions: number;
    netSalary: number;
    workingDays: number;
    presentDays: number;
    absentDays: number;
    paidLeaveDays: number;
    unpaidLeaveDays: number;
    weekendDays: number;
    holidayDays: number;
    overtimeHours?: number;
    overtimeAmount?: number;
    bonus?: number;
    incentives?: number;
    isRevised?: boolean;
    revisionDate?: Date;
    revisionReason?: string;
    paymentDate?: Date;
    paymentStatus: keyof typeof PAYMENT_STATUS;
    paymentMode?: 'BANK_TRANSFER' | 'CASH' | 'CHEQUE';
    transactionId?: string;
    bankName?: string;
    accountNumber?: string;
    remarks?: string;
    payslipPath?: string;
    generatedBy: Types.ObjectId | string;
    approvedBy?: Types.ObjectId | string;
    approvedAt?: Date;
    isDraft?: boolean;
    isGenerated?: boolean;
    isPending?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface IPayrollCreateInput {
    userId: string;
    employeeId: string;
    month: number;
    year: number;
    salaryComponents: ISalaryComponent;
    workingDays: number;
    presentDays: number;
    generatedBy: string;
}
//# sourceMappingURL=payroll.interface.d.ts.map