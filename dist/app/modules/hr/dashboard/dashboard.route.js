"use strict";
// import { Router } from 'express';
// import { dashboardController } from './dashboard.controller';
// import { authenticate } from '../../../../shared/middlewares/auth.middleware';
Object.defineProperty(exports, "__esModule", { value: true });
// const router = Router();
// router.use(authenticate);
// router.get('/stats', dashboardController.getDashboardStats.bind(dashboardController));
// router.get('/birthdays', dashboardController.getBirthdays.bind(dashboardController));
// router.get('/new-hires', dashboardController.getNewHires.bind(dashboardController));
// router.get('/announcements', dashboardController.getRecentAnnouncements.bind(dashboardController));
// export default router;
const express_1 = require("express");
const dashboard_controller_1 = require("./dashboard.controller");
const router = (0, express_1.Router)();
// router.use(authenticate);
// router.use(authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN));
// const router = Router();
// router.use(authenticate);
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
router.get('/stats', dashboard_controller_1.dashboardController.getDashboardStats.bind(dashboard_controller_1.dashboardController));
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
router.get('/birthdays', dashboard_controller_1.dashboardController.getBirthdays.bind(dashboard_controller_1.dashboardController));
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
router.get('/new-hires', dashboard_controller_1.dashboardController.getNewHires.bind(dashboard_controller_1.dashboardController));
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
router.get('/announcements', dashboard_controller_1.dashboardController.getRecentAnnouncements.bind(dashboard_controller_1.dashboardController));
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
router.get('/anniversary', dashboard_controller_1.dashboardController.getAnniversary.bind(dashboard_controller_1.dashboardController));
/**
 * @swagger
 * /hr/dashboard/leave-statistics:
 *   get:
 *     summary: Get complete leave statistics for all users
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leave statistics retrieved successfully
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
 *                   type: object
 *                   properties:
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalLeaveRequests:
 *                           type: number
 *                         approvedLeaves:
 *                           type: number
 *                         pendingApprovals:
 *                           type: number
 *                         totalLeaveRemaining:
 *                           type: number
 *                         percentageChange:
 *                           type: string
 *                         approvalRate:
 *                           type: string
 */
router.get('/leave-statistics', 
//   authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN, USER_ROLES.MANAGER),
dashboard_controller_1.dashboardController.getLeaveStatistics.bind(dashboard_controller_1.dashboardController));
/**
 * @swagger
 * /hr/dashboard/top-leave-takers:
 *   get:
 *     summary: Get employees with most leaves taken
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Top leave takers retrieved successfully
 */
router.get('/top-leave-takers', 
//   authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN, USER_ROLES.MANAGER),
dashboard_controller_1.dashboardController.getTopLeaveTakers.bind(dashboard_controller_1.dashboardController));
exports.default = router;
//# sourceMappingURL=dashboard.route.js.map