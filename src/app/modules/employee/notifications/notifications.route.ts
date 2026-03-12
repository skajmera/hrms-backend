import { Router } from 'express';
import { notificationsController } from '../../notifications/notifications.controller';
import { authenticate } from '../../../../shared/middlewares/auth.middleware';

const router = Router();

// All notification routes require the user to be authenticated
router.use(authenticate);

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
router.get('/', notificationsController.getEmployeeNotifications.bind(notificationsController));

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
router.put('/read-all', notificationsController.markAllEmployeeAsRead.bind(notificationsController));

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
router.put('/:id/read', notificationsController.markAsRead.bind(notificationsController));

export default router;
