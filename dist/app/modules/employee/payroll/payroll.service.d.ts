export declare class EmployeePayrollService {
    /**
     * Get own payslips
     */
    getMyPayslips(userId: string, limit?: number): Promise<import("../../../../shared/interfaces/payroll.interface").IPayroll[]>;
    /**
     * Get specific payslip
     */
    getMyPayslip(userId: string, payrollId: string): Promise<import("../../../../shared/interfaces/payroll.interface").IPayroll>;
}
export declare const employeePayrollService: EmployeePayrollService;
//# sourceMappingURL=payroll.service.d.ts.map