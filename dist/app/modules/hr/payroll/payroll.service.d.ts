import { IPayroll } from '../../../../shared/interfaces/payroll.interface';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';
/**
 * Payroll Service
 * Business logic for payroll operations
 */
export declare class PayrollService {
    /**
     * Create payroll with all calculations
     */
    static createPayroll(payrollData: Partial<IPayroll>, generatedBy: string): Promise<IPayroll>;
    /**
     * Get payroll by ID
     */
    static getPayrollById(payrollId: string): Promise<IPayroll>;
    /**
     * Get all payrolls with filters
     */
    static getAllPayrolls(filters: any | undefined, options: IPaginationOptions): Promise<{
        records: IPayroll[];
        total: number;
    }>;
    /**
     * Update payroll
     */
    static updatePayroll(payrollId: string, updateData: Partial<IPayroll>): Promise<IPayroll>;
    /**
     * Delete payroll
     */
    static deletePayroll(payrollId: string): Promise<void>;
    /**
     * Generate payslip (move from draft to generated)
     */
    static generatePayslip(payrollId: string, approvedBy: string): Promise<IPayroll>;
    /**
     * Mark payroll as paid
     */
    static markAsPaid(payrollId: string, paymentDetails: {
        paymentMode: 'BANK_TRANSFER' | 'CASH' | 'CHEQUE';
        transactionId?: string;
        bankName?: string;
        accountNumber?: string;
    }): Promise<IPayroll>;
    /**
     * Get payroll statistics for dashboard
     */
    static getPayrollStats(month: number, year: number): Promise<{
        totalPayroll: any;
        paidEmployees: any;
        pendingPayments: any;
        averageSalary: number;
        totalEmployees: any;
        percentageChange: number;
        paidPercentage: number;
    }>;
    /**
     * Get drafts
     */
    static getDrafts(month?: number, year?: number): Promise<IPayroll[]>;
    /**
     * Get pending payrolls
     */
    static getPending(month?: number, year?: number): Promise<IPayroll[]>;
    /**
     * Bulk generate payrolls for multiple employees
     */
    static bulkGeneratePayrolls(userIds: string[], month: number, year: number, generatedBy: string): Promise<IPayroll[]>;
    /**
     * Revise payroll
     */
    static revisePayroll(payrollId: string, revisionData: Partial<IPayroll>, revisionReason: string): Promise<IPayroll>;
    /**
     * Get payroll by user and period
     */
    static getPayrollByUserAndPeriod(userId: string, month: number, year: number): Promise<IPayroll | null>;
    /**
     * Download payslip (generate PDF)
     */
    /**
     * Download payslip
     */
    static downloadPayslip(payrollId: string): Promise<{
        buffer: Buffer;
        fileName: string;
    }>;
    /**
     * Regenerate payslip
     */
    regeneratePayslip(payrollId: string): Promise<string>;
    static getUserPayrollHistory(userId: string, limit?: number): Promise<IPayroll[]>;
}
//# sourceMappingURL=payroll.service.d.ts.map