"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.departmentController = exports.DepartmentController = void 0;
const department_service_1 = require("./department.service");
const response_1 = require("../../../../shared/utils/response");
const constants_1 = require("../../../../config/constants");
const buildHierarchy_1 = require("../../../../shared/utils/buildHierarchy");
class DepartmentController {
    async createDepartment(req, res, next) {
        try {
            const department = await department_service_1.departmentService.createDepartment({ ...req.body, createdBy: req.user._id });
            (0, response_1.sendSuccessResponse)(res, 'Department created successfully', department, constants_1.HTTP_STATUS.CREATED);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
    async getDepartmentById(req, res, next) {
        try {
            const department = await department_service_1.departmentService.getDepartmentById(req.params.id);
            (0, response_1.sendSuccessResponse)(res, 'Department retrieved successfully', department);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.NOT_FOUND);
        }
    }
    async getAllDepartments(req, res, next) {
        try {
            const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc', ...filters } = req.query;
            const result = await department_service_1.departmentService.getAllDepartments(filters, { page: Number(page), limit: Number(limit), sortBy: sortBy, sortOrder: sortOrder });
            (0, response_1.sendPaginatedResponse)(res, result.departments, result.total, Number(page), Number(limit), 'Departments retrieved successfully');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async updateDepartment(req, res, next) {
        try {
            const department = await department_service_1.departmentService.updateDepartment(req.params.id, req.body);
            (0, response_1.sendSuccessResponse)(res, 'Department updated successfully', department);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
    async deleteDepartment(req, res, next) {
        try {
            await department_service_1.departmentService.deleteDepartment(req.params.id);
            (0, response_1.sendSuccessResponse)(res, 'Department deleted successfully');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.NOT_FOUND);
        }
    }
    async getDepartmentTree(req, res, next) {
        try {
            const tree = await department_service_1.departmentService.getDepartmentTree();
            // const hierarchy = buildHierarchy(tree);
            (0, response_1.sendSuccessResponse)(res, 'Department tree retrieved successfully', tree);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    async getDepartmentHierarchy(req, res, next) {
        try {
            console.log("Fetching department hierarchy...");
            const tree = await department_service_1.departmentService.getDepartmentHierarchy();
            const hierarchy = (0, buildHierarchy_1.buildHierarchy)(tree);
            (0, response_1.sendSuccessResponse)(res, 'Department tree retrieved successfully', hierarchy);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
}
exports.DepartmentController = DepartmentController;
exports.departmentController = new DepartmentController();
//# sourceMappingURL=department.controller.js.map