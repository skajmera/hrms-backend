"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payroll_controller_1 = require("./payroll.controller");
const auth_middleware_1 = require("../../../../shared/middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * /employee/payroll:
 *   get:
 *     summary: Get own payslips
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *     responses:
 *       200:
 *         description: Payslips retrieved successfully
 */
router.get('/', payroll_controller_1.employeePayrollController.getMyPayslips.bind(payroll_controller_1.employeePayrollController));
/**
 * @swagger
 * /employee/payroll/{id}:
 *   get:
 *     summary: Get specific payslip
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payslip retrieved successfully
 */
router.get('/:id', payroll_controller_1.employeePayrollController.getMyPayslip.bind(payroll_controller_1.employeePayrollController));
exports.default = router;
//# sourceMappingURL=payroll.route.js.map