import { Router } from 'express';
import { analyticsController } from './analytics.controller';
import { authenticate, authorize } from '../../../../shared/middlewares/auth.middleware';
import { USER_ROLES } from '../../../../config/constants';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /hr/analytics/attendance:
 *   get:
 *     summary: Get attendance statistics with month-over-month comparison
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get(
  '/attendance',
  authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN, USER_ROLES.MANAGER),
  analyticsController.getAttendanceStatistics.bind(analyticsController)
);

/**
 * @swagger
 * /hr/analytics/department-wise:
 *   get:
 *     summary: Get department-wise analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully
 */
router.get(
  '/department-wise',
  authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN),
  analyticsController.getDepartmentWiseAnalytics.bind(analyticsController)
);

/**
 * @swagger
 * /hr/analytics/employee/{userId}:
 *   get:
 *     summary: Get employee performance analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully
 */
router.get(
  '/employee/:userId',
  authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN, USER_ROLES.MANAGER),
  analyticsController.getEmployeePerformanceAnalytics.bind(analyticsController)
);

/**
 * @swagger
 * /hr/analytics/trend:
 *   get:
 *     summary: Get attendance trend for the year
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trend data retrieved successfully
 */
router.get(
  '/trend',
  authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN, USER_ROLES.MANAGER),
  analyticsController.getAttendanceTrend.bind(analyticsController)
);

/**
 * @swagger
 * /hr/analytics/leave-stats:
 *   get:
 *     summary: Get leave statistics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get(
  '/leave-stats',
  authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN, USER_ROLES.MANAGER),
  analyticsController.getLeaveStatistics.bind(analyticsController)
);

/**
 * @swagger
 * /hr/analytics/realtime:
 *   get:
 *     summary: Get real-time dashboard statistics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Real-time stats retrieved successfully
 */
router.get(
  '/realtime',
  authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN, USER_ROLES.MANAGER),
  analyticsController.getRealTimeDashboardStats.bind(analyticsController)
);

export default router;