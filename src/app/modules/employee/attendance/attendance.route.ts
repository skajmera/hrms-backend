import { Router } from 'express';
import { employeeAttendanceController } from './attendance.controller';
import { authenticate } from '../../../../shared/middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /employee/attendance/mark:
 *   post:
 *     summary: Mark own attendance
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
 *               - date
 *               - status
 *               - shift
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [PRESENT, WFH]
 *               shift:
 *                 type: string
 *               checkInTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Attendance marked successfully
 */
router.post('/mark', employeeAttendanceController.markMyAttendance.bind(employeeAttendanceController));

/**
 * @swagger
 * /employee/attendance:
 *   get:
 *     summary: Get own attendance history
 *     tags: [Employee]
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
 *     responses:
 *       200:
 *         description: Attendance retrieved successfully
 */
router.get('/', employeeAttendanceController.getMyAttendance.bind(employeeAttendanceController));

/**
 * @swagger
 * /employee/attendance/summary/{month}/{year}:
 *   get:
 *     summary: Get own attendance summary
 *     tags: [Employee]
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
 *         description: Summary retrieved successfully
 */
router.get('/summary/:month/:year', employeeAttendanceController.getMyAttendanceSummary.bind(employeeAttendanceController));
router.get('/today', employeeAttendanceController.getMyTodayAttendance.bind(employeeAttendanceController));

export default router;