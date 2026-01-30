// import { Router } from 'express';
// import { payrollController } from './payroll.controller';
// import { authenticate, authorize } from '../../../../shared/middlewares/auth.middleware';
// import { validate } from '../../../../shared/middlewares/validation';
// import { USER_ROLES } from '../../../../config/constants';
// import { generatePayrollValidation } from './payroll.validation';

// const router = Router();

// router.use(authenticate);

// router.get('/', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), payrollController.getAllPayroll.bind(payrollController));
// router.get('/user/:userId', payrollController.getUserPayrollHistory.bind(payrollController));
// router.get('/stats/:month/:year', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), payrollController.getPayrollStats.bind(payrollController));
// router.get('/:id', payrollController.getPayrollById.bind(payrollController));
// router.post('/generate', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), validate(generatePayrollValidation), payrollController.generatePayroll.bind(payrollController));
// router.put('/:id/mark-paid', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), payrollController.markAsPaid.bind(payrollController));

// export default router;

import { Router } from 'express';
import { payrollController } from './payroll.controller';
import { authenticate, authorize } from '../../../../shared/middlewares/auth.middleware';
import { validate } from '../../../../shared/middlewares/validation';
import { USER_ROLES } from '../../../../config/constants';
import { generatePayrollValidation } from './payroll.validation';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /hr/payroll:
 *   get:
 *     summary: Get all payroll records with pagination
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Filter by month
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by year
 *         example: 2026
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *           enum: [PENDING, PROCESSING, PAID, FAILED]
 *         description: Filter by payment status
 *     responses:
 *       200:
 *         description: Payroll records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         data:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Payroll'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), payrollController.getAllPayroll.bind(payrollController));

/**
 * @swagger
 * /hr/payroll/user/{userId}:
 *   get:
 *     summary: Get payroll history for a specific user
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *         description: Number of records to retrieve
 *     responses:
 *       200:
 *         description: Payroll history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payroll'
 */
router.get('/user/:userId', payrollController.getUserPayrollHistory.bind(payrollController));

/**
 * @swagger
 * /hr/payroll/stats/{month}/{year}:
 *   get:
 *     summary: Get payroll statistics for a specific month and year
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Month (1-12)
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: Year
 *         example: 2026
 *     responses:
 *       200:
 *         description: Payroll statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalGrossSalary:
 *                       type: number
 *                       example: 5000000
 *                     totalDeductions:
 *                       type: number
 *                       example: 500000
 *                     totalNetSalary:
 *                       type: number
 *                       example: 4500000
 *                     totalEmployees:
 *                       type: number
 *                       example: 100
 *                     averageSalary:
 *                       type: number
 *                       example: 45000
 */
router.get('/stats/:month/:year', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), payrollController.getPayrollStats.bind(payrollController));

/**
 * @swagger
 * /hr/payroll/{id}:
 *   get:
 *     summary: Get payroll by ID
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payroll ID
 *     responses:
 *       200:
 *         description: Payroll retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Payroll'
 *       404:
 *         description: Payroll not found
 */
router.get('/:id', payrollController.getPayrollById.bind(payrollController));

/**
 * @swagger
 * /hr/payroll/generate:
 *   post:
 *     summary: Generate payroll for an employee
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - month
 *               - year
 *               - salaryComponents
 *               - workingDays
 *               - presentDays
 *             properties:
 *               userId:
 *                 type: string
 *                 example: '507f1f77bcf86cd799439011'
 *               month:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *                 example: 1
 *               year:
 *                 type: integer
 *                 example: 2026
 *               salaryComponents:
 *                 type: object
 *                 required:
 *                   - basic
 *                   - hra
 *                 properties:
 *                   basic:
 *                     type: number
 *                     example: 30000
 *                   hra:
 *                     type: number
 *                     example: 12000
 *                   allowances:
 *                     type: object
 *                     properties:
 *                       transport:
 *                         type: number
 *                         example: 2000
 *                       medical:
 *                         type: number
 *                         example: 1500
 *                       special:
 *                         type: number
 *                         example: 3000
 *                       foodAllowance:
 *                         type: number
 *                         example: 1500
 *                       other:
 *                         type: number
 *                         example: 0
 *                   deductions:
 *                     type: object
 *                     properties:
 *                       providentFund:
 *                         type: number
 *                         example: 3600
 *                       professionalTax:
 *                         type: number
 *                         example: 200
 *                       incomeTax:
 *                         type: number
 *                         example: 5000
 *                       esi:
 *                         type: number
 *                         example: 0
 *                       loanDeduction:
 *                         type: number
 *                         example: 0
 *                       other:
 *                         type: number
 *                         example: 0
 *               workingDays:
 *                 type: integer
 *                 example: 22
 *               presentDays:
 *                 type: integer
 *                 example: 20
 *               absentDays:
 *                 type: integer
 *                 example: 2
 *               paidLeaveDays:
 *                 type: integer
 *                 example: 1
 *               unpaidLeaveDays:
 *                 type: integer
 *                 example: 1
 *               overtimeHours:
 *                 type: number
 *                 example: 10
 *               overtimeAmount:
 *                 type: number
 *                 example: 2000
 *               bonus:
 *                 type: number
 *                 example: 5000
 *               incentives:
 *                 type: number
 *                 example: 3000
 *     responses:
 *       201:
 *         description: Payroll generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Payroll'
 *       400:
 *         description: Payroll already exists or validation error
 */
router.post('/generate', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), validate(generatePayrollValidation), payrollController.generatePayroll.bind(payrollController));

/**
 * @swagger
 * /hr/payroll/{id}/mark-paid:
 *   put:
 *     summary: Mark payroll as paid
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payroll ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentMode:
 *                 type: string
 *                 enum: [BANK_TRANSFER, CASH, CHEQUE]
 *                 example: BANK_TRANSFER
 *               transactionId:
 *                 type: string
 *                 example: 'TXN123456789'
 *               bankName:
 *                 type: string
 *                 example: 'HDFC Bank'
 *               accountNumber:
 *                 type: string
 *                 example: '****1234'
 *     responses:
 *       200:
 *         description: Payroll marked as paid successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Payroll'
 *       404:
 *         description: Payroll not found
 */
router.put('/:id/mark-paid', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), payrollController.markAsPaid.bind(payrollController));



/**
 * @swagger
 * /hr/payroll/{id}/download:
 *   get:
 *     summary: Download payslip PDF
 *     tags: [Payroll]
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
 *         description: PDF file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/:id/download', payrollController.downloadPayslip.bind(payrollController));

/**
 * @swagger
 * /hr/payroll/{id}/regenerate:
 *   post:
 *     summary: Regenerate payslip PDF
 *     tags: [Payroll]
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
 *         description: Payslip regenerated successfully
 */
router.post('/:id/regenerate', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), payrollController.regeneratePayslip.bind(payrollController));

/**
 * @swagger
 * /hr/payroll/bulk-generate:
 *   post:
 *     summary: Bulk generate payroll for all employees
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - month
 *               - year
 *             properties:
 *               month:
 *                 type: integer
 *               year:
 *                 type: integer
 *               departmentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bulk generation completed
 */
router.post('/bulk-generate', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), payrollController.bulkGeneratePayroll.bind(payrollController));

export default router;