import { Router } from 'express';
import { managerTeamController } from './team.controller';
import { authenticate, authorize } from '../../../../shared/middlewares/auth.middleware';
import { USER_ROLES } from '../../../../config/constants';

const router = Router();

router.use(authenticate);
router.use(authorize(USER_ROLES.MANAGER, USER_ROLES.HR_ADMIN, USER_ROLES.SUPER_ADMIN));

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
router.get('/', managerTeamController.getTeamMembers.bind(managerTeamController));

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
router.get('/attendance/today', managerTeamController.getTeamAttendanceToday.bind(managerTeamController));

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
router.get('/leave/requests', managerTeamController.getTeamLeaveRequests.bind(managerTeamController));

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
router.get('/:userId', managerTeamController.getTeamMemberDetails.bind(managerTeamController));

export default router;