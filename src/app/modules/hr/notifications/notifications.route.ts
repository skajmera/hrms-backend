import { Router } from 'express';
import { notificationsController } from '../../notifications/notifications.controller';
import { authenticate } from '../../../../shared/middlewares/auth.middleware';

const router = Router();

// All notification routes require the user to be authenticated
router.use(authenticate);

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
router.get('/', notificationsController.getHRNotifications.bind(notificationsController));

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
router.put('/read-all', notificationsController.markAllHRAsRead.bind(notificationsController));

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
router.put('/:id/read', notificationsController.markAsRead.bind(notificationsController));

export default router;
