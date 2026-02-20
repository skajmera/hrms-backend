import { IDepartmentCreateInput } from '../../../../shared/interfaces/department.interface';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';
export declare class DepartmentService {
    createDepartment(departmentData: IDepartmentCreateInput & {
        createdBy: string;
    }): Promise<import("../../../../shared/interfaces/department.interface").IDepartment>;
    getDepartmentById(id: string): Promise<import("../../../../shared/interfaces/department.interface").IDepartment>;
    getAllDepartments(filters: any, options: IPaginationOptions): Promise<{
        departments: import("../../../../shared/interfaces/department.interface").IDepartment[];
        total: number;
    }>;
    updateDepartment(id: string, updateData: any): Promise<import("../../../../shared/interfaces/department.interface").IDepartment>;
    deleteDepartment(id: string): Promise<import("../../../../shared/interfaces/department.interface").IDepartment>;
    getDepartmentTree(): Promise<import("../../../../shared/interfaces/department.interface").IDepartmentTree[]>;
    getDepartmentHierarchy(): Promise<any[]>;
    getSubDepartments(parentId: string): Promise<import("../../../../shared/interfaces/department.interface").IDepartment[]>;
}
export declare const departmentService: DepartmentService;
//# sourceMappingURL=department.service.d.ts.map