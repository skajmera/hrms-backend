"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const team_controller_1 = require("./team.controller");
const auth_middleware_1 = require("../../../../shared/middlewares/auth.middleware");
const constants_1 = require("../../../../config/constants");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.use((0, auth_middleware_1.authorize)(constants_1.USER_ROLES.MANAGER, constants_1.USER_ROLES.HR_ADMIN, constants_1.USER_ROLES.SUPER_ADMIN));
/**
 * @swagger
 * /manager/team:
 *   get:
 *     summary: Get team members
 *     tags: [Manager]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Team members retrieved successfully
 */
router.get('/', team_controller_1.managerTeamController.getTeamMembers.bind(team_controller_1.managerTeamController));
/**
 * @swagger
 * /manager/team/attendance/today:
 *   get:
 *     summary: Get team attendance for today
 *     tags: [Manager]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Team attendance retrieved successfully
 */
router.get('/attendance/today', team_controller_1.managerTeamController.getTeamAttendanceToday.bind(team_controller_1.managerTeamController));
/**
 * @swagger
 * /manager/team/leave/requests:
 *   get:
 *     summary: Get pending leave requests from team
 *     tags: [Manager]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leave requests retrieved successfully
 */
router.get('/leave/requests', team_controller_1.managerTeamController.getTeamLeaveRequests.bind(team_controller_1.managerTeamController));
/**
 * @swagger
 * /manager/team/{userId}:
 *   get:
 *     summary: Get team member details
 *     tags: [Manager]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Team member details retrieved successfully
 */
router.get('/:userId', team_controller_1.managerTeamController.getTeamMemberDetails.bind(team_controller_1.managerTeamController));
exports.default = router;
//# sourceMappingURL=team.route.js.map