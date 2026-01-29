import { Router } from 'express';
import { managerLeaveController } from './leave.controller';
import { authenticate, authorize } from '../../../../shared/middlewares/auth.middleware';
import { USER_ROLES } from '../../../../config/constants';

const router = Router();

router.use(authenticate);
router.use(authorize(USER_ROLES.MANAGER, USER_ROLES.HR_ADMIN, USER_ROLES.SUPER_ADMIN));

/**
 * @swagger
 * /manager/leave/{id}/approve:
 *   put:
 *     summary: Approve team member leave
 *     tags: [Manager]
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
 *         description: Leave approved successfully
 */
router.put('/:id/approve', managerLeaveController.approveLeave.bind(managerLeaveController));

/**
 * @swagger
 * /manager/leave/{id}/reject:
 *   put:
 *     summary: Reject team member leave
 *     tags: [Manager]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rejectionReason
 *             properties:
 *               rejectionReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Leave rejected successfully
 */
router.put('/:id/reject', managerLeaveController.rejectLeave.bind(managerLeaveController));

export default router;