import { Router } from 'express';
import { notificationsController } from './notifications.controller';
import { authenticate } from '../../../shared/middlewares/auth.middleware';

const router = Router();

// All notification routes require the user to be authenticated
router.use(authenticate);

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
router.get('/', notificationsController.getNotifications.bind(notificationsController));

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
router.put('/:id/read', notificationsController.markAsRead.bind(notificationsController));

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
router.put('/read-all', notificationsController.markAllAsRead.bind(notificationsController));

export default router;
