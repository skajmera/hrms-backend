import { Router } from 'express';
import { reportsController } from './reports.controller';
import { authenticate, authorize } from '../../../../shared/middlewares/auth.middleware';
import { USER_ROLES } from '../../../../config/constants';

const router = Router();

router.use(authenticate);
router.use(authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN));

/**
 * @swagger
 * /hr/reports/attendance:
 *   get:
 *     summary: Generate attendance report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report generated successfully
 */
router.get('/attendance', reportsController.getAttendanceReport.bind(reportsController));

/**
 * @swagger
 * /hr/reports/leave:
 *   get:
 *     summary: Generate leave report
 *     tags: [Reports]
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
 *         description: Report generated successfully
 */
router.get('/leave', reportsController.getLeaveReport.bind(reportsController));

/**
 * @swagger
 * /hr/reports/payroll/{month}/{year}:
 *   get:
 *     summary: Generate payroll report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Report generated successfully
 */
router.get('/payroll/:month/:year', reportsController.getPayrollReport.bind(reportsController));

/**
 * @swagger
 * /hr/reports/headcount:
 *   get:
 *     summary: Generate employee headcount report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Report generated successfully
 */
router.get('/headcount', reportsController.getHeadcountReport.bind(reportsController));

export default router;