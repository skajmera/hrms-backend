import { Router } from 'express';
import { PayrollController } from './payroll.controller';
import { PayrollValidation } from './payroll.validation';
import { validate } from '../../../../shared/middlewares/validation';
import { authenticate } from '../../../../shared/middlewares/auth.middleware';
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

// --- GET Routes (Specific routes first) ---

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
 * /hr/payroll/template:
 *   get:
 *     summary: Download sample payroll template
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Template file downloaded
 */
router.get('/template', PayrollImportController.downloadTemplate);

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
 */
router.get('/user/:userId', PayrollController.getUserPayrollHistory);

// --- GET Routes (Generalized routes) ---

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
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, PENDING, GENERATED, PROCESSING, PAID, FAILED]
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
 *       404:
 *         description: Payroll not found
 */
router.get('/:id', validate(PayrollValidation.payrollId), PayrollController.getPayrollById);

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
 */
router.get('/:id/download', PayrollController.downloadPayslip);

// --- POST Routes ---

/**
 * @swagger
 * /hr/payroll:
 *   post:
 *     summary: Create new payroll
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Payroll created successfully
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
 *     responses:
 *       201:
 *         description: Payrolls generated successfully
 */
router.post('/bulk-generate', validate(PayrollValidation.bulkGenerate), PayrollController.bulkGenerate);

/**
 * @swagger
 * /hr/payroll/import:
 *   post:
 *     summary: Import payroll from Excel/CSV file
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payroll import completed
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
 *     responses:
 *       200:
 *         description: File preview generated
 */
router.post('/preview', payrollUpload.single('file'), PayrollImportController.previewPayroll);

/**
 * @swagger
 * /hr/payroll/{id}/generate:
 *   post:
 *     summary: Generate payslip (move from draft to generated)
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
 *         description: Payroll revised successfully
 */
router.post('/:id/revise', validate(PayrollValidation.revisePayroll), PayrollController.revisePayroll);

// --- PUT Routes ---

/**
 * @swagger
 * /hr/payroll/{id}:
 *   put:
 *     summary: Update payroll
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payroll updated successfully
 */
router.put('/:id', validate(PayrollValidation.updatePayroll), PayrollController.updatePayroll);

// --- DELETE Routes ---

/**
 * @swagger
 * /hr/payroll/{id}:
 *   delete:
 *     summary: Delete payroll
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payroll deleted successfully
 */
router.delete('/:id', validate(PayrollValidation.payrollId), PayrollController.deletePayroll);

export default router;