
// import { Router } from 'express';
// import { payrollController } from './payroll.controller';
// import { authenticate, authorize } from '../../../../shared/middlewares/auth.middleware';
// import { validate } from '../../../../shared/middlewares/validation';
// import { USER_ROLES } from '../../../../config/constants';
// import { generatePayrollValidation } from './payroll.validation';

// const router = Router();

// router.use(authenticate);

// /**
//  * @swagger
//  * /hr/payroll:
//  *   get:
//  *     summary: Get all payroll records with pagination
//  *     tags: [Payroll]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: page
//  *         schema:
//  *           type: integer
//  *           default: 1
//  *         description: Page number
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: integer
//  *           default: 10
//  *         description: Items per page
//  *       - in: query
//  *         name: month
//  *         schema:
//  *           type: integer
//  *           minimum: 1
//  *           maximum: 12
//  *         description: Filter by month
//  *       - in: query
//  *         name: year
//  *         schema:
//  *           type: integer
//  *         description: Filter by year
//  *         example: 2026
//  *       - in: query
//  *         name: paymentStatus
//  *         schema:
//  *           type: string
//  *           enum: [PENDING, PROCESSING, PAID, FAILED]
//  *         description: Filter by payment status
//  *     responses:
//  *       200:
//  *         description: Payroll records retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               allOf:
//  *                 - $ref: '#/components/schemas/PaginatedResponse'
//  *                 - type: object
//  *                   properties:
//  *                     data:
//  *                       type: object
//  *                       properties:
//  *                         data:
//  *                           type: array
//  *                           items:
//  *                             $ref: '#/components/schemas/Payroll'
//  *       401:
//  *         description: Unauthorized
//  *       403:
//  *         description: Forbidden
//  */
// router.get('/', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), payrollController.getAllPayroll.bind(payrollController));

// /**
//  * @swagger
//  * /hr/payroll/user/{userId}:
//  *   get:
//  *     summary: Get payroll history for a specific user
//  *     tags: [Payroll]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: userId
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: User ID
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: integer
//  *           default: 12
//  *         description: Number of records to retrieve
//  *     responses:
//  *       200:
//  *         description: Payroll history retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 status:
//  *                   type: string
//  *                   example: success
//  *                 message:
//  *                   type: string
//  *                 data:
//  *                   type: array
//  *                   items:
//  *                     $ref: '#/components/schemas/Payroll'
//  */
// router.get('/user/:userId', payrollController.getUserPayrollHistory.bind(payrollController));

// /**
//  * @swagger
//  * /hr/payroll/stats/{month}/{year}:
//  *   get:
//  *     summary: Get payroll statistics for a specific month and year
//  *     tags: [Payroll]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: month
//  *         required: true
//  *         schema:
//  *           type: integer
//  *           minimum: 1
//  *           maximum: 12
//  *         description: Month (1-12)
//  *       - in: path
//  *         name: year
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Year
//  *         example: 2026
//  *     responses:
//  *       200:
//  *         description: Payroll statistics retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 status:
//  *                   type: string
//  *                 message:
//  *                   type: string
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     totalGrossSalary:
//  *                       type: number
//  *                       example: 5000000
//  *                     totalDeductions:
//  *                       type: number
//  *                       example: 500000
//  *                     totalNetSalary:
//  *                       type: number
//  *                       example: 4500000
//  *                     totalEmployees:
//  *                       type: number
//  *                       example: 100
//  *                     averageSalary:
//  *                       type: number
//  *                       example: 45000
//  */
// router.get('/stats/:month/:year', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), payrollController.getPayrollStats.bind(payrollController));

// /**
//  * @swagger
//  * /hr/payroll/{id}:
//  *   get:
//  *     summary: Get payroll by ID
//  *     tags: [Payroll]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Payroll ID
//  *     responses:
//  *       200:
//  *         description: Payroll retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 status:
//  *                   type: string
//  *                 message:
//  *                   type: string
//  *                 data:
//  *                   $ref: '#/components/schemas/Payroll'
//  *       404:
//  *         description: Payroll not found
//  */
// router.get('/:id', payrollController.getPayrollById.bind(payrollController));

