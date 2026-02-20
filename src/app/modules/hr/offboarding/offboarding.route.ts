import { Router } from 'express';
import { OffboardingController } from './offboarding.controller';
import { OffboardingValidation } from './offboarding.validation';
import { authenticate, authorize } from '../../../../shared/middlewares/auth.middleware';

import { validate } from '../../../../shared/middlewares/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Offboarding
 *   description: Employee resignation and offboarding management
 */

/**
 * @swagger
 * /hr/offboarding/stats:
 *   get:
 *     summary: Get offboarding statistics
 *     tags: [Offboarding]
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
 *         description: Statistics retrieved successfully
 */
router.get('/stats', OffboardingController.getStats);

/**
 * @swagger
 * /hr/offboarding/pending:
 *   get:
 *     summary: Get pending resignation requests
 *     tags: [Offboarding]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending resignations retrieved successfully
 */
router.get('/pending', OffboardingController.getPendingResignations);

/**
 * @swagger
 * /hr/offboarding/notice-period:
 *   get:
 *     summary: Get employees in notice period
 *     tags: [Offboarding]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notice period employees retrieved successfully
 */
router.get('/notice-period', OffboardingController.getNoticePeriodEmployees);

/**
 * @swagger
 * /hr/offboarding:
 *   get:
 *     summary: Get all resignation requests
 *     tags: [Offboarding]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, NOTICE_PERIOD, COMPLETED, WITHDRAWN]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Resignations retrieved successfully
 */
router.get('/', validate(OffboardingValidation.getResignations), OffboardingController.getAllResignations);

/**
 * @swagger
 * /hr/offboarding/{id}:
 *   get:
 *     summary: Get resignation by ID
 *     tags: [Offboarding]
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
 *         description: Resignation retrieved successfully
 */
router.get('/:id', validate(OffboardingValidation.offboardingId), OffboardingController.getResignationById);

/**
 * @swagger
 * /hr/offboarding:
 *   post:
 *     summary: Create resignation request
 *     tags: [Offboarding]
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
 *               - resignationDate
 *               - lastWorkingDate
 *               - reason
 *             properties:
 *               userId:
 *                 type: string
 *               resignationDate:
 *                 type: string
 *                 format: date
 *               lastWorkingDate:
 *                 type: string
 *                 format: date
 *               reason:
 *                 type: string
 *                 enum: [BETTER_OPPORTUNITY, PERSONAL_REASONS, HEALTH_ISSUES, RELOCATION, HIGHER_STUDIES, RETIREMENT, OTHER]
 *               reasonExplanation:
 *                 type: string
 *               employeeNotes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Resignation request created successfully
 */
router.post('/', validate(OffboardingValidation.createResignation), OffboardingController.createResignation);

/**
 * @swagger
 * /hr/offboarding/{id}/approve:
 *   post:
 *     summary: Approve resignation request
 *     tags: [Offboarding]
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
 *               hrNotes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Resignation approved successfully
 */
router.post('/:id/approve', validate(OffboardingValidation.approveResignation), OffboardingController.approveResignation);

/**
 * @swagger
 * /hr/offboarding/{id}/reject:
 *   post:
 *     summary: Reject resignation request
 *     tags: [Offboarding]
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
 *         description: Resignation rejected successfully
 */
router.post('/:id/reject', validate(OffboardingValidation.rejectResignation), OffboardingController.rejectResignation);

/**
 * @swagger
 * /hr/offboarding/{id}/withdraw:
 *   post:
 *     summary: Withdraw resignation request
 *     tags: [Offboarding]
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
 *         description: Resignation withdrawn successfully
 */
router.post('/:id/withdraw', validate(OffboardingValidation.offboardingId), OffboardingController.withdrawResignation);

/**
 * @swagger
 * /hr/offboarding/{id}/complete:
 *   post:
 *     summary: Complete offboarding process
 *     tags: [Offboarding]
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
 *         description: Offboarding completed successfully
 */
router.post('/:id/complete', validate(OffboardingValidation.offboardingId), OffboardingController.completeOffboarding);

/**
 * @swagger
 * /hr/offboarding/{id}/clearance:
 *   put:
 *     summary: Update clearance status
 *     tags: [Offboarding]
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
 *               - clearanceType
 *               - status
 *             properties:
 *               clearanceType:
 *                 type: string
 *                 enum: [assetReturn, itClearance, financeClearance, hrClearance]
 *               status:
 *                 type: string
 *                 enum: [PENDING, COMPLETED]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Clearance updated successfully
 */
router.put('/:id/clearance', validate(OffboardingValidation.offboardingId), OffboardingController.updateClearance);

/**
 * @swagger
 * /hr/offboarding/{id}:
 *   put:
 *     summary: Update resignation request
 *     tags: [Offboarding]
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
 *               lastWorkingDate:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *               hrNotes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Resignation updated successfully
 */
router.put('/:id', validate(OffboardingValidation.updateResignation), OffboardingController.updateResignation);

/**
 * @swagger
 * /hr/offboarding/{id}:
 *   delete:
 *     summary: Delete resignation request
 *     tags: [Offboarding]
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
 *         description: Resignation deleted successfully
 */
router.delete('/:id', validate(OffboardingValidation.offboardingId), OffboardingController.deleteResignation);

export default router;