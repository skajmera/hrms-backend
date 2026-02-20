"use strict";
// import { Router } from 'express';
// import { departmentController } from './department.controller';
// import { authenticate, authorize } from '../../../../shared/middlewares/auth.middleware';
// import { validate } from '../../../../shared/middlewares/validation';
// import { USER_ROLES } from '../../../../config/constants';
// import { createDepartmentValidation } from './department.validation';
Object.defineProperty(exports, "__esModule", { value: true });
// const router = Router();
// router.use(authenticate);
// router.get('/', departmentController.getAllDepartments.bind(departmentController));
// router.get('/tree', departmentController.getDepartmentTree.bind(departmentController));
// router.get('/:id', departmentController.getDepartmentById.bind(departmentController));
// router.post('/', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), validate(createDepartmentValidation), departmentController.createDepartment.bind(departmentController));
// router.put('/:id', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), departmentController.updateDepartment.bind(departmentController));
// router.delete('/:id', authorize(USER_ROLES.SUPER_ADMIN), departmentController.deleteDepartment.bind(departmentController));
// export default router;
const express_1 = require("express");
const department_controller_1 = require("./department.controller");
const auth_middleware_1 = require("../../../../shared/middlewares/auth.middleware");
const validation_1 = require("../../../../shared/middlewares/validation");
const constants_1 = require("../../../../config/constants");
const department_validation_1 = require("./department.validation");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * /hr/departments:
 *   get:
 *     summary: Get all departments with pagination
 *     tags: [Departments]
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
 *         description: Items per page
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: name
 *         description: Sort by field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *     responses:
 *       200:
 *         description: Departments retrieved successfully
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
 *                             $ref: '#/components/schemas/Department'
 */
router.get('/', department_controller_1.departmentController.getAllDepartments.bind(department_controller_1.departmentController));
/**
 * @swagger
 * /hr/departments/tree:
 *   get:
 *     summary: Get department hierarchy tree
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Department tree retrieved successfully
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
 *                       name:
 *                         type: string
 *                       code:
 *                         type: string
 *                       headOfDepartment:
 *                         type: object
 *                       employeeCount:
 *                         type: number
 *                       children:
 *                         type: array
 *                         items:
 *                           type: object
 */
router.get('/tree', department_controller_1.departmentController.getDepartmentTree.bind(department_controller_1.departmentController));
/**
 * @swagger
 * /hr/departments/{id}:
 *   get:
 *     summary: Get department by ID
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Department ID
 *     responses:
 *       200:
 *         description: Department retrieved successfully
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
 *                   $ref: '#/components/schemas/Department'
 *       404:
 *         description: Department not found
 */
router.get('/:id', department_controller_1.departmentController.getDepartmentById.bind(department_controller_1.departmentController));
/**
 * @swagger
 * /hr/departments:
 *   post:
 *     summary: Create new department
 *     tags: [Departments]
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
 *                 example: 'Engineering'
 *               code:
 *                 type: string
 *                 example: 'ENG'
 *               description:
 *                 type: string
 *                 example: 'Engineering Department'
 *               parentDepartment:
 *                 type: string
 *                 example: '697b0744dfffca6e32868866'
 *                 description: Parent department ID (optional)
 *               headOfDepartment:
 *                 type: string
 *                 example: '507f1f77bcf86cd799439012'
 *                 description: User ID of department head
 *               email:
 *                 type: string
 *                 format: email
 *                 example: 'engineering@braininventory.com'
 *               phone:
 *                 type: string
 *                 example: '+919876543210'
 *               location:
 *                 type: string
 *                 example: 'Floor 3, Building A'
 *     responses:
 *       201:
 *         description: Department created successfully
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
 *                   $ref: '#/components/schemas/Department'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Department code already exists
 */
router.post('/', (0, auth_middleware_1.authorize)(constants_1.USER_ROLES.SUPER_ADMIN, constants_1.USER_ROLES.HR_ADMIN), (0, validation_1.validate)(department_validation_1.createDepartmentValidation), department_controller_1.departmentController.createDepartment.bind(department_controller_1.departmentController));
/**
 * @swagger
 * /hr/departments/{id}:
 *   put:
 *     summary: Update department
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Department ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'Engineering'
 *               code:
 *                 type: string
 *                 example: 'ENG'
 *               description:
 *                 type: string
 *                 example: 'Engineering Department'
 *               parentDepartment:
 *                 type: string
 *                 example: '697b0744dfffca6e32868866'
 *                 description: Parent department ID (optional)
 *               headOfDepartment:
 *                 type: string
 *                 example: '507f1f77bcf86cd799439012'
 *                 description: User ID of department head
 *               email:
 *                 type: string
 *                 format: email
 *                 example: 's.ajmera@braininventory.com'
 *               phone:
 *                 type: string
 *                 example: '+919876543210'
 *               location:
 *                 type: string
 *                 example: 'Floor 3, Building A'
 *     responses:
 *       200:
 *         description: Department updated successfully
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
 *                   $ref: '#/components/schemas/Department'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Department not found
 */
router.put('/:id', (0, auth_middleware_1.authorize)(constants_1.USER_ROLES.SUPER_ADMIN, constants_1.USER_ROLES.HR_ADMIN), department_controller_1.departmentController.updateDepartment.bind(department_controller_1.departmentController));
/**
 * @swagger
 * /hr/departments/{id}:
 *   delete:
 *     summary: Delete department
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Department ID
 *     responses:
 *       200:
 *         description: Department deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       404:
 *         description: Department not found
 */
router.delete('/:id', (0, auth_middleware_1.authorize)(constants_1.USER_ROLES.SUPER_ADMIN), department_controller_1.departmentController.deleteDepartment.bind(department_controller_1.departmentController));
/**
 * @swagger
 * /hr/departments/hierarchy:
 *   post:
 *     summary: Get department hierarchy
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Department hierarchy retrieved successfully
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
 *                       name:
 *                         type: string
 *                       code:
 *                         type: string
 *                       headOfDepartment:
 *                         type: object
 *                       employeeCount:
 *                         type: number
 *                       children:
 *                         type: array
 *                         items:
 *                           type: object
 */
router.post('/hierarchy', department_controller_1.departmentController.getDepartmentHierarchy.bind(department_controller_1.departmentController));
exports.default = router;
//# sourceMappingURL=department.route.js.map