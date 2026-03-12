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
 *   name: HR Notifications
 *   description: HR-specific Notifications Management
 */
/**
 * @swagger
 * /hr/notifications:
 *   get:
 *     summary: Get HR platform notifications
 *     tags: [HR Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 */
router.get('/', notifications_controller_1.notificationsController.getHRNotifications.bind(notifications_controller_1.notificationsController));
/**
 * @swagger
 * /hr/notifications/read-all:
 *   put:
 *     summary: Mark all HR notifications as read
 *     tags: [HR Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
router.put('/read-all', notifications_controller_1.notificationsController.markAllHRAsRead.bind(notifications_controller_1.notificationsController));
/**
 * @swagger
 * /hr/notifications/{id}/read:
 *   put:
 *     summary: Mark a single notification as read
 *     tags: [HR Notifications]
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