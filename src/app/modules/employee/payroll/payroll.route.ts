import { Router } from 'express';
import { employeePayrollController } from './payroll.controller';
import { authenticate } from '../../../../shared/middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /employee/payroll:
 *   get:
 *     summary: Get own payslips
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *     responses:
 *       200:
 *         description: Payslips retrieved successfully
 */
router.get('/', employeePayrollController.getMyPayslips.bind(employeePayrollController));

/**
 * @swagger
 * /employee/payroll/{id}:
 *   get:
 *     summary: Get specific payslip
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
 *         description: Payslip retrieved successfully
 */
router.get('/:id', employeePayrollController.getMyPayslip.bind(employeePayrollController));

export default router;