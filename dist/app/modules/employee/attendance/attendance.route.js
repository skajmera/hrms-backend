"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const attendance_controller_1 = require("./attendance.controller");
const auth_middleware_1 = require("../../../../shared/middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * /employee/attendance/mark:
 *   post:
 *     summary: Mark own attendance
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - status
 *               - shift
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [PRESENT, WFH]
 *               shift:
 *                 type: string
 *               checkInTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Attendance marked successfully
 */
router.post('/mark', attendance_controller_1.employeeAttendanceController.markMyAttendance.bind(attendance_controller_1.employeeAttendanceController));
/**
 * @swagger
 * /employee/attendance:
 *   get:
 *     summary: Get own attendance history
 *     tags: [Employee]
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
 *     responses:
 *       200:
 *         description: Attendance retrieved successfully
 */
router.get('/', attendance_controller_1.employeeAttendanceController.getMyAttendance.bind(attendance_controller_1.employeeAttendanceController));
/**
 * @swagger
 * /employee/attendance/summary/{month}/{year}:
 *   get:
 *     summary: Get own attendance summary
 *     tags: [Employee]
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
 *         description: Summary retrieved successfully
 */
router.get('/summary/:month/:year', attendance_controller_1.employeeAttendanceController.getMyAttendanceSummary.bind(attendance_controller_1.employeeAttendanceController));
exports.default = router;
//# sourceMappingURL=attendance.route.js.map