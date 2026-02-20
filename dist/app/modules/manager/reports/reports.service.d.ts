export declare class ReportsService {
    /**
     * Generate attendance report
     */
    generateAttendanceReport(startDate: Date, endDate: Date, departmentId?: string): Promise<unknown[]>;
    /**
     * Generate leave report
     */
    generateLeaveReport(year: number, departmentId?: string): Promise<unknown[]>;
    /**
     * Generate payroll report
     */
    generatePayrollReport(month: number, year: number): Promise<{
        payrolls: import("../../../../shared/interfaces/payroll.interface").IPayroll[];
        summary: {
            totalEmployees: number;
            totalGrossSalary: number;
            totalNetSalary: number;
            totalDeductions: number;
            averageSalary: number;
        };
    }>;
    /**
     * Generate employee headcount report
     */
    generateHeadcountReport(): Promise<{
        total: number;
        byDepartment: any;
        byRole: any;
        byEmploymentStatus: any;
    }>;
}
export declare const reportsService: ReportsService;
//# sourceMappingURL=reports.service.d.ts.map