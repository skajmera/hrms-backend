// import { Router } from 'express';
// import { SettingsController } from './settings.controller';
// import { SettingsValidation } from './settings.validation';
// import { authenticate, authorize } from '../../../shared/middlewares/auth.middleware';

// import { validate } from '../../../shared/middlewares/validation';

// const router = Router();

// // All routes require authentication
// router.use(authenticate);

// /**
//  * @swagger
//  * tags:
//  *   name: Settings
//  *   description: Organization and user settings management
//  */

// // Company Info
// router.put('/company-info', validate(SettingsValidation.updateCompanyInfo), SettingsController.updateCompanyInfo);

// // Locale Settings
// router.put('/locale', validate(SettingsValidation.updateLocale), SettingsController.updateLocale);

// // Work Schedules
// router.get('/work-schedules', SettingsController.getWorkSchedules);
// router.get('/work-schedules/:id', SettingsController.getWorkScheduleById);
// router.post('/work-schedules', validate(SettingsValidation.createWorkSchedule), SettingsController.createWorkSchedule);
// router.put('/work-schedules/:id', SettingsController.updateWorkSchedule);
// router.delete('/work-schedules/:id', SettingsController.deleteWorkSchedule);

// // Notifications
// router.get('/notifications', SettingsController.getNotifications);
// router.put('/notifications', validate(SettingsValidation.updateNotifications), SettingsController.updateNotifications);

// // Designations
// router.get('/designations', SettingsController.getDesignations);
// router.get('/designations/:id', SettingsController.getDesignationById);
// router.post('/designations', validate(SettingsValidation.createDesignation), SettingsController.createDesignation);
// router.put('/designations/:id', SettingsController.updateDesignation);
// router.delete('/designations/:id', SettingsController.deleteDesignation);

// // Change Password
// router.post('/change-password', validate(SettingsValidation.changePassword), SettingsController.changePassword);

// // Security Settings
// router.get('/security', SettingsController.getSecuritySettings);
// router.put('/security', authorize(USER_ROLES.SUPER_ADMIN as any), validate(SettingsValidation.updateSecurity), SettingsController.updateSecuritySettings);

// export default router;





import { Router } from 'express';
import { SettingsController } from './settings.controller';
import { SettingsValidation } from './settings.validation';
import { authenticate, authorize } from '../../../shared/middlewares/auth.middleware';
import { USER_ROLES } from '../../../config/constants';

