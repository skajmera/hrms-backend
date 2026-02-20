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
exports.default = router;
//# sourceMappingURL=dashboard.route.js.map