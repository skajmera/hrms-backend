"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("./dashboard.controller");
const auth_middleware_1 = require("../../../../shared/middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * /employee/dashboard:
 *   get:
 *     summary: Get employee dashboard
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard retrieved successfully
 */
router.get('/', dashboard_controller_1.employeeDashboardController.getMyDashboard.bind(dashboard_controller_1.employeeDashboardController));
/**
 * @swagger
 * /employee/dashboard/birthdays:
 *   get:
 *     summary: Get today's birthdays (Employee view)
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Birthdays retrieved successfully
 */
router.get('/birthdays', dashboard_controller_1.employeeDashboardController.getBirthdays.bind(dashboard_controller_1.employeeDashboardController));
/**
 * @swagger
 * /employee/dashboard/anniversary:
 *   get:
 *     summary: Get today's anniversaries (Employee view)
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Anniversaries retrieved successfully
 */
router.get('/anniversary', dashboard_controller_1.employeeDashboardController.getAnniversary.bind(dashboard_controller_1.employeeDashboardController));
/**
 * @swagger
 * /employee/dashboard/new-hires:
 *   get:
 *     summary: Get recently joined employees (Employee view)
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days to look back
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Custom reference date
 *     responses:
 *       200:
 *         description: New hires retrieved successfully
 */
router.get('/new-hires', dashboard_controller_1.employeeDashboardController.getNewHires.bind(dashboard_controller_1.employeeDashboardController));
exports.default = router;
//# sourceMappingURL=dashboard.route.js.map