import { validate } from '../../../shared/middlewares/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: Organization and user settings management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CompanyInfo:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Brain Inventory"
 *         website:
 *           type: string
 *           example: "https://braininventory.com"
 *         email:
 *           type: string
 *           example: "info@braininventory.com"
 *         phone:
 *           type: string
 *           example: "+91 9876543210"
 *         description:
 *           type: string
 *           example: "Leading software development company"
 *     
 *     LocaleSettings:
 *       type: object
 *       properties:
 *         country:
 *           type: string
 *           example: "India"
 *         timezone:
 *           type: string
 *           example: "Asia/Kolkata"
 *         timeFormat:
 *           type: string
 *           enum: ["12", "24"]
 *           example: "12"
 *         dateFormat:
 *           type: string
 *           example: "dd/mm/yyyy"
 *         nameFormat:
 *           type: string
 *           enum: ["FIRST_LAST", "LAST_FIRST"]
 *           example: "FIRST_LAST"
 *     
 *     WorkingDay:
 *       type: object
 *       properties:
 *         isWorking:
 *           type: boolean
 *           example: true
 *         startTime:
 *           type: string
 *           example: "09:00"
 *         endTime:
 *           type: string
 *           example: "18:00"
 *         duration:
 *           type: number
 *           example: 8
 *     
 *     WorkSchedule:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         scheduleName:
 *           type: string
 *           example: "Monday-Friday 40 hours/week"
 *         scheduleType:
 *           type: string
 *           enum: ["DURATION_BASED", "CLOCK_BASED"]
 *           example: "CLOCK_BASED"
 *         effectiveFrom:
 *           type: string
 *           format: date
 *           example: "2026-01-01"
 *         standardWorkingHoursPerDay:
 *           type: number
 *           example: 8
 *         workingDays:
 *           type: object
 *           properties:
 *             monday:
 *               $ref: '#/components/schemas/WorkingDay'
 *             tuesday:
 *               $ref: '#/components/schemas/WorkingDay'
 *             wednesday:
 *               $ref: '#/components/schemas/WorkingDay'
 *             thursday:
 *               $ref: '#/components/schemas/WorkingDay'
 *             friday:
 *               $ref: '#/components/schemas/WorkingDay'
 *             saturday:
 *               $ref: '#/components/schemas/WorkingDay'
 *             sunday:
 *               $ref: '#/components/schemas/WorkingDay'
 *         totalWeeklyHours:
 *           type: number
 *           example: 40
 *         isDefault:
 *           type: boolean
 *           example: true
 *         isActive:
 *           type: boolean
 *           example: true
 *     
 *     NotificationSettings:
 *       type: object
 *       properties:
 *         attendance:
 *           type: object
 *           properties:
 *             checkInCheckOut:
 *               type: boolean
 *               example: true
 *             lateArrival:
 *               type: boolean
 *               example: true
 *             earlyExit:
 *               type: boolean
 *               example: true
 *         leaves:
 *           type: object
 *           properties:
 *             application:
 *               type: boolean
 *               example: true
 *             newRequest:
 *               type: boolean
 *               example: true
 *             approval:
 *               type: boolean
 *               example: true
 *             rejection:
 *               type: boolean
 *               example: true
 *         announcements:
 *           type: object
 *           properties:
 *             newAnnouncement:
 *               type: boolean
 *               example: true
 *             mentions:
 *               type: boolean
 *               example: true
 *             likes:
 *               type: boolean
 *               example: false
 *             comments:
 *               type: boolean
 *               example: true
 *         reminders:
 *           type: object
 *           properties:
 *             birthdays:
 *               type: boolean
 *               example: true
 *             anniversaries:
 *               type: boolean
 *               example: true
 *             newHiring:
 *               type: boolean
 *               example: true
 *         payroll:
 *           type: object
 *           properties:
 *             payslipGenerated:
 *               type: boolean
 *               example: true
 *             paymentProcessed:
 *               type: boolean
 *               example: true
 *     
 *     Designation:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         name:
 *           type: string
 *           example: "Chief Executive Officer"
 *         code:
 *           type: string
 *           example: "CEO"
 *         description:
 *           type: string
 *           example: "Top leadership position"
 *         level:
 *           type: number
 *           example: 1
 *         parentDesignation:
 *           type: string
 *           example: null
 *         associatedUsers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *         isActive:
 *           type: boolean
 *           example: true
 */

/**
 * @swagger
 * /settings/company-info:
 *   put:
 *     summary: Update company information
 *     description: Update organization's basic company information
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyInfo'
 *           example:
 *             name: "Brain Inventory"
 *             website: "https://braininventory.com"
 *             email: "info@braininventory.com"
 *             phone: "+91 9876543210"
 *             description: "Leading software development company"
 *     responses:
 *       200:
 *         description: Company information updated successfully
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
 *                   example: Company information updated successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put('/company-info', validate(SettingsValidation.updateCompanyInfo), SettingsController.updateCompanyInfo);

/**
 * @swagger
 * /settings/locale:
 *   put:
 *     summary: Update locale and display format settings
 *     description: Update country, timezone, time format, date format, and name format
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LocaleSettings'
 *           example:
 *             country: "India"
 *             timezone: "Asia/Kolkata"
 *             timeFormat: "12"
 *             dateFormat: "dd/mm/yyyy"
 *             nameFormat: "FIRST_LAST"
 *     responses:
 *       200:
 *         description: Locale settings updated successfully
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
 *                   example: Locale settings updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put('/locale', validate(SettingsValidation.updateLocale), SettingsController.updateLocale);

/**
 * @swagger
 * /settings/work-schedules:
 *   get:
 *     summary: Get all work schedules
 *     description: Retrieve all work schedules for the organization
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Work schedules retrieved successfully
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
 *                   example: Work schedules retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/WorkSchedule'
 *       401:
 *         description: Unauthorized
 */
router.get('/work-schedules', SettingsController.getWorkSchedules);

/**
 * @swagger
 * /settings/work-schedules/{id}:
 *   get:
 *     summary: Get work schedule by ID
 *     description: Retrieve a specific work schedule by its ID
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Work schedule ID
 *     responses:
 *       200:
 *         description: Work schedule retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/WorkSchedule'
 *       404:
 *         description: Work schedule not found
 */
router.get('/work-schedules/:id', SettingsController.getWorkScheduleById);

