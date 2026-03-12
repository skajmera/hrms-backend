"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notifications_controller_1 = require("./notifications.controller");
const auth_middleware_1 = require("../../../shared/middlewares/auth.middleware");
const router = (0, express_1.Router)();
// All notification routes require the user to be authenticated
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: User Notifications Management
 */
/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get user notifications
 *     description: Retrieve a paginated list of notifications for the current authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 */
router.get('/', notifications_controller_1.notificationsController.getNotifications.bind(notifications_controller_1.notificationsController));
/**
 * @swagger
 * /notifications/{id}/read:
 *   put:
 *     summary: Mark a single notification as read
 *     tags: [Notifications]
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
/**
 * @swagger
 * /notifications/read-all:
 *   put:
 *     summary: Mark all unread notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
router.put('/read-all', notifications_controller_1.notificationsController.markAllAsRead.bind(notifications_controller_1.notificationsController));
exports.default = router;
//# sourceMappingURL=notifications.route.js.map