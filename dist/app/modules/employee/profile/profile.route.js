"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_1 = require("./profile.controller");
const auth_middleware_1 = require("../../../../shared/middlewares/auth.middleware");
const validation_1 = require("../../../../shared/middlewares/validation");
const user_validation_1 = require("../../hr/user/user.validation");
// import { authorize } from '../../../../shared/middlewares/authorization';
// import { USER_ROLES } from '../../../../config/constants';   
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * /employee/profile:
 *   get:
 *     summary: Get own profile
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 */
router.get('/', profile_controller_1.employeeProfileController.getMyProfile.bind(profile_controller_1.employeeProfileController));
/**
 * @swagger
 * /employee/profile:
 *   put:
 *     summary: Update own profile
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               currentAddress:
 *                 type: object
 *               education:
 *                 type: array
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put('/', profile_controller_1.employeeProfileController.updateMyProfile.bind(profile_controller_1.employeeProfileController));
/**
 * @swagger
 * /employee/profile/change-password:
 *   post:
 *     summary: Change password
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
router.post('/change-password', profile_controller_1.employeeProfileController.changePassword.bind(profile_controller_1.employeeProfileController));
/**
 * @swagger
 * /employee/profile/get-all-users:
 *   get:
 *     summary: Get all users with pagination
 *     tags: [Employee]
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
router.get('/get-all-users', 
//   authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN, USER_ROLES.MANAGER),
(0, validation_1.validate)(user_validation_1.queryUsersValidation), profile_controller_1.employeeProfileController.getAllUsers.bind(profile_controller_1.employeeProfileController));
exports.default = router;
//# sourceMappingURL=profile.route.js.map