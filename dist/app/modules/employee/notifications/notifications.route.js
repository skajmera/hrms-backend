"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notifications_controller_1 = require("../../notifications/notifications.controller");
const auth_middleware_1 = require("../../../../shared/middlewares/auth.middleware");
const router = (0, express_1.Router)();
// All notification routes require the user to be authenticated
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * tags:
 *   name: Employee Notifications
 *   description: Employee-specific Notifications Management
 */
/**
 * @swagger
 * /employee/notifications:
 *   get:
 *     summary: Get employee platform notifications
 *     tags: [Employee Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 */
router.get('/', notifications_controller_1.notificationsController.getEmployeeNotifications.bind(notifications_controller_1.notificationsController));
/**
 * @swagger
 * /employee/notifications/read-all:
 *   put:
 *     summary: Mark all employee notifications as read
 *     tags: [Employee Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
router.put('/read-all', notifications_controller_1.notificationsController.markAllEmployeeAsRead.bind(notifications_controller_1.notificationsController));
/**
 * @swagger
 * /employee/notifications/{id}/read:
 *   put:
 *     summary: Mark a single notification as read
 *     tags: [Employee Notifications]
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
 *         description: Notification marked as read
 */
router.put('/:id/read', notifications_controller_1.notificationsController.markAsRead.bind(notifications_controller_1.notificationsController));
exports.default = router;
//# sourceMappingURL=notifications.route.js.map