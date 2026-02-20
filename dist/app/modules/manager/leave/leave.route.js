"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leave_controller_1 = require("./leave.controller");
const auth_middleware_1 = require("../../../../shared/middlewares/auth.middleware");
const constants_1 = require("../../../../config/constants");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.use((0, auth_middleware_1.authorize)(constants_1.USER_ROLES.MANAGER, constants_1.USER_ROLES.HR_ADMIN, constants_1.USER_ROLES.SUPER_ADMIN));
/**
 * @swagger
 * /manager/leave/{id}/approve:
 *   put:
 *     summary: Approve team member leave
 *     tags: [Manager]
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
 *         description: Leave approved successfully
 */
router.put('/:id/approve', leave_controller_1.managerLeaveController.approveLeave.bind(leave_controller_1.managerLeaveController));
/**
 * @swagger
 * /manager/leave/{id}/reject:
 *   put:
 *     summary: Reject team member leave
 *     tags: [Manager]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rejectionReason
 *             properties:
 *               rejectionReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Leave rejected successfully
 */
router.put('/:id/reject', leave_controller_1.managerLeaveController.rejectLeave.bind(leave_controller_1.managerLeaveController));
exports.default = router;
//# sourceMappingURL=leave.route.js.map