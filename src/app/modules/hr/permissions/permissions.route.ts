// import { Router } from 'express';
// import { PermissionsController } from './permissions.controller';
// import { PermissionsValidation } from './permissions.validation';
// // import { authMiddleware } from '../../../../shared/middlewares/auth.middleware';
// import { validate } from '../../../../shared/middlewares/validation';
// import { authenticate, authorize } from '../../../../shared/middlewares/auth.middleware';
// const router = Router();

// // All routes require authentication
// router.use(authenticate);

// // GET routes
// router.get('/active', PermissionsController.getActiveUsers);
// router.get('/defaults/:role', PermissionsController.getDefaultPermissions);
// router.get('/', validate(PermissionsValidation.getPermissions), PermissionsController.getAllPermissions);
// router.get('/:userId', validate(PermissionsValidation.userId), PermissionsController.getPermissionByUserId);

// // POST routes
// router.post('/invite', validate(PermissionsValidation.inviteUser), PermissionsController.inviteUser);
// router.post('/check', PermissionsController.checkPermission);
// router.post('/:userId/deactivate', validate(PermissionsValidation.userId), PermissionsController.deactivateUser);
// router.post('/:userId/activate', validate(PermissionsValidation.userId), PermissionsController.activateUser);

// // PUT routes
// router.put('/:userId', validate(PermissionsValidation.updatePermissions), PermissionsController.updatePermissions);

// // DELETE routes
// router.delete('/:userId', validate(PermissionsValidation.userId), PermissionsController.deletePermissions);

// export default router;





