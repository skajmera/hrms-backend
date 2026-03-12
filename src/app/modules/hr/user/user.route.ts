// import { Router } from 'express';
// import { userController } from './user.controller';
// import { authenticate, authorize } from '../../../../shared/middlewares/auth.middleware';
// import { validate } from '../../../../shared/middlewares/validation';
// import { USER_ROLES } from '../../../../config/constants';
// import {
//   createUserValidation,
//   updateUserValidation,
//   getUserValidation,
//   queryUsersValidation
// } from './user.validation';

// const router = Router();

// // All routes require authentication
// router.use(authenticate);

// /**
//  * @route   GET /api/v1/hr/users
//  * @desc    Get all users
//  * @access  Private (HR Admin, Super Admin, Manager)
//  */
// router.get(
//   '/',
//   authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN, USER_ROLES.MANAGER),
//   validate(queryUsersValidation),
//   userController.getAllUsers.bind(userController)
// );

// /**
//  * @route   GET /api/v1/hr/users/search
//  * @desc    Search users
//  * @access  Private (HR Admin, Super Admin, Manager)
//  */
// router.get(
//   '/search',
//   authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN, USER_ROLES.MANAGER),
//   userController.searchUsers.bind(userController)
// );

// /**
//  * @route   GET /api/v1/hr/users/stats
//  * @desc    Get user statistics
//  * @access  Private (HR Admin, Super Admin)
//  */
// router.get(
//   '/stats',
//   authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN),
//   userController.getUserStats.bind(userController)
// );

// /**
//  * @route   GET /api/v1/hr/users/department/:departmentId
//  * @desc    Get users by department
//  * @access  Private (HR Admin, Super Admin, Manager)
//  */
// router.get(
//   '/department/:departmentId',
//   authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN, USER_ROLES.MANAGER),
//   userController.getUsersByDepartment.bind(userController)
// );

// /**
//  * @route   GET /api/v1/hr/users/:id
//  * @desc    Get user by ID
//  * @access  Private
//  */
// router.get(
//   '/:id',
//   validate(getUserValidation),
//   userController.getUserById.bind(userController)
// );

// /**
//  * @route   POST /api/v1/hr/users
//  * @desc    Create new user
//  * @access  Private (HR Admin, Super Admin)
//  */
// router.post(
//   '/',
//   authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN),
//   validate(createUserValidation),
//   userController.createUser.bind(userController)
// );

// /**
//  * @route   PUT /api/v1/hr/users/:id
//  * @desc    Update user
//  * @access  Private (HR Admin, Super Admin)
//  */
// router.put(
//   '/:id',
//   authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN),
//   validate(updateUserValidation),
//   userController.updateUser.bind(userController)
// );

// /**
//  * @route   DELETE /api/v1/hr/users/:id
//  * @desc    Delete user
//  * @access  Private (Super Admin)
//  */
// router.delete(
//   '/:id',
//   authorize(USER_ROLES.SUPER_ADMIN),
//   validate(getUserValidation),
//   userController.deleteUser.bind(userController)
// );

// export default router;

import { Router } from 'express';
import { userController } from './user.controller';
import { authenticate, authorize } from '../../../../shared/middlewares/auth.middleware';
import { validate } from '../../../../shared/middlewares/validation';
import { USER_ROLES } from '../../../../config/constants';
import {
  createUserValidation,
  updateUserValidation,
  getUserValidation,
  queryUsersValidation,
  createDraftValidation
} from './user.validation';
import { avatarUpload } from '../../../../shared/middlewares/upload.middleware';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /hr/users:
 *   get:
 *     summary: Get all users with pagination
 *     tags: [Users]
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
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [SUPER_ADMIN, HR_ADMIN, MANAGER, EMPLOYEE]
 *         description: Filter by role
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: Users retrieved successfully
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
 *                             $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 */
router.get(
  '/',
  authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN, USER_ROLES.MANAGER, USER_ROLES.EMPLOYEE),
  validate(queryUsersValidation),
  userController.getAllUsers.bind(userController)
);

/**
 * @swagger
 * /hr/users/search:
 *   get:
 *     summary: Search users by name, email, or employee ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term
 *         example: sk
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
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
 *                     $ref: '#/components/schemas/User'
 */
router.get(
  '/search',
  authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN, USER_ROLES.MANAGER, USER_ROLES.EMPLOYEE),
  userController.searchUsers.bind(userController)
);

/**
 * @swagger
 * /hr/users/stats:
 *   get:
 *     summary: Get user statistics
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       count:
 *                         type: number
 */
router.get(
  '/stats',
  authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN),
  userController.getUserStats.bind(userController)
);

/**
 * @swagger
 * /hr/users/department/{departmentId}:
 *   get:
 *     summary: Get users by department
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Department ID
 *     responses:
 *       200:
 *         description: Users retrieved successfully
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get(
  '/department/:departmentId',
  authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN, USER_ROLES.MANAGER, USER_ROLES.EMPLOYEE),
  userController.getUsersByDepartment.bind(userController)
);

/**
 * @swagger
 * /hr/users/draft:
 *   post:
 *     summary: Create draft user (partial data)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/draft',
  authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN),
  avatarUpload.single('profilePicture'),
  validate(createDraftValidation),
  userController.createDraftEmployee.bind(userController)
);

/**
 * @swagger
 * /hr/users/drafts:
 *   get:
 *     summary: Get all draft employees
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  '/drafts',
  authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN),
  validate(queryUsersValidation),
  userController.getDraftEmployees.bind(userController)
);

/**
 * @swagger
 * /hr/users/upload-avatar:
 *   post:
 *     summary: Upload user profile picture
 *     tags: [Users]
 */
