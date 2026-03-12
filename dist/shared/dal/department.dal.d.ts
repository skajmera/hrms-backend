import { IDepartment, IDepartmentCreateInput, IDepartmentTree } from '../interfaces/department.interface';
import { IQueryFilters, IPaginationOptions } from '../interfaces/common.interface';
export declare class DepartmentDAL {
    /**
     * Create department
     */
    create(departmentData: IDepartmentCreateInput & {
        createdBy: string;
    }): Promise<IDepartment>;
    /**
     * Find department by ID
     */
    findById(id: string): Promise<IDepartment | null>;
    /**
     * Find all departments
     */
    findAll(filters?: IQueryFilters, options?: IPaginationOptions): Promise<{
        departments: IDepartment[];
        total: number;
    }>;
    /**
     * Update department
     */
    update(id: string, updateData: Partial<IDepartment>): Promise<IDepartment | null>;
    /**
     * Delete department
     */
    delete(id: string): Promise<IDepartment | null>;
    /**
     * Hard delete department
     */
    hardDelete(id: string): Promise<IDepartment | null>; /**
      
      Find department by code
      */
    findByCode(code: string): Promise<IDepartment | null>;
    /**
    
    Get department hierarchy tree
    */
    getDepartmentTree(): Promise<IDepartmentTree[]>;
    getHierarchyRaw(): Promise<any[]>;
    /**
    
    Get all subdepartments
    */
    getSubDepartments(parentId: string): Promise<IDepartment[]>;
    /**
    
    Add employee to department
    */
    addEmployee(departmentId: string, userId: string): Promise<IDepartment | null>;
    /**
    
    Remove employee from department
    */
    removeEmployee(departmentId: string, userId: string): Promise<IDepartment | null>;
    /**
    
    Get department statistics
    */
    getDepartmentStats(): Promise<any>;
    /**
  * Sync employees in department
  * Called when user department changes
  */
    syncEmployees(departmentId: string): Promise<void>;
    /**
     * Get all employees in department and sub-departments
     */
    getAllEmployeesRecursive(departmentId: string): Promise<string[]>;
}
export declare const departmentDAL: DepartmentDAL;
//# sourceMappingURL=department.dal.d.ts.map