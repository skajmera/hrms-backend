"use strict";
// import { Router } from 'express';
// import { attendanceController } from './attendance.controller';
// import { authenticate, authorize } from '../../../../shared/middlewares/auth.middleware';
// import { validate } from '../../../../shared/middlewares/validation';
// import { USER_ROLES } from '../../../../config/constants';
// import { markAttendanceValidation, updateAttendanceValidation, getAttendanceValidation } from './attendance.validation';
Object.defineProperty(exports, "__esModule", { value: true });
// const router = Router();
// router.use(authenticate);
// router.get('/', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN, USER_ROLES.MANAGER), validate(getAttendanceValidation), attendanceController.getAllAttendance.bind(attendanceController));
// router.get('/today', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN, USER_ROLES.MANAGER), attendanceController.getTodayAttendance.bind(attendanceController));
// router.get('/report/:userId/:month/:year', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN, USER_ROLES.MANAGER), attendanceController.getUserAttendanceReport.bind(attendanceController));
// router.get('/:id', attendanceController.getAttendanceById.bind(attendanceController));
// router.post('/mark', validate(markAttendanceValidation), attendanceController.markAttendance.bind(attendanceController));
// router.put('/:id', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), validate(updateAttendanceValidation), attendanceController.updateAttendance.bind(attendanceController));
// router.delete('/:id', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), attendanceController.deleteAttendance.bind(attendanceController));
// export default router;
const express_1 = require("express");
const attendance_controller_1 = require("./attendance.controller");
const auth_middleware_1 = require("../../../../shared/middlewares/auth.middleware");
const validation_1 = require("../../../../shared/middlewares/validation");
const constants_1 = require("../../../../config/constants");
const attendance_validation_1 = require("./attendance.validation");
const upload_middleware_1 = require("../../../../shared/middlewares/upload.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * /hr/attendance:
 *   get:
 *     summary: Get all attendance records with pagination
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter from this date
 *         example: '2026-01-01'
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter to this date
 *         example: '2026-01-31'
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PRESENT, ABSENT, HALF_DAY, LATE, WFH, ON_LEAVE]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Attendance records retrieved successfully
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
 *                             $ref: '#/components/schemas/Attendance'
 */
router.get('/', (0, auth_middleware_1.authorize)(constants_1.USER_ROLES.SUPER_ADMIN, constants_1.USER_ROLES.HR_ADMIN, constants_1.USER_ROLES.MANAGER), (0, validation_1.validate)(attendance_validation_1.getAttendanceValidation), attendance_controller_1.attendanceController.getAllAttendance.bind(attendance_controller_1.attendanceController));
/**
 * @swagger
 * /hr/attendance/today:
 *   get:
 *     summary: Get today's attendance for all employees
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Today's attendance retrieved successfully
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
 *                     $ref: '#/components/schemas/Attendance'
 */
router.get('/today', (0, auth_middleware_1.authorize)(constants_1.USER_ROLES.SUPER_ADMIN, constants_1.USER_ROLES.HR_ADMIN, constants_1.USER_ROLES.MANAGER), attendance_controller_1.attendanceController.getTodayAttendance.bind(attendance_controller_1.attendanceController));
/**
 * @swagger
 * /hr/attendance/employee/{userId}/today:
 *   get:
 *     summary: Get today's attendance for a specific employee
 *     tags: [Attendance]
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
 *         description: Today's attendance retrieved successfully
 */
router.get('/employee/:userId/today', (0, auth_middleware_1.authorize)(constants_1.USER_ROLES.SUPER_ADMIN, constants_1.USER_ROLES.HR_ADMIN, constants_1.USER_ROLES.MANAGER), attendance_controller_1.attendanceController.getEmployeeTodayAttendance.bind(attendance_controller_1.attendanceController));
/**
 * @swagger
 * /hr/attendance/report/{userId}/{month}/{year}:
 *   get:
 *     summary: Get attendance report for a user
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Month (1-12)
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: Year
 *         example: 2026
 *     responses:
 *       200:
 *         description: Attendance report retrieved successfully
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
router.get('/report/:userId/:month/:year', (0, auth_middleware_1.authorize)(constants_1.USER_ROLES.SUPER_ADMIN, constants_1.USER_ROLES.HR_ADMIN, constants_1.USER_ROLES.MANAGER), attendance_controller_1.attendanceController.getUserAttendanceReport.bind(attendance_controller_1.attendanceController));
/**
 * @swagger
 * /hr/attendance/{id}:
 *   get:
 *     summary: Get attendance by ID
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Attendance ID
 *     responses:
 *       200:
 *         description: Attendance retrieved successfully
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
 *                   $ref: '#/components/schemas/Attendance'
 *       404:
 *         description: Attendance not found
 */
router.get('/:id', attendance_controller_1.attendanceController.getAttendanceById.bind(attendance_controller_1.attendanceController));
/**
 * @swagger
 * /hr/attendance/register-device:
 *   post:
 *     summary: Register device and face for attendance (One-time setup)
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - deviceId
 *               - selfie
 *             properties:
 *               deviceId:
 *                 type: string
 *                 example: 'UNIQUE_HARDWARE_ID_123'
 *               wifiBSSID:
 *                 type: string
 *               gpsLatitude:
 *                 type: number
 *               gpsLongitude:
 *                 type: number
 *               selfie:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Device and face registered successfully
 */
