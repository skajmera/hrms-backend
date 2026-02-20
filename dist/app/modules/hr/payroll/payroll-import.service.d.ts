import { IPayroll } from '../../../../shared/interfaces/payroll.interface';
export declare class PayrollImportService {
    /**
     * Process uploaded payroll file
     */
    static processPayrollFile(filePath: string, importBasedOn: 'employeeName' | 'employeeId', generatedBy: string): Promise<{
        success: number;
        failed: number;
        errors: any[];
        successfulPayrolls: IPayroll[];
    }>;
    /**
     * Create payroll records from parsed data
     */
    private static createPayrollsFromData;
}
//# sourceMappingURL=payroll-import.service.d.ts.map