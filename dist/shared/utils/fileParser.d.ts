export interface ParsedPayrollData {
    employeeName?: string;
    employeeId?: string;
    month?: number;
    year?: number;
    basic?: number;
    hra?: number;
    conveyance?: number;
    specialAllowance?: number;
    statutoryBonus?: number;
    otherAllowances?: number;
    byodPayment?: number;
    taskBasedIncentive?: number;
    arrearMonth?: string;
    arrearAmount?: number;
    specialPay?: number;
    miscellaneousPay?: number;
    nonWorkingDayCompensation?: number;
    providentFund?: number;
    esic?: number;
    professionalTax?: number;
    leaveWithoutPay?: number;
    lateWithoutPay?: number;
    lateArrivalDeductions?: number;
    tds?: number;
    loanRepayment?: number;
    workingDays?: number;
    presentDays?: number;
    lopDays?: number;
    [key: string]: any;
}
export declare class FileParser {
    /**
     * Parse Excel file (XLS or XLSX)
     */
    static parseExcel(filePath: string): Promise<ParsedPayrollData[]>;
    /**
     * Parse CSV file
     */
    static parseCSV(filePath: string): Promise<ParsedPayrollData[]>;
    /**
     * Map parsed data to payroll structure
     */
    private static mapDataToPayroll;
    /**
     * Normalize key to camelCase
     */
    private static normalizeKey;
    /**
     * Parse string to number
     */
    private static parseNumber;
    /**
     * Validate parsed data
     */
    static validatePayrollData(data: ParsedPayrollData[]): {
        valid: ParsedPayrollData[];
        invalid: any[];
    };
    /**
     * Generate sample template
     */
    static generateSampleTemplate(): any;
}
//# sourceMappingURL=fileParser.d.ts.map