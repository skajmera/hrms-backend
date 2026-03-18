"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollImportService = void 0;
const path_1 = __importDefault(require("path"));
const fileParser_1 = require("../../../../shared/utils/fileParser");
const user_dal_1 = require("../../../../shared/dal/user.dal");
const payroll_dal_1 = require("../../../../shared/dal/payroll.dal");
const upload_middleware_1 = require("../../../../shared/middlewares/upload.middleware");
class PayrollImportService {
    /**
     * Process uploaded payroll file
     */
    static async processPayrollFile(filePath, importBasedOn, generatedBy) {
        try {
            const ext = path_1.default.extname(filePath).toLowerCase();
            let parsedData;
            // Parse file based on extension
            if (ext === '.csv') {
                parsedData = await fileParser_1.FileParser.parseCSV(filePath);
            }
            else if (ext === '.xls' || ext === '.xlsx') {
                parsedData = await fileParser_1.FileParser.parseExcel(filePath);
            }
            else {
                throw new Error('Unsupported file format');
            }
            // Validate data
            const { valid, invalid } = fileParser_1.FileParser.validatePayrollData(parsedData);
            // Process valid records
            const results = await this.createPayrollsFromData(valid, importBasedOn, generatedBy);
            // Cleanup file
            (0, upload_middleware_1.cleanupFile)(filePath);
            return {
                success: results.successful.length,
                failed: results.failed.length + invalid.length,
                errors: [...results.failed, ...invalid],
                successfulPayrolls: results.successful
            };
        }
        catch (error) {
            // Cleanup file on error
            (0, upload_middleware_1.cleanupFile)(filePath);
            throw error;
        }
    }
    /**
     * Create payroll records from parsed data
     */
    static async createPayrollsFromData(data, importBasedOn, generatedBy) {
        const successful = [];
        const failed = [];
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            try {
                // Find user
                let user;
                if (importBasedOn === 'employeeId' && row.employeeId) {
                    user = await user_dal_1.userDAL.findByEmployeeId(row.employeeId);
                }
                else if (importBasedOn === 'employeeName' && row.employeeName) {
                    // Search by full name for better accuracy
                    user = await user_dal_1.userDAL.findByName(row.employeeName);
                    // Fallback to broader search if not found by exact name
                    if (!user) {
                        const searchResult = await user_dal_1.userDAL.search(row.employeeName);
                        user = searchResult[0];
                    }
                }
                if (!user) {
                    failed.push({
                        row: i + 1,
                        data: row,
                        error: `User not found: ${row.employeeName || row.employeeId}`
                    });
                    continue;
                }
                // Check if payroll already exists
                const existingPayroll = await payroll_dal_1.payrollDAL.findByUserAndPeriod(user._id.toString(), row.month, row.year);
                if (existingPayroll) {
                    failed.push({
                        row: i + 1,
                        data: row,
                        error: `Payroll already exists for ${user.firstName} ${user.lastName} for ${row.month}/${row.year}`
                    });
                    continue;
                }
                // Calculate totals
                const basic = row.basic || 0;
                const hra = row.hra || 0;
                const totalAllowances = (row.conveyance || 0) + (row.specialAllowance || 0) + (row.statutoryBonus || 0) +
                    (row.byodPayment || 0) + (row.taskBasedIncentive || 0) + (row.arrearAmount || 0) +
                    (row.specialPay || 0) + (row.miscellaneousPay || 0) + (row.nonWorkingDayCompensation || 0) + (row.otherAllowances || 0);
                const totalDeductions = (row.providentFund || 0) + (row.professionalTax || 0) + (row.tds || 0) +
                    (row.esic || 0) + (row.leaveWithoutPay || 0) + (row.lateWithoutPay || 0) +
                    (row.lateArrivalDeductions || 0) + (row.loanRepayment || 0);
                const grossSalary = basic + hra + totalAllowances;
                const netSalary = grossSalary - totalDeductions;
                // Create payroll data
                const payrollData = {
                    grossSalary,
                    totalDeductions,
                    netSalary,
                    userId: user._id,
                    employeeId: user.professionalDetails.employeeId,
                    month: row.month,
                    year: row.year,
                    salaryComponents: {
                        basic: row.basic || 0,
                        hra: row.hra || 0,
                        allowances: {
                            transport: row.conveyance || 0,
                            medical: 0,
                            special: row.specialAllowance || 0,
                            foodAllowance: 0,
                            statutoryBonus: row.statutoryBonus || 0,
                            byodPayment: row.byodPayment || 0,
                            taskBasedIncentive: row.taskBasedIncentive || 0,
                            arrearAmount: row.arrearAmount || 0,
                            arrearMonth: row.arrearMonth,
                            specialPay: row.specialPay || 0,
                            miscellaneous: row.miscellaneousPay || 0,
                            nonWorkingDayCompensation: row.nonWorkingDayCompensation || 0,
                            other: row.otherAllowances || 0
                        },
                        deductions: {
                            providentFund: row.providentFund || 0,
                            professionalTax: row.professionalTax || 0,
                            incomeTax: row.tds || 0,
                            esi: row.esic || 0,
                            leaveWithoutPay: row.leaveWithoutPay || 0,
                            lateWithoutPay: row.lateWithoutPay || 0,
                            lateArrivalDeductions: row.lateArrivalDeductions || 0,
                            loanDeduction: row.loanRepayment || 0,
                            other: 0
                        },
                        customEarnings: [],
                        customDeductions: []
                    },
                    workingDays: row.workingDays || 30,
                    presentDays: row.presentDays || 0,
                    absentDays: 0,
                    unpaidLeaveDays: row.lopDays || 0,
                    generatedBy,
                    isDraft: false,
                    isGenerated: false,
                    isPending: true
                };
                // Create payroll
                const payroll = await payroll_dal_1.payrollDAL.create(payrollData);
                await payroll.populate('userId', 'firstName lastName email profilePicture professionalDetails.employeeId');
                successful.push(payroll);
            }
            catch (error) {
                failed.push({
                    row: i + 1,
                    data: row,
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }
        return { successful, failed };
    }
}
exports.PayrollImportService = PayrollImportService;
//# sourceMappingURL=payroll-import.service.js.map