// /**
//  * @swagger
//  * /hr/payroll/generate:
//  *   post:
//  *     summary: Generate payroll for an employee
//  *     tags: [Payroll]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - userId
//  *               - month
//  *               - year
//  *               - salaryComponents
//  *               - workingDays
//  *               - presentDays
//  *             properties:
//  *               userId:
//  *                 type: string
//  *                 example: '697b0744dfffca6e32868866'
//  *               month:
//  *                 type: integer
//  *                 minimum: 1
//  *                 maximum: 12
//  *                 example: 1
//  *               year:
//  *                 type: integer
//  *                 example: 2026
//  *               salaryComponents:
//  *                 type: object
//  *                 required:
//  *                   - basic
//  *                   - hra
//  *                 properties:
//  *                   basic:
//  *                     type: number
//  *                     example: 30000
//  *                   hra:
//  *                     type: number
//  *                     example: 12000
//  *                   allowances:
//  *                     type: object
//  *                     properties:
//  *                       transport:
//  *                         type: number
//  *                         example: 2000
//  *                       medical:
//  *                         type: number
//  *                         example: 1500
//  *                       special:
//  *                         type: number
//  *                         example: 3000
//  *                       foodAllowance:
//  *                         type: number
//  *                         example: 1500
//  *                       other:
//  *                         type: number
//  *                         example: 0
//  *                   deductions:
//  *                     type: object
//  *                     properties:
//  *                       providentFund:
//  *                         type: number
//  *                         example: 3600
//  *                       professionalTax:
//  *                         type: number
//  *                         example: 200
//  *                       incomeTax:
//  *                         type: number
//  *                         example: 5000
//  *                       esi:
//  *                         type: number
//  *                         example: 0
//  *                       loanDeduction:
//  *                         type: number
//  *                         example: 0
//  *                       other:
//  *                         type: number
//  *                         example: 0
//  *               workingDays:
//  *                 type: integer
//  *                 example: 22
//  *               presentDays:
//  *                 type: integer
//  *                 example: 20
//  *               absentDays:
//  *                 type: integer
//  *                 example: 2
//  *               paidLeaveDays:
//  *                 type: integer
//  *                 example: 1
//  *               unpaidLeaveDays:
//  *                 type: integer
//  *                 example: 1
//  *               overtimeHours:
//  *                 type: number
//  *                 example: 10
//  *               overtimeAmount:
//  *                 type: number
//  *                 example: 2000
//  *               bonus:
//  *                 type: number
//  *                 example: 5000
//  *               incentives:
//  *                 type: number
//  *                 example: 3000
//  *     responses:
//  *       201:
//  *         description: Payroll generated successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 status:
//  *                   type: string
//  *                 message:
//  *                   type: string
//  *                 data:
//  *                   $ref: '#/components/schemas/Payroll'
//  *       400:
//  *         description: Payroll already exists or validation error
//  */
// router.post('/generate', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), validate(generatePayrollValidation), payrollController.generatePayroll.bind(payrollController));

// /**
//  * @swagger
//  * /hr/payroll/{id}/mark-paid:
//  *   put:
//  *     summary: Mark payroll as paid
//  *     tags: [Payroll]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Payroll ID
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               paymentMode:
//  *                 type: string
//  *                 enum: [BANK_TRANSFER, CASH, CHEQUE]
//  *                 example: BANK_TRANSFER
//  *               transactionId:
//  *                 type: string
//  *                 example: 'TXN123456789'
//  *               bankName:
//  *                 type: string
//  *                 example: 'HDFC Bank'
//  *               accountNumber:
//  *                 type: string
//  *                 example: '****1234'
//  *     responses:
//  *       200:
//  *         description: Payroll marked as paid successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 status:
//  *                   type: string
//  *                 message:
//  *                   type: string
//  *                 data:
//  *                   $ref: '#/components/schemas/Payroll'
//  *       404:
//  *         description: Payroll not found
//  */
// router.put('/:id/mark-paid', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), payrollController.markAsPaid.bind(payrollController));



// /**
//  * @swagger
//  * /hr/payroll/{id}/download:
//  *   get:
//  *     summary: Download payslip PDF
//  *     tags: [Payroll]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: PDF file
//  *         content:
//  *           application/pdf:
//  *             schema:
//  *               type: string
//  *               format: binary
//  */
// router.get('/:id/download', payrollController.downloadPayslip.bind(payrollController));

