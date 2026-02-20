"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_1 = require("./profile.controller");
const auth_middleware_1 = require("../../../../shared/middlewares/auth.middleware");
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
exports.default = router;
//# sourceMappingURL=profile.route.js.map