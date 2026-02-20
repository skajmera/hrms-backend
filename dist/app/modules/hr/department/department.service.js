"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.departmentService = exports.DepartmentService = void 0;
const department_dal_1 = require("../../../../shared/dal/department.dal");
class DepartmentService {
    async createDepartment(departmentData) {
        const existing = await department_dal_1.departmentDAL.findByCode(departmentData.code);
        if (existing) {
            throw new Error('Department code already exists');
        }
        return await department_dal_1.departmentDAL.create(departmentData);
    }
    async getDepartmentById(id) {
        const department = await department_dal_1.departmentDAL.findById(id);
        if (!department) {
            throw new Error('Department not found');
        }
        return department;
    }
    async getAllDepartments(filters, options) {
        return await department_dal_1.departmentDAL.findAll(filters, options);
    }
    async updateDepartment(id, updateData) {
        const department = await department_dal_1.departmentDAL.update(id, updateData);
        if (!department) {
            throw new Error('Department not found');
        }
        return department;
    }
    async deleteDepartment(id) {
        const department = await department_dal_1.departmentDAL.delete(id);
        if (!department) {
            throw new Error('Department not found');
        }
        return department;
    }
    async getDepartmentTree() {
        return await department_dal_1.departmentDAL.getDepartmentTree();
        // return await departmentDAL.getHierarchyRaw();
    }
    async getDepartmentHierarchy() {
        // return await departmentDAL.getDepartmentTree();
        return await department_dal_1.departmentDAL.getHierarchyRaw();
    }
    async getSubDepartments(parentId) {
        return await department_dal_1.departmentDAL.getSubDepartments(parentId);
    }
}
exports.DepartmentService = DepartmentService;
exports.departmentService = new DepartmentService();
//# sourceMappingURL=department.service.js.map