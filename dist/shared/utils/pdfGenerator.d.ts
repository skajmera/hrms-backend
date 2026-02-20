import { IPayroll } from '../interfaces/payroll.interface';
import { IUser } from '../interfaces/user.interface';
interface PayslipData {
    payroll: IPayroll;
    user: IUser;
}
export declare class PDFGenerator {
    /**
     * Generate salary slip PDF
     */
    static generateSalarySlip(data: PayslipData): Promise<string>;
    /**
     * Add header to PDF
     */
    private static addHeader;
    /**
     * Add employee details
     */
    private static addEmployeeDetails;
    /**
     * Add salary details table
     */
    private static addSalaryDetails;
    /**
     * Add footer
     */
    private static addFooter;
    /**
     * Generate multiple payslips
     */
    static generateBulkPayslips(payslips: PayslipData[]): Promise<string[]>;
}
export {};
//# sourceMappingURL=pdfGenerator.d.ts.map