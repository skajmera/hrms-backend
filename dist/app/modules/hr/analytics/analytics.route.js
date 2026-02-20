"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = require("./analytics.controller");
const auth_middleware_1 = require("../../../../shared/middlewares/auth.middleware");
const constants_1 = require("../../../../config/constants");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
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
router.get('/attendance', (0, auth_middleware_1.authorize)(constants_1.USER_ROLES.SUPER_ADMIN, constants_1.USER_ROLES.HR_ADMIN, constants_1.USER_ROLES.MANAGER), analytics_controller_1.analyticsController.getAttendanceStatistics.bind(analytics_controller_1.analyticsController));
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
router.get('/department-wise', (0, auth_middleware_1.authorize)(constants_1.USER_ROLES.SUPER_ADMIN, constants_1.USER_ROLES.HR_ADMIN), analytics_controller_1.analyticsController.getDepartmentWiseAnalytics.bind(analytics_controller_1.analyticsController));
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
router.get('/employee/:userId', (0, auth_middleware_1.authorize)(constants_1.USER_ROLES.SUPER_ADMIN, constants_1.USER_ROLES.HR_ADMIN, constants_1.USER_ROLES.MANAGER), analytics_controller_1.analyticsController.getEmployeePerformanceAnalytics.bind(analytics_controller_1.analyticsController));
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
router.get('/trend', (0, auth_middleware_1.authorize)(constants_1.USER_ROLES.SUPER_ADMIN, constants_1.USER_ROLES.HR_ADMIN, constants_1.USER_ROLES.MANAGER), analytics_controller_1.analyticsController.getAttendanceTrend.bind(analytics_controller_1.analyticsController));
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
router.get('/leave-stats', (0, auth_middleware_1.authorize)(constants_1.USER_ROLES.SUPER_ADMIN, constants_1.USER_ROLES.HR_ADMIN, constants_1.USER_ROLES.MANAGER), analytics_controller_1.analyticsController.getLeaveStatistics.bind(analytics_controller_1.analyticsController));
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
router.get('/realtime', (0, auth_middleware_1.authorize)(constants_1.USER_ROLES.SUPER_ADMIN, constants_1.USER_ROLES.HR_ADMIN, constants_1.USER_ROLES.MANAGER), analytics_controller_1.analyticsController.getRealTimeDashboardStats.bind(analytics_controller_1.analyticsController));
exports.default = router;
//# sourceMappingURL=analytics.route.js.map