/**
 * @swagger
 * /settings/work-schedules:
 *   post:
 *     summary: Create new work schedule
 *     description: Create a new work schedule with working days and hours
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scheduleName
 *               - scheduleType
 *               - effectiveFrom
 *               - standardWorkingHoursPerDay
 *               - workingDays
 *             properties:
 *               scheduleName:
 *                 type: string
 *                 example: "Monday-Friday 40 hours/week"
 *               scheduleType:
 *                 type: string
 *                 enum: ["DURATION_BASED", "CLOCK_BASED"]
 *                 example: "CLOCK_BASED"
 *                 description: "Duration Based - No fixed time, just duration. Clock Based - Fixed start and end time"
 *               effectiveFrom:
 *                 type: string
 *                 format: date
 *                 example: "2026-01-01"
 *               standardWorkingHoursPerDay:
 *                 type: number
 *                 example: 8
 *               isDefault:
 *                 type: boolean
 *                 example: true
 *               workingDays:
 *                 type: object
 *                 properties:
 *                   monday:
 *                     type: object
 *                     properties:
 *                       isWorking:
 *                         type: boolean
 *                         example: true
 *                       startTime:
 *                         type: string
 *                         example: "09:00"
 *                       endTime:
 *                         type: string
 *                         example: "18:00"
 *                       duration:
 *                         type: number
 *                         example: 8
 *                   tuesday:
 *                     type: object
 *                     properties:
 *                       isWorking:
 *                         type: boolean
 *                         example: true
 *                       startTime:
 *                         type: string
 *                         example: "09:00"
 *                       endTime:
 *                         type: string
 *                         example: "18:00"
 *                       duration:
 *                         type: number
 *                         example: 8
 *                   wednesday:
 *                     type: object
 *                     properties:
 *                       isWorking:
 *                         type: boolean
 *                         example: true
 *                       startTime:
 *                         type: string
 *                         example: "09:00"
 *                       endTime:
 *                         type: string
 *                         example: "18:00"
 *                       duration:
 *                         type: number
 *                         example: 8
 *                   thursday:
 *                     type: object
 *                     properties:
 *                       isWorking:
 *                         type: boolean
 *                         example: true
 *                       startTime:
 *                         type: string
 *                         example: "09:00"
 *                       endTime:
 *                         type: string
 *                         example: "18:00"
 *                       duration:
 *                         type: number
 *                         example: 8
 *                   friday:
 *                     type: object
 *                     properties:
 *                       isWorking:
 *                         type: boolean
 *                         example: true
 *                       startTime:
 *                         type: string
 *                         example: "09:00"
 *                       endTime:
 *                         type: string
 *                         example: "18:00"
 *                       duration:
 *                         type: number
 *                         example: 8
 *                   saturday:
 *                     type: object
 *                     properties:
 *                       isWorking:
 *                         type: boolean
 *                         example: false
 *                       startTime:
 *                         type: string
 *                         example: null
 *                       endTime:
 *                         type: string
 *                         example: null
 *                       duration:
 *                         type: number
 *                         example: 0
 *                   sunday:
 *                     type: object
 *                     properties:
 *                       isWorking:
 *                         type: boolean
 *                         example: false
 *                       startTime:
 *                         type: string
 *                         example: null
 *                       endTime:
 *                         type: string
 *                         example: null
 *                       duration:
 *                         type: number
 *                         example: 0
 *     responses:
 *       201:
 *         description: Work schedule created successfully
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
 *                   example: Work schedule created successfully
 *                 data:
 *                   $ref: '#/components/schemas/WorkSchedule'
 *       400:
 *         description: Validation error
 */
router.post('/work-schedules', validate(SettingsValidation.createWorkSchedule), SettingsController.createWorkSchedule);

/**
 * @swagger
 * /settings/work-schedules/{id}:
 *   put:
 *     summary: Update work schedule
 *     description: Update an existing work schedule
 *     tags: [Settings]
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
 *             properties:
 *               scheduleName:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *               workingDays:
 *                 type: object
 *     responses:
 *       200:
 *         description: Work schedule updated successfully
 */
router.put('/work-schedules/:id', SettingsController.updateWorkSchedule);

/**
 * @swagger
 * /settings/work-schedules/{id}:
 *   delete:
 *     summary: Delete work schedule
 *     description: Delete a work schedule
 *     tags: [Settings]
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
 *         description: Work schedule deleted successfully
 */