router.post(
  '/upload-avatar',
  authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN),
  avatarUpload.single('profilePicture'),
  userController.uploadAvatar.bind(userController)
);

/**
 * @swagger
 * /hr/users/draft/{id}:
 *   delete:
 *     summary: Delete draft employee
 *     tags: [Users]
 */
router.delete(
  '/draft/:id',
  authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN),
  validate(getUserValidation),
  userController.deleteDraftEmployee.bind(userController)
);

/**
 * @swagger
 * /hr/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  '/:id',
  validate(getUserValidation),
  userController.getUserById.bind(userController)
);

/**
 * @swagger
 * /hr/users:
 *   post:
 *     summary: Create new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - phone
 *               - dateOfBirth
 *               - gender
 *               - currentAddress
 *               - professionalDetails
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: sk
 *               lastName:
 *                 type: string
 *                 example: ajmera
 *               email:
 *                 type: string
 *                 format: email
 *                 example: s.ajmera@braininventory.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: Sk@12345
 *               phone:
 *                 type: string
 *                 example: '+919876543210'
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: '1990-01-15'
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER]
 *                 example: MALE
 *               role:
 *                 type: string
 *                 enum: [SUPER_ADMIN, HR_ADMIN, MANAGER, EMPLOYEE]
 *                 default: EMPLOYEE
 *               currentAddress:
 *                 type: object
 *                 required:
 *                   - street
 *                   - city
 *                   - state
 *                   - country
 *                   - pincode
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: '123 Main Street'
 *                   city:
 *                     type: string
 *                     example: 'Indore'
 *                   state:
 *                     type: string
 *                     example: 'Madhya Pradesh'
 *                   country:
 *                     type: string
 *                     example: 'India'
 *                   pincode:
 *                     type: string
 *                     example: '452001'
 *               professionalDetails:
 *                 type: object
 *                 required:
 *                   - employeeId
 *                   - designation
 *                   - department
 *                   - joiningDate
 *                   - workLocation
 *                 properties:
 *                   employeeId:
 *                     type: string
 *                     example: 'EMP001'
 *                   designation:
 *                     type: string
 *                     example: 'Software Engineer'
 *                   department:
 *                     type: string
 *                     example: '697b0744dfffca6e32868866'
 *                   joiningDate:
 *                     type: string
 *                     format: date
 *                     example: '2026-01-01'
 *                   employmentStatus:
 *                     type: string
 *                     enum: [ACTIVE, PROBATION, RESIGNED, TERMINATED, RETIRED]
 *                     default: PROBATION
 *                   shift:
 *                     type: string
 *                     enum: [MORNING, EVENING, NIGHT, FLEXIBLE]
 *                     default: MORNING
 *                   workLocation:
 *                     type: string
 *                     example: 'Indore Office'
 *     responses:
 *       201:
 *         description: User created successfully
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
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email or Employee ID already exists
 */
router.post(
  '/',
  authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN),
  avatarUpload.single('profilePicture'),
  validate(createUserValidation),
  userController.createUser.bind(userController)
);

// NOTE: /draft and /drafts routes moved above /:id to prevent route hijacking

/**
 * @swagger
 * /hr/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               profilePicture:
 *                 type: string
 *               currentAddress:
 *                 type: object
 *               education:
 *                 type: array
 *                 items:
 *                   type: object
 *               experience:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 */
router.put(
  '/:id',
  authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN),
  avatarUpload.single('profilePicture'),
  validate(updateUserValidation),
  userController.updateUser.bind(userController)
);

/**
 * @swagger
 * /hr/users/employee/{employeeId}:
 *   get:
 *     summary: Get user by employee ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID (e.g., EMP001)
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 */
router.get(
  '/employee/:employeeId',
  authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN, USER_ROLES.MANAGER),
  userController.getUserByEmployeeId.bind(userController)
);

/**
 * @swagger
 * /hr/users/{id}/clear-device:
 *   post:
 *     summary: Clear user registered device
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Device cleared successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 */
router.post(
  '/:id/clear-device',
  authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN),
  validate(getUserValidation),
  userController.clearUserDevice.bind(userController)
);

/**
 * @swagger
 * /hr/users/device-token:
 *   post:
 *     summary: Register Firebase Cloud Messaging (FCM) device token
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: "fcm_token_xyz..."
 *     responses:
 *       200:
 *         description: Token registered successfully
 *       400:
 *         description: Validation error
 */
router.post(
  '/device-token',
  userController.addDeviceToken.bind(userController)
);

// NOTE: /upload-avatar route moved above /:id to prevent route hijacking

// NOTE: /draft/:id route moved above /:id to prevent route hijacking

/**
 * @swagger
 * /hr/users/{id}:
 *   delete:
 *     summary: Delete user (soft delete)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete(
  '/:id',
  authorize(USER_ROLES.SUPER_ADMIN),
  validate(getUserValidation),
  userController.deleteUser.bind(userController)
);

export default router;