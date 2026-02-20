"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeePayrollService = exports.EmployeePayrollService = void 0;
const payroll_dal_1 = require("../../../../shared/dal/payroll.dal");
class EmployeePayrollService {
    /**
     * Get own payslips
     */
    async getMyPayslips(userId, limit = 12) {
        return await payroll_dal_1.payrollDAL.getUserPayrollHistory(userId, limit);
    }
    /**
     * Get specific payslip
     */
    async getMyPayslip(userId, payrollId) {
        const payroll = await payroll_dal_1.payrollDAL.findById(payrollId);
        if (!payroll) {
            throw new Error('Payslip not found');
        }
        if (payroll.userId.toString() !== userId) {
            throw new Error('Unauthorized to access this payslip');
        }
        return payroll;
    }
}
exports.EmployeePayrollService = EmployeePayrollService;
exports.employeePayrollService = new EmployeePayrollService();
//# sourceMappingURL=payroll.service.js.map