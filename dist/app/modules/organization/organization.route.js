"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const organization_controller_1 = require("./organization.controller");
const organization_validation_1 = require("./organization.validation");
// import { authMiddleware } from '../../../shared/middlewares/auth.middleware';
const validation_1 = require("../../../shared/middlewares/validation");
const auth_middleware_1 = require("../../../shared/middlewares/auth.middleware");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_1.authenticate);
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
router.get('/my-organization', organization_controller_1.OrganizationController.getMyOrganization);
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
router.get('/', organization_controller_1.OrganizationController.getAllOrganizations);
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
router.get('/:id', (0, validation_1.validate)(organization_validation_1.OrganizationValidation.organizationId), organization_controller_1.OrganizationController.getOrganizationById);
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
router.post('/', (0, validation_1.validate)(organization_validation_1.OrganizationValidation.createOrganization), organization_controller_1.OrganizationController.createOrganization);
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
router.put('/:id', (0, validation_1.validate)(organization_validation_1.OrganizationValidation.updateOrganization), organization_controller_1.OrganizationController.updateOrganization);
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
router.put('/:id/settings', (0, validation_1.validate)(organization_validation_1.OrganizationValidation.updateSettings), organization_controller_1.OrganizationController.updateSettings);
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
router.post('/:id/admins', (0, validation_1.validate)(organization_validation_1.OrganizationValidation.manageAdmin), organization_controller_1.OrganizationController.addAdmin);
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
router.delete('/:id/admins/:adminId', (0, validation_1.validate)(organization_validation_1.OrganizationValidation.organizationId), organization_controller_1.OrganizationController.removeAdmin);
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
router.post('/:id/verify', (0, validation_1.validate)(organization_validation_1.OrganizationValidation.organizationId), organization_controller_1.OrganizationController.verifyOrganization);
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
router.delete('/:id', (0, validation_1.validate)(organization_validation_1.OrganizationValidation.organizationId), organization_controller_1.OrganizationController.deleteOrganization);
// --- Security Settings: Office Locations ---
/**
 * @swagger
 * /organization/settings/locations:
 *   post:
 *     summary: Add office location
 *     tags: [Organization Security]
 *     security:
 *       - bearerAuth: []
 */
router.post('/settings/locations', (0, validation_1.validate)(organization_validation_1.OrganizationValidation.addOfficeLocation), organization_controller_1.OrganizationController.addOfficeLocation);
/**
 * @swagger
 * /organization/settings/locations/{id}:
 *   put:
 *     summary: Update office location
 *     tags: [Organization Security]
 *     security:
 *       - bearerAuth: []
 */
router.put('/settings/locations/:id', (0, validation_1.validate)(organization_validation_1.OrganizationValidation.updateOfficeLocation), organization_controller_1.OrganizationController.updateOfficeLocation);
/**
 * @swagger
 * /organization/settings/locations/{id}:
 *   delete:
 *     summary: Remove office location
 *     tags: [Organization Security]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/settings/locations/:id', (0, validation_1.validate)(organization_validation_1.OrganizationValidation.paramId), organization_controller_1.OrganizationController.removeOfficeLocation);
// --- Security Settings: WiFi Networks ---
/**
 * @swagger
 * /organization/settings/wifi:
 *   post:
 *     summary: Add WiFi network
 *     tags: [Organization Security]
 *     security:
 *       - bearerAuth: []
 */
router.post('/settings/wifi', (0, validation_1.validate)(organization_validation_1.OrganizationValidation.addWifiNetwork), organization_controller_1.OrganizationController.addWifiNetwork);
/**
 * @swagger
 * /organization/settings/wifi/{id}:
 *   put:
 *     summary: Update WiFi network
 *     tags: [Organization Security]
 *     security:
 *       - bearerAuth: []
 */
router.put('/settings/wifi/:id', (0, validation_1.validate)(organization_validation_1.OrganizationValidation.updateWifiNetwork), organization_controller_1.OrganizationController.updateWifiNetwork);
/**
 * @swagger
 * /organization/settings/wifi/{id}:
 *   delete:
 *     summary: Remove WiFi network
 *     tags: [Organization Security]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/settings/wifi/:id', (0, validation_1.validate)(organization_validation_1.OrganizationValidation.paramId), organization_controller_1.OrganizationController.removeWifiNetwork);
exports.default = router;
//# sourceMappingURL=organization.route.js.map