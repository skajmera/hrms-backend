import { Router } from 'express';
import { OrganizationController } from './organization.controller';
import { OrganizationValidation } from './organization.validation';
// import { authMiddleware } from '../../../shared/middlewares/auth.middleware';
import { validate } from '../../../shared/middlewares/validation';
import { authenticate, authorize } from '../../../shared/middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Organization
 *   description: Organization management endpoints
 */

/**
 * @swagger
 * /organization/my-organization:
 *   get:
 *     summary: Get user's organization
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Organization retrieved successfully
 */
router.get('/my-organization', OrganizationController.getMyOrganization);

/**
 * @swagger
 * /organization:
 *   get:
 *     summary: Get all organizations (Admin only)
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
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
 *         description: Organizations retrieved successfully
 */
router.get('/', OrganizationController.getAllOrganizations);

/**
 * @swagger
 * /organization/{id}:
 *   get:
 *     summary: Get organization by ID
 *     tags: [Organization]
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
 *         description: Organization retrieved successfully
 */
router.get('/:id', validate(OrganizationValidation.organizationId), OrganizationController.getOrganizationById);

/**
 * @swagger
 * /organization:
 *   post:
 *     summary: Create organization
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - legalName
 *               - email
 *               - phone
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Brain Inventory"
 *               legalName:
 *                 type: string
 *                 example: "Brain Inventory Private Limited"
 *               email:
 *                 type: string
 *                 example: "info@braininventory.com"
 *               phone:
 *                 type: string
 *                 example: "+91-9876543210"
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   country:
 *                     type: string
 *                   pincode:
 *                     type: string
 *     responses:
 *       201:
 *         description: Organization created successfully
 */
router.post('/', validate(OrganizationValidation.createOrganization), OrganizationController.createOrganization);

/**
 * @swagger
 * /organization/{id}:
 *   put:
 *     summary: Update organization
 *     tags: [Organization]
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
 *     responses:
 *       200:
 *         description: Organization updated successfully
 */
router.put('/:id', validate(OrganizationValidation.updateOrganization), OrganizationController.updateOrganization);

/**
 * @swagger
 * /organization/{id}/settings:
 *   put:
 *     summary: Update organization settings
 *     tags: [Organization]
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
 *             properties:
 *               settings:
 *                 type: object
 *     responses:
 *       200:
 *         description: Settings updated successfully
 */
router.put('/:id/settings', validate(OrganizationValidation.updateSettings), OrganizationController.updateSettings);

/**
 * @swagger
 * /organization/{id}/admins:
 *   post:
 *     summary: Add admin to organization
 *     tags: [Organization]
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
 *               - adminId
 *             properties:
 *               adminId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin added successfully
 */
router.post('/:id/admins', validate(OrganizationValidation.manageAdmin), OrganizationController.addAdmin);

/**
 * @swagger
 * /organization/{id}/admins/{adminId}:
 *   delete:
 *     summary: Remove admin from organization
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin removed successfully
 */
router.delete('/:id/admins/:adminId', validate(OrganizationValidation.organizationId), OrganizationController.removeAdmin);

/**
 * @swagger
 * /organization/{id}/verify:
 *   post:
 *     summary: Verify organization
 *     tags: [Organization]
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
 *         description: Organization verified successfully
 */
router.post('/:id/verify', validate(OrganizationValidation.organizationId), OrganizationController.verifyOrganization);

/**
 * @swagger
 * /organization/{id}:
 *   delete:
 *     summary: Delete organization
 *     tags: [Organization]
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
 *         description: Organization deleted successfully
 */
router.delete('/:id', validate(OrganizationValidation.organizationId), OrganizationController.deleteOrganization);

export default router;