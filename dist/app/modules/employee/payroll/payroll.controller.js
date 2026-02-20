"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeePayrollController = exports.EmployeePayrollController = void 0;
const payroll_service_1 = require("./payroll.service");
const response_1 = require("../../../../shared/utils/response");
const constants_1 = require("../../../../config/constants");
class EmployeePayrollController {
    async getMyPayslips(req, res, next) {
        try {
            const { limit = 12 } = req.query;
            const payslips = await payroll_service_1.employeePayrollService.getMyPayslips(req.user._id.toString(), Number(limit));
            (0, response_1.sendSuccessResponse)(res, 'Payslips retrieved successfully', payslips);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getMyPayslip(req, res, next) {
        try {
            const payslip = await payroll_service_1.employeePayrollService.getMyPayslip(req.user._id.toString(), req.params.id);
            (0, response_1.sendSuccessResponse)(res, 'Payslip retrieved successfully', payslip);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.NOT_FOUND);
        }
    }
}
exports.EmployeePayrollController = EmployeePayrollController;
exports.employeePayrollController = new EmployeePayrollController();
//# sourceMappingURL=payroll.controller.js.map