// import { Router } from 'express';
// import { leaveController } from './leave.controller';
// import { authenticate, authorize } from '../../../../shared/middlewares/auth.middleware';
// import { validate } from '../../../../shared/middlewares/validation';
// import { USER_ROLES } from '../../../../config/constants';
// import { applyLeaveValidation, approveRejectLeaveValidation } from './leave.validation';

// const router = Router();

// router.use(authenticate);

// router.get('/', leaveController.getAllLeaves.bind(leaveController));
// router.get('/pending', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN, USER_ROLES.MANAGER), leaveController.getPendingLeaves.bind(leaveController));
// router.get('/on-leave-today', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN, USER_ROLES.MANAGER), leaveController.getEmployeesOnLeaveToday.bind(leaveController));
// router.get('/balance/:userId/:year', leaveController.getLeaveBalance.bind(leaveController));
// router.get('/:id', leaveController.getLeaveById.bind(leaveController));
// router.post('/', validate(applyLeaveValidation), leaveController.applyLeave.bind(leaveController));
// router.put('/:id/approve', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN, USER_ROLES.MANAGER), validate(approveRejectLeaveValidation), leaveController.approveLeave.bind(leaveController));
// router.put('/:id/reject', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN, USER_ROLES.MANAGER), validate(approveRejectLeaveValidation), leaveController.rejectLeave.bind(leaveController));

// export default router;

import { Router } from 'express';
import { leaveController } from './leave.controller';
import { authenticate, authorize } from '../../../../shared/middlewares/auth.middleware';
import { validate } from '../../../../shared/middlewares/validation';
import { USER_ROLES } from '../../../../config/constants';
import { applyLeaveValidation, approveRejectLeaveValidation } from './leave.validation';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /hr/leave:
 *   get:
 *     summary: Get all leave requests with pagination
 *     tags: [Leave]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, CANCELLED]
 *         description: Filter by status
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: leaveType
 *         schema:
 *           type: string
 *           enum: [CASUAL, SICK, EARNED, MATERNITY, PATERNITY, UNPAID]
 *         description: Filter by leave type
 *     responses:
 *       200:
 *         description: Leave requests retrieved successfully
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
 *                             $ref: '#/components/schemas/Leave'
 */
router.get('/', leaveController.getAllLeaves.bind(leaveController));

/**
 * @swagger
 * /hr/leave/pending:
 *   get:
 *     summary: Get all pending leave requests
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending leaves retrieved successfully
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
 *                     $ref: '#/components/schemas/Leave'
 */
router.get(
  '/pending',
  authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN, USER_ROLES.MANAGER),
  leaveController.getPendingLeaves.bind(leaveController)
);

/**
 * @swagger
 * /hr/leave/on-leave-today:
 *   get:
 *     summary: Get employees on leave today
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employees on leave today retrieved successfully
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
 *                     $ref: '#/components/schemas/Leave'
 */
router.get(
  '/on-leave-today',
  authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN, USER_ROLES.MANAGER),
  leaveController.getEmployeesOnLeaveToday.bind(leaveController)
);

/**
 * @swagger
 * /hr/leave/balance/{userId}/{year}:
 *   get:
 *     summary: Get leave balance for a user
 *     tags: [Leave]
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
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: Year
 *         example: 2026
 *     responses:
 *       200:
 *         description: Leave balance retrieved successfully
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
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     year:
 *                       type: number
 *                     casualLeave:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: number
 *                         used:
 *                          type: number
 *                        remaining:
 *                          type: number
 *                    sickLeave:
 *                      type: object
 *                     properties:
 *                    total:
 *                      type: number
 *                    used:
 *                     type: number
 *                   remaining:
 *                    type: number
 *                    earnedLeave:
 *                     type: object
 *                    properties:
 *                     total:
 *                      type: number
 *                    used:
 *                    type: number
 *                   remaining:
 *                   type: number
 
                           
*/ 
router.get('/balance/:userId/:year', leaveController.getLeaveBalance.bind(leaveController));

/**

@swagger
/hr/leave/{id}:
get:
summary: Get leave by ID
tags: [Leave]
security:
  - bearerAuth: []
parameters:
  - in: path
    name: id
    required: true
    schema:
      type: string
    description: Leave ID
responses:
  200:
    description: Leave retrieved successfully
    content:
      application/json:
        schema:
          type: object
          properties:
            status:
              type: string
            message:
              type: string
            data:
              $ref: '#/components/schemas/Leave'
  404:
    description: Leave not found
*/ router.get('/:id', leaveController.getLeaveById.bind(leaveController));

/**

@swagger
/hr/leave:
post:
summary: Apply for leave
tags: [Leave]
security:
  - bearerAuth: []
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        required:
          - userId
          - leaveType
          - startDate
          - endDate
          - reason
        properties:
          userId:
            type: string
            example: '697b0744dfffca6e32868866'
          leaveType:
            type: string
            enum: [CASUAL, SICK, EARNED, MATERNITY, PATERNITY, UNPAID]
            example: CASUAL
          startDate:
            type: string
            format: date
            example: '2026-01-20'
          endDate:
            type: string
            format: date
            example: '2026-01-22'
          reason:
            type: string
            example: 'Personal work'
          halfDay:
            type: object
            properties:
              isHalfDay:
                type: boolean
                example: false
              halfDayDate:
                type: string
                format: date
              session:
                type: string
                enum: [FIRST_HALF, SECOND_HALF]
          contactDuringLeave:
            type: string
            example: '+919876543210'
          addressDuringLeave:
            type: string
            example: 'Mumbai, Maharashtra'
responses:
  201:
    description: Leave applied successfully
    content:
      application/json:
        schema:
          type: object
          properties:
            status:
              type: string
            message:
              type: string
            data:
              $ref: '#/components/schemas/Leave'
  400:
    description: Insufficient leave balance or validation error
*/
router.post('/', validate(applyLeaveValidation), leaveController.applyLeave.bind(leaveController));

/**

@swagger
/hr/leave/{id}/approve:
put:
summary: Approve leave request
tags: [Leave]
security:
  - bearerAuth: []
parameters:
  - in: path
    name: id
    required: true
    schema:
      type: string
    description: Leave ID
responses:
  200:
    description: Leave approved successfully
    content:
      application/json:
        schema:
          type: object
          properties:
            status:
              type: string
            message:
              type: string
            data:
              $ref: '#/components/schemas/Leave'
  404:
    description: Leave not found
*/ router.put( '/:id/approve', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN, USER_ROLES.MANAGER), validate(approveRejectLeaveValidation), leaveController.approveLeave.bind(leaveController) );

/**

@swagger
/hr/leave/{id}/reject:
put:
summary: Reject leave request
tags: [Leave]
security:
  - bearerAuth: []
parameters:
  - in: path
    name: id
    required: true
    schema:
      type: string
    description: Leave ID
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        required:
          - rejectionReason
        properties:
          rejectionReason:
            type: string
            example: 'Not enough resources to cover your absence'
responses:
  200:
    description: Leave rejected successfully
  404:
    description: Leave not found
*/ router.put( '/:id/reject', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN, USER_ROLES.MANAGER), validate(approveRejectLeaveValidation), leaveController.rejectLeave.bind(leaveController) );

export default router;