// /**
//  * @swagger
//  * /hr/payroll/{id}/regenerate:
//  *   post:
//  *     summary: Regenerate payslip PDF
//  *     tags: [Payroll]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Payslip regenerated successfully
//  */
// router.post('/:id/regenerate', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), payrollController.regeneratePayslip.bind(payrollController));

// /**
//  * @swagger
//  * /hr/payroll/bulk-generate:
//  *   post:
//  *     summary: Bulk generate payroll for all employees
//  *     tags: [Payroll]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - month
//  *               - year
//  *             properties:
//  *               month:
//  *                 type: integer
//  *               year:
//  *                 type: integer
//  *               departmentId:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Bulk generation completed
//  */
// router.post('/bulk-generate', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), payrollController.bulkGeneratePayroll.bind(payrollController));

// export default router;


//////////////////////////////////


// import { Router } from 'express';
// import { PayrollController } from './payroll.controller';
// import { PayrollValidation } from './payroll.validation';
// // import { authMiddleware } from '../../../../shared/middlewares/auth.middleware';
// import { validate } from '../../../../shared/middlewares/validation';

// const router = Router();

// // All routes require authentication
// router.use(authenticate);

// // GET routes
// router.get('/stats', PayrollController.getPayrollStats);
// router.get('/drafts', PayrollController.getDrafts);
// router.get('/pending', PayrollController.getPending);
// router.get('/', validate(PayrollValidation.getPayrolls), PayrollController.getAllPayrolls);
// router.get('/:id', validate(PayrollValidation.payrollId), PayrollController.getPayrollById);
// router.get('/:id/download', validate(PayrollValidation.payrollId), PayrollController.downloadPayslip);

// // POST routes
// router.post('/', validate(PayrollValidation.createPayroll), PayrollController.createPayroll);
// router.post('/bulk-generate', validate(PayrollValidation.bulkGenerate), PayrollController.bulkGenerate);
// router.post('/:id/generate', validate(PayrollValidation.generatePayslip), PayrollController.generatePayslip);
// router.post('/:id/mark-paid', validate(PayrollValidation.payrollId), PayrollController.markAsPaid);
// router.post('/:id/revise', validate(PayrollValidation.revisePayroll), PayrollController.revisePayroll);

// // PUT routes
// router.put('/:id', validate(PayrollValidation.updatePayroll), PayrollController.updatePayroll);

// // DELETE routes
// router.delete('/:id', validate(PayrollValidation.payrollId), PayrollController.deletePayroll);

// export default router;


//////////////


import { Router } from 'express';
import { PayrollController } from './payroll.controller';
import { PayrollValidation } from './payroll.validation';
// import { authMiddleware } from '../../../../shared/middlewares/auth.middleware';
import { validate } from '../../../../shared/middlewares/validation';
import { authenticate, authorize } from '../../../../shared/middlewares/auth.middleware';

