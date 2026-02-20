export declare const generatePayrollValidation: import("express-validator").ValidationChain[];
export declare class PayrollValidation {
    /**
     * Validation for creating payroll
     */
    static createPayroll: import("express-validator").ValidationChain[];
    /**
     * Validation for updating payroll
     */
    static updatePayroll: import("express-validator").ValidationChain[];
    /**
     * Validation for generating payslip
     */
    static generatePayslip: import("express-validator").ValidationChain[];
    /**
     * Validation for bulk payroll generation
     */
    static bulkGenerate: import("express-validator").ValidationChain[];
    /**
     * Validation for payroll query
     */
    static getPayrolls: import("express-validator").ValidationChain[];
    /**
     * Validation for payroll ID param
     */
    static payrollId: import("express-validator").ValidationChain[];
    /**
     * Validation for revision
     */
    static revisePayroll: import("express-validator").ValidationChain[];
}
//# sourceMappingURL=payroll.validation.d.ts.map