router.delete('/work-schedules/:id', SettingsController.deleteWorkSchedule);

/**
 * @swagger
 * /settings/notifications:
 *   get:
 *     summary: Get notification settings
 *     description: Get current user's notification preferences
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification settings retrieved successfully
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
 *                   example: Notification settings retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/NotificationSettings'
 *       401:
 *         description: Unauthorized
 */
router.get('/notifications', SettingsController.getNotifications);

/**
 * @swagger
 * /settings/notifications:
 *   put:
 *     summary: Update notification settings
 *     description: Update user's notification preferences for different modules
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotificationSettings'
 *           example:
 *             attendance:
 *               checkInCheckOut: true
 *               lateArrival: true
 *               earlyExit: false
 *             leaves:
 *               application: true
 *               newRequest: true
 *               approval: true
 *               rejection: true
 *             announcements:
 *               newAnnouncement: true
 *               mentions: true
 *               likes: false
 *               comments: true
 *             reminders:
 *               birthdays: true
 *               anniversaries: true
 *               newHiring: true
 *             payroll:
 *               payslipGenerated: true
 *               paymentProcessed: true
 *     responses:
 *       200:
 *         description: Notification settings updated successfully
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
 *                   example: Notification settings updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put('/notifications', validate(SettingsValidation.updateNotifications), SettingsController.updateNotifications);

/**
 * @swagger
 * /settings/designations:
 *   get:
 *     summary: Get all designations/roles
 *     description: Retrieve all designations for the organization
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Designations retrieved successfully
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
 *                   example: Designations retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Designation'
 */
router.get('/designations', SettingsController.getDesignations);

/**
 * @swagger
 * /settings/designations/{id}:
 *   get:
 *     summary: Get designation by ID
 *     description: Retrieve a specific designation by its ID
 *     tags: [Settings]
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
 *         description: Designation retrieved successfully
 *       404:
 *         description: Designation not found
 */
router.get('/designations/:id', SettingsController.getDesignationById);

/**
 * @swagger
 * /settings/designations:
 *   post:
 *     summary: Create new designation/role
 *     description: Create a new designation with hierarchy level
 *     tags: [Settings]
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
 *               - code
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Chief Executive Officer"
 *               code:
 *                 type: string
 *                 example: "CEO"
 *               description:
 *                 type: string
 *                 example: "Top leadership position"
 *               level:
 *                 type: number
 *                 example: 1
 *               parentDesignation:
 *                 type: string
 *                 example: null
 *                 description: Parent designation ID (if any)
 *     responses:
 *       201:
 *         description: Designation created successfully
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
 *                   example: Designation created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Designation'
 *       400:
 *         description: Designation with this code already exists
 */
router.post('/designations', validate(SettingsValidation.createDesignation), SettingsController.createDesignation);

/**
 * @swagger
 * /settings/designations/{id}:
 *   put:
 *     summary: Update designation
 *     description: Update an existing designation
 *     tags: [Settings]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               level:
 *                 type: number
 *     responses:
 *       200:
 *         description: Designation updated successfully
 */
router.put('/designations/:id', SettingsController.updateDesignation);

/**
 * @swagger
 * /settings/designations/{id}:
 *   delete:
 *     summary: Delete designation
 *     description: Soft delete a designation (marks as inactive)
 *     tags: [Settings]
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
 *         description: Designation deleted successfully
 */
router.delete('/designations/:id', SettingsController.deleteDesignation);

/**
 * @swagger
 * /settings/change-password:
 *   post:
 *     summary: Change password
 *     description: Change current user's password
 *     tags: [Settings]
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
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: "OldPassword123!"
 *                 description: Current password (minimum 8 characters)
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "NewPassword123!"
 *                 description: New password (minimum 8 characters)
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: "NewPassword123!"
 *                 description: Confirm new password (must match newPassword)
 *     responses:
 *       200:
 *         description: Password changed successfully
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
 *                   example: Password changed successfully
 *       400:
 *         description: Validation error or passwords do not match
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Current password is incorrect
 *       401:
 *         description: Unauthorized
 */
// Change Password
router.post('/change-password', validate(SettingsValidation.changePassword), SettingsController.changePassword);

// Security Settings
router.get('/security', SettingsController.getSecuritySettings);
router.put('/security', authorize(USER_ROLES.SUPER_ADMIN as any), validate(SettingsValidation.updateSecurity), SettingsController.updateSecuritySettings);

export default router;