import { PayrollImportController } from './payroll-import.controller';
import { payrollUpload } from '../../../../shared/middlewares/upload.middleware';
const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Payroll
 *   description: Payroll management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SalaryComponents:
 *       type: object
 *       properties:
 *         basic:
 *           type: number
 *           example: 50000
 *         hra:
 *           type: number
 *           example: 20000
 *         allowances:
 *           type: object
 *           properties:
 *             transport:
 *               type: number
 *               example: 2000
 *             medical:
 *               type: number
 *               example: 1500
 *             special:
 *               type: number
 *               example: 3000
 *             statutoryBonus:
 *               type: number
 *               example: 2000
 *             byodPayment:
 *               type: number
 *               example: 500
 *             taskBasedIncentive:
 *               type: number
 *               example: 5000
 *             arrearAmount:
 *               type: number
 *               example: 0
 *             specialPay:
 *               type: number
 *               example: 0
 *             miscellaneous:
 *               type: number
 *               example: 0
 *             other:
 *               type: number
 *               example: 0
 *         deductions:
 *           type: object
 *           properties:
 *             providentFund:
 *               type: number
 *               example: 6000
 *             professionalTax:
 *               type: number
 *               example: 200
 *             incomeTax:
 *               type: number
 *               example: 5000
 *             esi:
 *               type: number
 *               example: 750
 *             leaveWithoutPay:
 *               type: number
 *               example: 0
 *             lateArrivalDeductions:
 *               type: number
 *               example: 500
 *             loanDeduction:
 *               type: number
 *               example: 2000
 *             other:
 *               type: number
 *               example: 0
 *         customEarnings:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               fieldName:
 *                 type: string
 *               fieldValue:
 *                 type: number
 *         customDeductions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               fieldName:
 *                 type: string
 *               fieldValue:
 *                 type: number
 *     
 *     Payroll:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         userId:
 *           type: string
 *           example: "507f1f77bcf86cd799439012"
 *         employeeId:
 *           type: string
 *           example: "EMP001"
 *         month:
 *           type: integer
 *           example: 1
 *         year:
 *           type: integer
 *           example: 2026
 *         salaryComponents:
 *           $ref: '#/components/schemas/SalaryComponents'
 *         grossSalary:
 *           type: number
 *           example: 85500
 *         totalDeductions:
 *           type: number
 *           example: 14450
 *         netSalary:
 *           type: number
 *           example: 71050
 *         workingDays:
 *           type: integer
 *           example: 30
 *         presentDays:
 *           type: integer
 *           example: 28
 *         unpaidLeaveDays:
 *           type: integer
 *           example: 0
 *         paymentStatus:
 *           type: string
 *           enum: [PENDING, PROCESSING, PAID, FAILED]
 *           example: PENDING
 *         isDraft:
 *           type: boolean
 *           example: true
 *         isGenerated:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /hr/payroll/stats:
 *   get:
 *     summary: Get payroll statistics
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Month (defaults to current month)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Year (defaults to current year)
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
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
 *                   example: Payroll statistics retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalPayroll:
 *                       type: number
 *                       example: 128000
 *                     paidEmployees:
 *                       type: integer
 *                       example: 24
 *                     pendingPayments:
 *                       type: integer
 *                       example: 1
 *                     averageSalary:
 *                       type: number
 *                       example: 100000
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', PayrollController.getPayrollStats);

/**
 * @swagger
 * /hr/payroll/drafts:
 *   get:
 *     summary: Get draft payrolls
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Draft payrolls retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payroll'
 */
router.get('/drafts', PayrollController.getDrafts);

/**
 * @swagger
 * /hr/payroll/pending:
 *   get:
 *     summary: Get pending payrolls
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pending payrolls retrieved successfully
 */
router.get('/pending', PayrollController.getPending);

/**
 * @swagger
 * /hr/payroll:
 *   get:
 *     summary: Get all payroll records
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         description: Filter by month
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by year
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, PROCESSING, PAID, FAILED]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Payroll records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payroll'
 *                 pagination:
 *                   type: object
 */
router.get('/', validate(PayrollValidation.getPayrolls), PayrollController.getAllPayrolls);

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
 *                 data:
 *                   $ref: '#/components/schemas/Payroll'
 *       404:
 *         description: Payroll not found
 */
router.get('/:id', validate(PayrollValidation.payrollId), PayrollController.getPayrollById);

/**
 * @swagger
 * /hr/payroll/{id}/download:
 *   get:
 *     summary: Download payslip
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
 *         description: Payslip download link generated
 */
router.get('/:id/download', validate(PayrollValidation.payrollId), PayrollController.downloadPayslip);

/**
 * @swagger
 * /hr/payroll:
 *   post:
 *     summary: Create new payroll
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
 *                 example: "507f1f77bcf86cd799439012"
 *               month:
 *                 type: integer
 *                 example: 1
 *               year:
 *                 type: integer
 *                 example: 2026
 *               salaryComponents:
 *                 $ref: '#/components/schemas/SalaryComponents'
 *               workingDays:
 *                 type: integer
 *                 example: 30
 *               presentDays:
 *                 type: integer
 *                 example: 28
 *     responses:
 *       201:
 *         description: Payroll created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', validate(PayrollValidation.createPayroll), PayrollController.createPayroll);

/**
 * @swagger
 * /hr/payroll/bulk-generate:
 *   post:
 *     summary: Bulk generate payrolls
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
 *               - userIds
 *               - month
 *               - year
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"]
 *               month:
 *                 type: integer
 *                 example: 1
 *               year:
 *                 type: integer
 *                 example: 2026
 *     responses:
 *       201:
 *         description: Payrolls generated successfully
 */
