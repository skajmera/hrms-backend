import { IPayroll } from '../interfaces/payroll.interface';
import { IQueryFilters, IPaginationOptions } from '../interfaces/common.interface';
export declare class PayrollDAL {
    /**
     * Create payroll
     */
    create(payrollData: Partial<IPayroll>): Promise<IPayroll>;
    /**
     * Find payroll by ID
     */
    findById(id: string): Promise<IPayroll | null>;
    /**
     * Find all payroll records
     */
    findAll(filters?: IQueryFilters, options?: IPaginationOptions): Promise<{
        records: IPayroll[];
        total: number;
    }>;
    /**
     * Update payroll
     */
    update(id: string, updateData: Partial<IPayroll>): Promise<IPayroll | null>;
    updateById(id: string, updateData: Partial<IPayroll>): Promise<IPayroll>;
    /**
     * Delete payroll
     */
    delete(id: string): Promise<IPayroll | null>;
    /**
     * Find payroll by user, month, and year
     */
    findByUserMonthYear(userId: string, month: number, year: number): Promise<IPayroll | null>;
    findByUserAndPeriod(userId: string, month: number, year: number): Promise<IPayroll | null>;
    /**
     * Get payroll by month and year
     */
    findByMonthYear(month: number, year: number): Promise<IPayroll[]>;
    /**
     * Get user payroll history
     */
    getUserPayrollHistory(userId: string, limit?: number): Promise<IPayroll[]>;
    /**
     * Get payroll statistics
     */
    getPayrollStats(month: number, year: number): Promise<any>;
    /**
       * Get payroll statistics for dashboard
       */
    getPayrollStatsDashboard(month: number, year: number): Promise<any>;
    /**
      * Get draft payrolls
      */
    getDrafts(month?: number, year?: number): Promise<IPayroll[]>;
    /**
     * Get pending payrolls
     */
    getPending(month?: number, year?: number): Promise<IPayroll[]>;
    /**
     * Mark payroll as paid
     */
    markAsPaid(id: string, paymentDetails: any): Promise<IPayroll | null>;
    /**
     * Bulk generate payroll
     */
    bulkCreate(payrollRecords: any[]): Promise<IPayroll[] | any>;
}
export declare const payrollDAL: PayrollDAL;
//# sourceMappingURL=payroll.dal.d.ts.map