"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const permissions_controller_1 = require("./permissions.controller");
const permissions_validation_1 = require("./permissions.validation");
const validation_1 = require("../../../../shared/middlewares/validation");
const auth_middleware_1 = require("../../../../shared/middlewares/auth.middleware");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * tags:
 *   name: User Permissions
 *   description: User permissions and access control management
 */
// --- GET Routes ---
/**
 * @swagger
 * /hr/permissions/active:
 *   get:
 *     summary: Get all active users with permissions
 *     tags: [User Permissions]
 */
router.get('/active', permissions_controller_1.PermissionsController.getActiveUsers);
/**
 * @swagger
 * /hr/permissions/defaults/{role}:
 *   get:
 *     summary: Get default permissions by role
 *     tags: [User Permissions]
 */
router.get('/defaults/:role', permissions_controller_1.PermissionsController.getDefaultPermissions);
/**
 * @swagger
 * /hr/permissions:
 *   get:
 *     summary: Get all user permissions
 *     tags: [User Permissions]
 */
router.get('/', (0, validation_1.validate)(permissions_validation_1.PermissionsValidation.getPermissions), permissions_controller_1.PermissionsController.getAllPermissions);
/**
 * @swagger
 * /hr/permissions/my:
 *   get:
 *     summary: Get permissions for the currently logged-in user
 *     tags: [User Permissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Your permissions retrieved successfully
 */
router.get('/my', permissions_controller_1.PermissionsController.getMyPermissions);
/**
 * @swagger
 * /hr/permissions/my-assigned:
 *   get:
 *     summary: Get exact assigned permission for the currently logged-in user (returns object, or empty object if none)
 *     tags: [User Permissions]
 *     security:
 *       - bearerAuth: []
 */
router.get('/my-assigned', permissions_controller_1.PermissionsController.getMyAssignedPermissions);
/**
 * @swagger
 * /hr/permissions/{userId}:
 *   get:
 *     summary: Get permission by user ID
 *     tags: [User Permissions]
 */
router.get('/:userId', (0, validation_1.validate)(permissions_validation_1.PermissionsValidation.userId), permissions_controller_1.PermissionsController.getPermissionByUserId);
// --- POST Routes ---
/**
 * @swagger
 * /hr/permissions/invite:
 *   post:
 *     summary: Invite user with permissions
 *     tags: [User Permissions]
 */
router.post('/invite', (0, validation_1.validate)(permissions_validation_1.PermissionsValidation.inviteUser), permissions_controller_1.PermissionsController.inviteUser);
/**
 * @swagger
 * /hr/permissions/check:
 *   post:
 *     summary: Check if user has specific permission
 *     tags: [User Permissions]
 */
router.post('/check', permissions_controller_1.PermissionsController.checkPermission);
/**
 * @swagger
 * /hr/permissions/{userId}/deactivate:
 *   post:
 *     summary: Deactivate user permissions
 *     tags: [User Permissions]
 */
router.post('/:userId/deactivate', (0, validation_1.validate)(permissions_validation_1.PermissionsValidation.userId), permissions_controller_1.PermissionsController.deactivateUser);
/**
 * @swagger
 * /hr/permissions/{userId}/activate:
 *   post:
 *     summary: Activate user permissions
 *     tags: [User Permissions]
 */
router.post('/:userId/activate', (0, validation_1.validate)(permissions_validation_1.PermissionsValidation.userId), permissions_controller_1.PermissionsController.activateUser);
// --- PUT Routes ---
/**
 * @swagger
 * /hr/permissions/{userId}:
 *   put:
 *     summary: Update user permissions
 *     tags: [User Permissions]
 */
router.put('/:userId', (0, validation_1.validate)(permissions_validation_1.PermissionsValidation.updatePermissions), permissions_controller_1.PermissionsController.updatePermissions);
// --- DELETE Routes ---
/**
 * @swagger
 * /hr/permissions/{userId}:
 *   delete:
 *     summary: Delete user permissions
 *     tags: [User Permissions]
 */
router.delete('/:userId', (0, validation_1.validate)(permissions_validation_1.PermissionsValidation.userId), permissions_controller_1.PermissionsController.deletePermissions);
exports.default = router;
//# sourceMappingURL=permissions.route.js.map