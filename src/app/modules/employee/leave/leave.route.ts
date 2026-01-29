import { Router } from 'express';
import { employeeLeaveController } from './leave.controller';
import { authenticate } from '../../../../shared/middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /employee/leave/apply:
 *   post:
 *     summary: Apply for leave
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - leaveType
 *               - startDate
 *               - endDate
 *               - reason
 *             properties:
 *               leaveType:
 *                 type: string
 *                 enum: [CASUAL, SICK, EARNED]
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Leave applied successfully
 */
router.post('/apply', employeeLeaveController.applyLeave.bind(employeeLeaveController));

/**
 * @swagger
 * /employee/leave:
 *   get:
 *     summary: Get own leave history
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leaves retrieved successfully
 */
router.get('/', employeeLeaveController.getMyLeaves.bind(employeeLeaveController));

/**
 * @swagger
 * /employee/leave/balance/{year}:
 *   get:
 *     summary: Get own leave balance
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Leave balance retrieved successfully
 */
router.get('/balance/:year', employeeLeaveController.getMyLeaveBalance.bind(employeeLeaveController));

/**
 * @swagger
 * /employee/leave/{id}/cancel:
 *   put:
 *     summary: Cancel leave request
 *     tags: [Employee]
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
 *         description: Leave cancelled successfully
 */
router.put('/:id/cancel', employeeLeaveController.cancelLeave.bind(employeeLeaveController));

export default router;