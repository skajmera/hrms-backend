import { Router } from 'express';
import { PermissionsController } from './permissions.controller';
import { PermissionsValidation } from './permissions.validation';
import { validate } from '../../../../shared/middlewares/validation';
import { authenticate } from '../../../../shared/middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

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
router.get('/active', PermissionsController.getActiveUsers);

/**
 * @swagger
 * /hr/permissions/defaults/{role}:
 *   get:
 *     summary: Get default permissions by role
 *     tags: [User Permissions]
 */
router.get('/defaults/:role', PermissionsController.getDefaultPermissions);

/**
 * @swagger
 * /hr/permissions:
 *   get:
 *     summary: Get all user permissions
 *     tags: [User Permissions]
 */
router.get('/', validate(PermissionsValidation.getPermissions), PermissionsController.getAllPermissions);

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
router.get('/my', PermissionsController.getMyPermissions);

/**
 * @swagger
 * /hr/permissions/my-assigned:
 *   get:
 *     summary: Get exact assigned permission for the currently logged-in user (returns object, or empty object if none)
 *     tags: [User Permissions]
 *     security:
 *       - bearerAuth: []
 */
router.get('/my-assigned', PermissionsController.getMyAssignedPermissions);

/**
 * @swagger
 * /hr/permissions/{userId}:
 *   get:
 *     summary: Get permission by user ID
 *     tags: [User Permissions]
 */
router.get('/:userId', validate(PermissionsValidation.userId), PermissionsController.getPermissionByUserId);

// --- POST Routes ---

/**
 * @swagger
 * /hr/permissions/invite:
 *   post:
 *     summary: Invite user with permissions
 *     tags: [User Permissions]
 */
router.post('/invite', validate(PermissionsValidation.inviteUser), PermissionsController.inviteUser);

/**
 * @swagger
 * /hr/permissions/check:
 *   post:
 *     summary: Check if user has specific permission
 *     tags: [User Permissions]
 */
router.post('/check', PermissionsController.checkPermission);

/**
 * @swagger
 * /hr/permissions/{userId}/deactivate:
 *   post:
 *     summary: Deactivate user permissions
 *     tags: [User Permissions]
 */
router.post('/:userId/deactivate', validate(PermissionsValidation.userId), PermissionsController.deactivateUser);

/**
 * @swagger
 * /hr/permissions/{userId}/activate:
 *   post:
 *     summary: Activate user permissions
 *     tags: [User Permissions]
 */
router.post('/:userId/activate', validate(PermissionsValidation.userId), PermissionsController.activateUser);

// --- PUT Routes ---

/**
 * @swagger
 * /hr/permissions/{userId}:
 *   put:
 *     summary: Update user permissions
 *     tags: [User Permissions]
 */
router.put('/:userId', validate(PermissionsValidation.updatePermissions), PermissionsController.updatePermissions);

// --- DELETE Routes ---

/**
 * @swagger
 * /hr/permissions/{userId}:
 *   delete:
 *     summary: Delete user permissions
 *     tags: [User Permissions]
 */
router.delete('/:userId', validate(PermissionsValidation.userId), PermissionsController.deletePermissions);

export default router;