router.post('/register-device', upload_middleware_1.attendanceUpload.single('selfie'), (0, validation_1.validate)(attendance_validation_1.registerDeviceValidation), attendance_controller_1.attendanceController.registerDevice.bind(attendance_controller_1.attendanceController));
/**
 * @swagger
 * /hr/attendance/mark:
 *   post:
 *     summary: Mark attendance
 *     tags: [Attendance]
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
 *               - date
 *               - status
 *               - shift
 *             properties:
 *               userId:
 *                 type: string
 *                 example: '697b0744dfffca6e32868866'
 *               date:
 *                 type: string
 *                 format: date
 *                 example: '2026-01-15'
 *               status:
 *                 type: string
 *                 enum: [PRESENT, ABSENT, HALF_DAY, LATE, WFH, ON_LEAVE]
 *                 example: PRESENT
 *               shift:
 *                 type: string
 *                 enum: [MORNING, EVENING, NIGHT, FLEXIBLE]
 *                 example: MORNING
 *               checkInTime:
 *                 type: string
 *                 format: date-time
 *                 example: '2026-01-15T09:00:00Z'
 *               checkOutTime:
 *                 type: string
 *                 format: date-time
 *                 example: '2026-01-15T18:00:00Z'
 *               remarks:
 *                 type: string
 *                 example: 'On time'
 *               location:
 *                 type: object
 *                 properties:
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     example: [75.8577, 22.7196]
 *                   address:
 *                     type: string
 *                     example: 'Indore Office'
 *               deviceId:
 *                 type: string
 *               gpsLatitude:
 *                 type: number
 *               gpsLongitude:
 *                 type: number
 *               wifiBSSID:
 *                 type: string
 *               isMockLocation:
 *                 type: boolean
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               date:
 *                 type: string
 *               status:
 *                 type: string
 *               shift:
 *                 type: string
 *               selfie:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Attendance marked successfully
 */
router.post('/mark', upload_middleware_1.attendanceUpload.single('selfie'), (0, validation_1.validate)(attendance_validation_1.markAttendanceValidation), attendance_controller_1.attendanceController.markAttendance.bind(attendance_controller_1.attendanceController));
/**
 * @swagger
 * /hr/attendance/admin/upsert:
 *   post:
 *     summary: Create or update attendance for a user on a specific date (HR override)
 *     tags: [Attendance]
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
 *               - date
 *               - status
 *               - shift
 *             properties:
 *               userId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [PRESENT, ABSENT, HALF_DAY, LATE, WFH, ON_LEAVE]
 *               shift:
 *                 type: string
 *                 enum: [MORNING, EVENING, NIGHT, FLEXIBLE]
 *               checkInTime:
 *                 type: string
 *                 format: date-time
 *               checkOutTime:
 *                 type: string
 *                 format: date-time
 *               remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: Attendance created/updated successfully
 */
router.post('/admin/upsert', (0, auth_middleware_1.authorize)(constants_1.USER_ROLES.SUPER_ADMIN, constants_1.USER_ROLES.HR_ADMIN), (0, validation_1.validate)(attendance_validation_1.adminUpsertAttendanceValidation), attendance_controller_1.attendanceController.upsertAttendanceByAdmin.bind(attendance_controller_1.attendanceController));
/**
 * Cleaner HR URL to update attendance by attendanceId
 * PUT /hr/attendance/update/{attendanceId}
 */
router.put('/update/:id', (0, auth_middleware_1.authorize)(constants_1.USER_ROLES.SUPER_ADMIN, constants_1.USER_ROLES.HR_ADMIN), (0, validation_1.validate)(attendance_validation_1.updateAttendanceValidation), attendance_controller_1.attendanceController.updateAttendance.bind(attendance_controller_1.attendanceController));
/**
 * @swagger
 * /hr/attendance/{id}:
 *   put:
 *     summary: Update attendance
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Attendance ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PRESENT, ABSENT, HALF_DAY, LATE, WFH]
 *               checkInTime:
 *                 type: string
 *                 format: date-time
 *               checkOutTime:
 *                 type: string
 *                 format: date-time
 *               remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: Attendance updated successfully
 *       404:
 *         description: Attendance not found
 */
router.put('/:id', (0, auth_middleware_1.authorize)(constants_1.USER_ROLES.SUPER_ADMIN, constants_1.USER_ROLES.HR_ADMIN), (0, validation_1.validate)(attendance_validation_1.updateAttendanceValidation), attendance_controller_1.attendanceController.updateAttendance.bind(attendance_controller_1.attendanceController));
/**
 * @swagger
 * /hr/attendance/{id}:
 *   delete:
 *     summary: Delete attendance record
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Attendance ID
 *     responses:
 *       200:
 *         description: Attendance deleted successfully
 *       404:
 *         description: Attendance not found
 */
router.delete('/:id', (0, auth_middleware_1.authorize)(constants_1.USER_ROLES.SUPER_ADMIN, constants_1.USER_ROLES.HR_ADMIN), attendance_controller_1.attendanceController.deleteAttendance.bind(attendance_controller_1.attendanceController));
exports.default = router;
//# sourceMappingURL=attendance.route.js.map