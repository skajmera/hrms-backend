// import { Router } from 'express';
// import { dashboardController } from './dashboard.controller';
// import { authenticate } from '../../../../shared/middlewares/auth.middleware';

// const router = Router();

// router.use(authenticate);

// router.get('/stats', dashboardController.getDashboardStats.bind(dashboardController));
// router.get('/birthdays', dashboardController.getBirthdays.bind(dashboardController));
// router.get('/new-hires', dashboardController.getNewHires.bind(dashboardController));
// router.get('/announcements', dashboardController.getRecentAnnouncements.bind(dashboardController));

// export default router;
import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { authenticate } from '../../../../shared/middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /hr/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Dashboard statistics retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalEmployees:
 *                       type: number
 *                       example: 150
 *                     attendance:
 *                       type: object
 *                       properties:
 *                         present:
 *                           type: number
 *                           example: 120
 *                         absent:
 *                           type: number
 *                           example: 5
 *                         late:
 *                           type: number
 *                           example: 10
 *                         wfh:
 *                           type: number
 *                           example: 15
 *                         onLeave:
 *                           type: number
 *                           example: 8
 *                     leaves:
 *                       type: object
 *                       properties:
 *                         pending:
 *                           type: number
 *                           example: 12
 *                         onLeaveToday:
 *                           type: number
 *                           example: 8
 */
router.get('/stats', dashboardController.getDashboardStats.bind(dashboardController));

/**
 * @swagger
 * /hr/dashboard/birthdays:
 *   get:
 *     summary: Get today's birthdays
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Birthdays retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       dateOfBirth:
 *                         type: string
 *                         format: date
 *                       profilePicture:
 *                         type: string
 *                       professionalDetails:
 *                         type: object
 *                         properties:
 *                           designation:
 *                             type: string
 *                           department:
 *                             type: object
 */
router.get('/birthdays', dashboardController.getBirthdays.bind(dashboardController));

/**
 * @swagger
 * /hr/dashboard/new-hires:
 *   get:
 *     summary: Get recently joined employees
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days to look back
 *     responses:
 *       200:
 *         description: New hires retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get('/new-hires', dashboardController.getNewHires.bind(dashboardController));

/**
 * @swagger
 * /hr/dashboard/announcements:
 *   get:
 *     summary: Get recent announcements for current user
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Announcements retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Announcement'
 */
router.get('/announcements', dashboardController.getRecentAnnouncements.bind(dashboardController));

/**
 * @swagger
 * /hr/dashboard/anniversary:
 *   get:
 *     summary: Get today's anniversary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Anniversary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       anniversary:
 *                         type: string
 *                         format: date
 *                       profilePicture:
 *                         type: string
 *                       professionalDetails:
 *                         type: object
 *                         properties:
 *                           designation:
 *                             type: string
 *                           department:
 *                             type: object
 */
router.get('/anniversary', dashboardController.getAnniversary.bind(dashboardController));

export default router;