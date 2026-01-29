
import { departmentDAL } from '../../../../shared/dal/department.dal';
import { IDepartmentCreateInput } from '../../../../shared/interfaces/department.interface';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';

export class DepartmentService {
  async createDepartment(departmentData: IDepartmentCreateInput & { createdBy: string }) {
    const existing = await departmentDAL.findByCode(departmentData.code);
    if (existing) {
      throw new Error('Department code already exists');
    }
    return await departmentDAL.create(departmentData);
  }

  async getDepartmentById(id: string) {
    const department = await departmentDAL.findById(id);
    if (!department) {
      throw new Error('Department not found');
    }
    return department;
  }

  async getAllDepartments(filters: any, options: IPaginationOptions) {
    return await departmentDAL.findAll(filters, options);
  }

  async updateDepartment(id: string, updateData: any) {
    const department = await departmentDAL.update(id, updateData);
    if (!department) {
      throw new Error('Department not found');
    }
    return department;
  }

  async deleteDepartment(id: string) {
    const department = await departmentDAL.delete(id);
    if (!department) {
      throw new Error('Department not found');
    }
    return department;
  }

  async getDepartmentTree() {
    return await departmentDAL.getDepartmentTree();
  }

  async getSubDepartments(parentId: string) {
    return await departmentDAL.getSubDepartments(parentId);
  }
}

export const departmentService = new DepartmentService();
