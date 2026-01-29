import { Router } from 'express';
import { employeeProfileController } from './profile.controller';
import { authenticate } from '../../../../shared/middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

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
router.get('/', employeeProfileController.getMyProfile.bind(employeeProfileController));

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
router.put('/', employeeProfileController.updateMyProfile.bind(employeeProfileController));

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
router.post('/change-password', employeeProfileController.changePassword.bind(employeeProfileController));

export default router;