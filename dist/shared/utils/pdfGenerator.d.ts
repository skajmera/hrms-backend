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
    private static money;
    private static escapeHtml;
    private static wordsForINR;
    private static buildPayslipHtml;
    /**
     * Generate multiple payslips
     */
    static generateBulkPayslips(payslips: PayslipData[]): Promise<string[]>;
}
export {};
//# sourceMappingURL=pdfGenerator.d.ts.map