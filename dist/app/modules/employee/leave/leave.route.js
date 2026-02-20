"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leave_controller_1 = require("./leave.controller");
const auth_middleware_1 = require("../../../../shared/middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * /employee/leave/apply:
 *   post:
 *     summary: Apply for leave
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
 *               - leaveType
 *               - startDate
 *               - endDate
 *               - reason
 *             properties:
 *               leaveType:
 *                 type: string
 *                 enum: [CASUAL, SICK, EARNED]
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Leave applied successfully
 */
router.post('/apply', leave_controller_1.employeeLeaveController.applyLeave.bind(leave_controller_1.employeeLeaveController));
/**
 * @swagger
 * /employee/leave:
 *   get:
 *     summary: Get own leave history
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leaves retrieved successfully
 */
router.get('/', leave_controller_1.employeeLeaveController.getMyLeaves.bind(leave_controller_1.employeeLeaveController));
/**
 * @swagger
 * /employee/leave/balance/{year}:
 *   get:
 *     summary: Get own leave balance
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Leave balance retrieved successfully
 */
router.get('/balance/:year', leave_controller_1.employeeLeaveController.getMyLeaveBalance.bind(leave_controller_1.employeeLeaveController));
/**
 * @swagger
 * /employee/leave/{id}/cancel:
 *   put:
 *     summary: Cancel leave request
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
 *         description: Leave cancelled successfully
 */
router.put('/:id/cancel', leave_controller_1.employeeLeaveController.cancelLeave.bind(leave_controller_1.employeeLeaveController));
exports.default = router;
//# sourceMappingURL=leave.route.js.map