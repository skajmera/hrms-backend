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
router.get('/birthdays', employeeDashboardController.getBirthdays.bind(employeeDashboardController));

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
router.get('/anniversary', employeeDashboardController.getAnniversary.bind(employeeDashboardController));

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
router.get('/new-hires', employeeDashboardController.getNewHires.bind(employeeDashboardController));

export default router;