"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reports_controller_1 = require("./reports.controller");
const auth_middleware_1 = require("../../../../shared/middlewares/auth.middleware");
const constants_1 = require("../../../../config/constants");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.use((0, auth_middleware_1.authorize)(constants_1.USER_ROLES.SUPER_ADMIN, constants_1.USER_ROLES.HR_ADMIN));
/**
 * @swagger
 * /hr/reports/attendance:
 *   get:
 *     summary: Generate attendance report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report generated successfully
 */
router.get('/attendance', reports_controller_1.reportsController.getAttendanceReport.bind(reports_controller_1.reportsController));
/**
 * @swagger
 * /hr/reports/leave:
 *   get:
 *     summary: Generate leave report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report generated successfully
 */
router.get('/leave', reports_controller_1.reportsController.getLeaveReport.bind(reports_controller_1.reportsController));
/**
 * @swagger
 * /hr/reports/payroll/{month}/{year}:
 *   get:
 *     summary: Generate payroll report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Report generated successfully
 */
router.get('/payroll/:month/:year', reports_controller_1.reportsController.getPayrollReport.bind(reports_controller_1.reportsController));
/**
 * @swagger
 * /hr/reports/headcount:
 *   get:
 *     summary: Generate employee headcount report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Report generated successfully
 */
router.get('/headcount', reports_controller_1.reportsController.getHeadcountReport.bind(reports_controller_1.reportsController));
exports.default = router;
//# sourceMappingURL=reports.route.js.map