import { Router } from 'express';
import { employeeDashboardController } from './dashboard.controller';
import { authenticate } from '../../../../shared/middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

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
router.get('/', employeeDashboardController.getMyDashboard.bind(employeeDashboardController));

export default router;