import { Router } from 'express';
import { PermissionsController } from './permissions.controller';
import { PermissionsValidation } from './permissions.validation';
// import { authMiddleware } from '../../../../shared/middlewares/auth.middleware';
import { validate } from '../../../../shared/middlewares/validation';
import { authenticate, authorize } from '../../../../shared/middlewares/auth.middleware';
const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: User Permissions
 *   description: User permissions and access control management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PermissionSubSchema:
 *       type: object
 *       properties:
 *         view:
 *           type: boolean
 *           example: true
 *         edit:
 *           type: boolean
 *           example: false
 *         fullAccess:
 *           type: boolean
 *           example: false
 *     
 *     ModulePermissions:
 *       type: object
 *       properties:
 *         employees:
 *           type: object
 *           properties:
 *             employeesList:
 *               $ref: '#/components/schemas/PermissionSubSchema'
 *             employeeProfile:
 *               $ref: '#/components/schemas/PermissionSubSchema'
 *             employeeCareerHistory:
 *               $ref: '#/components/schemas/PermissionSubSchema'
 *             employeeDepartment:
 *               $ref: '#/components/schemas/PermissionSubSchema'
 *             employeeAttendance:
 *               $ref: '#/components/schemas/PermissionSubSchema'
 *             employeeLeave:
 *               $ref: '#/components/schemas/PermissionSubSchema'
 *             employeePayslip:
 *               $ref: '#/components/schemas/PermissionSubSchema'
 *         department:
 *           $ref: '#/components/schemas/PermissionSubSchema'
 *         attendance:
 *           $ref: '#/components/schemas/PermissionSubSchema'
 *         leaves:
 *           $ref: '#/components/schemas/PermissionSubSchema'
 *         offboarding:
 *           $ref: '#/components/schemas/PermissionSubSchema'
 *         payroll:
 *           $ref: '#/components/schemas/PermissionSubSchema'
 *         announcements:
 *           $ref: '#/components/schemas/PermissionSubSchema'
 *         usersPermissions:
 *           $ref: '#/components/schemas/PermissionSubSchema'
 *     
 *     UserPermission:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         userId:
 *           type: string
 *           example: "507f1f77bcf86cd799439012"
 *         email:
 *           type: string
 *           example: "a.shaikh@braininventory.com"
 *         role:
 *           type: string
 *           example: "Admin"
 *         modules:
 *           $ref: '#/components/schemas/ModulePermissions'
 *         isActive:
 *           type: boolean
 *           example: true
 *         invitedBy:
 *           type: string
 *         invitedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/hr/permissions/active:
 *   get:
 *     summary: Get all active users with permissions
 *     tags: [User Permissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active users retrieved successfully
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
 *                     $ref: '#/components/schemas/UserPermission'
 */
router.get('/active', PermissionsController.getActiveUsers);

/**
 * @swagger
 * /api/v1/hr/permissions/defaults/{role}:
 *   get:
 *     summary: Get default permissions by role
 *     tags: [User Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [SUPER_ADMIN, HR_ADMIN, MANAGER, EMPLOYEE]
 *         description: User role
 *     responses:
 *       200:
 *         description: Default permissions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ModulePermissions'
 */
router.get('/defaults/:role', PermissionsController.getDefaultPermissions);

/**
 * @swagger
 * /api/v1/hr/permissions:
 *   get:
 *     summary: Get all user permissions
 *     tags: [User Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter by role
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filter by status
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, email, or role
 *     responses:
 *       200:
 *         description: User permissions retrieved successfully
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
 *                     $ref: '#/components/schemas/UserPermission'
 *                 pagination:
 *                   type: object
 */
router.get('/', validate(PermissionsValidation.getPermissions), PermissionsController.getAllPermissions);

/**
 * @swagger
 * /api/v1/hr/permissions/{userId}:
 *   get:
 *     summary: Get permission by user ID
 *     tags: [User Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User permissions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/UserPermission'
 *       404:
 *         description: User permissions not found
 */
router.get('/:userId', validate(PermissionsValidation.userId), PermissionsController.getPermissionByUserId);

/**
 * @swagger
 * /api/v1/hr/permissions/invite:
 *   post:
 *     summary: Invite user with permissions
 *     tags: [User Permissions]
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
 *               - email
 *               - role
 *               - modules
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439012"
 *               email:
 *                 type: string
 *                 example: "a.shaikh@braininventory.com"
 *               role:
 *                 type: string
 *                 example: "Admin"
 *               modules:
 *                 $ref: '#/components/schemas/ModulePermissions'
 *     responses:
 *       201:
 *         description: User invited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                   example: User invited successfully with permissions
 *                 data:
 *                   $ref: '#/components/schemas/UserPermission'
 *       400:
 *         description: User permissions already exist
 */
router.post('/invite', validate(PermissionsValidation.inviteUser), PermissionsController.inviteUser);

/**
 * @swagger
 * /api/v1/hr/permissions/check:
 *   post:
 *     summary: Check if user has specific permission
 *     tags: [User Permissions]
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
 *               - module
 *               - action
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439012"
 *               module:
 *                 type: string
 *                 example: "employees.employeesList"
 *               action:
 *                 type: string
 *                 enum: [view, edit, fullAccess]
 *                 example: "view"
 *     responses:
 *       200:
 *         description: Permission check completed
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
 *                     hasPermission:
 *                       type: boolean
 *                       example: true
 */
router.post('/check', PermissionsController.checkPermission);

/**
 * @swagger
 * /api/v1/hr/permissions/{userId}/deactivate:
 *   post:
 *     summary: Deactivate user permissions
 *     tags: [User Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deactivated successfully
 */
router.post('/:userId/deactivate', validate(PermissionsValidation.userId), PermissionsController.deactivateUser);

/**
 * @swagger
 * /api/v1/hr/permissions/{userId}/activate:
 *   post:
 *     summary: Activate user permissions
 *     tags: [User Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User activated successfully
 */
router.post('/:userId/activate', validate(PermissionsValidation.userId), PermissionsController.activateUser);

/**
 * @swagger
 * /api/v1/hr/permissions/{userId}:
 *   put:
 *     summary: Update user permissions
 *     tags: [User Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
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
 *               role:
 *                 type: string
 *               modules:
 *                 $ref: '#/components/schemas/ModulePermissions'
 *     responses:
 *       200:
 *         description: User permissions updated successfully
 */
router.put('/:userId', validate(PermissionsValidation.updatePermissions), PermissionsController.updatePermissions);

/**
 * @swagger
 * /api/v1/hr/permissions/{userId}:
 *   delete:
 *     summary: Delete user permissions
 *     tags: [User Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User permissions deleted successfully
 */
router.delete('/:userId', validate(PermissionsValidation.userId), PermissionsController.deletePermissions);

export default router;