import { Router } from 'express';
import { authController } from './auth.controller';
import { authenticate } from '../../../shared/middlewares/auth.middleware';
import { validate } from '../../../shared/middlewares/validation';
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation
} from './auth.validation';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user
 * @access  Public
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
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
 *                 example: EMPLOYEE
 *               currentAddress:
 *                 type: object
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
 *                   workLocation:
 *                     type: string
 *                     example: 'Indore Office'
 *     responses:
 *       201:
 *         description: User registered successfully
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
 *                   example: User registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refreshToken:
 *                       type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.post('/register', validate(registerValidation), authController.register.bind(authController));

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: s.ajmera@braininventory.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Sk@12345
 *     responses:
 *       200:
 *         description: Login successful
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
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', validate(loginValidation), authController.login.bind(authController));

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */


/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', authenticate, authController.logout.bind(authController));

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Forgot password
 * @access  Public
 */
router.post('/forgot-password', validate(forgotPasswordValidation), authController.forgotPassword.bind(authController));

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password
 * @access  Public
 */
router.post('/reset-password', validate(resetPasswordValidation), authController.resetPassword.bind(authController));

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh token
 * @access  Public
 */
router.post('/refresh', authController.refreshToken.bind(authController));

/**
 * @route   GET /api/v1/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */


/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
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
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', authenticate, authController.getProfile.bind(authController));

export default router;