router.post('/bulk-generate', validate(PayrollValidation.bulkGenerate), PayrollController.bulkGenerate);

/**
 * @swagger
 * /hr/payroll/{id}/generate:
 *   post:
 *     summary: Generate payslip (move from draft to generated)
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
 *         description: Payslip generated successfully
 */
router.post('/:id/generate', validate(PayrollValidation.generatePayslip), PayrollController.generatePayslip);

/**
 * @swagger
 * /hr/payroll/{id}/mark-paid:
 *   post:
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentMode
 *             properties:
 *               paymentMode:
 *                 type: string
 *                 enum: [BANK_TRANSFER, CASH, CHEQUE]
 *                 example: BANK_TRANSFER
 *               transactionId:
 *                 type: string
 *                 example: "TXN123456789"
 *               bankName:
 *                 type: string
 *                 example: "HDFC Bank"
 *               accountNumber:
 *                 type: string
 *                 example: "****1234"
 *     responses:
 *       200:
 *         description: Payroll marked as paid successfully
 */
router.post('/:id/mark-paid', validate(PayrollValidation.payrollId), PayrollController.markAsPaid);

/**
 * @swagger
 * /hr/payroll/{id}/revise:
 *   post:
 *     summary: Revise payroll
 *     tags: [Payroll]
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
 *               - revisionReason
 *             properties:
 *               revisionReason:
 *                 type: string
 *                 example: "Incorrect allowance calculation"
 *               salaryComponents:
 *                 $ref: '#/components/schemas/SalaryComponents'
 *     responses:
 *       200:
 *         description: Payroll revised successfully
 */
router.post('/:id/revise', validate(PayrollValidation.revisePayroll), PayrollController.revisePayroll);

/**
 * @swagger
 * /hr/payroll/{id}:
 *   put:
 *     summary: Update payroll
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               salaryComponents:
 *                 $ref: '#/components/schemas/SalaryComponents'
 *               paymentStatus:
 *                 type: string
 *                 enum: [PENDING, PROCESSING, PAID, FAILED]
 *     responses:
 *       200:
 *         description: Payroll updated successfully
 */
router.put('/:id', validate(PayrollValidation.updatePayroll), PayrollController.updatePayroll);

/**
 * @swagger
 * /hr/payroll/{id}:
 *   delete:
 *     summary: Delete payroll
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
 *         description: Payroll deleted successfully
 */
router.delete('/:id', validate(PayrollValidation.payrollId), PayrollController.deletePayroll);


/**
 * @swagger
 * /hr/payroll/template:
 *   get:
 *     summary: Download sample payroll template
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Template file downloaded
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/template', PayrollImportController.downloadTemplate);

/**
 * @swagger
 * /hr/payroll/import:
 *   post:
 *     summary: Import payroll from Excel/CSV file
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - importBasedOn
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Payroll file (.xls, .xlsx, or .csv) - Max 5MB
 *               importBasedOn:
 *                 type: string
 *                 enum: [employeeName, employeeId]
 *                 description: Import based on Employee Name or Employee ID
 *                 example: employeeName
 *     responses:
 *       200:
 *         description: Payroll import completed
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
 *                   example: Payroll import completed. 10 successful, 2 failed
 *                 data:
 *                   type: object
 *                   properties:
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalRecords:
 *                           type: integer
 *                           example: 12
 *                         successfulRecords:
 *                           type: integer
 *                           example: 10
 *                         failedRecords:
 *                           type: integer
 *                           example: 2
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           row:
 *                             type: integer
 *                           error:
 *                             type: string
 *       400:
 *         description: Bad request - No file or invalid format
 */
router.post('/import', payrollUpload.single('file'), PayrollImportController.importPayroll);

/**
 * @swagger
 * /hr/payroll/preview:
 *   post:
 *     summary: Preview payroll data before importing
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Payroll file to preview
 *     responses:
 *       200:
 *         description: File preview generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalRecords:
 *                       type: integer
 *                     validRecords:
 *                       type: integer
 *                     invalidRecords:
 *                       type: integer
 *                     preview:
 *                       type: array
 *                       description: First 10 records
 */
router.post('/preview', payrollUpload.single('file'), PayrollImportController.previewPayroll);


export default router;