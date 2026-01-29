import { DepartmentModel } from '../models/department.model';
import { IDepartment, IDepartmentCreateInput, IDepartmentTree } from '../interfaces/department.interface';
import { IQueryFilters, IPaginationOptions } from '../interfaces/common.interface';

export class DepartmentDAL {
    /**
     * Create department
     */
    async create(departmentData: IDepartmentCreateInput & { createdBy: string }): Promise<IDepartment> {
        return await DepartmentModel.create(departmentData);
    }

    /**
     * Find department by ID
     */
    async findById(id: string): Promise<IDepartment | null> {
        return await DepartmentModel.findById(id)
            .populate('parentDepartment', 'name code')
            .populate('headOfDepartment', 'firstName lastName email')
            .populate('employees', 'firstName lastName email professionalDetails.employeeId')
            .populate('createdBy', 'firstName lastName');
    }

    /**
     * Find all departments
     */
    async findAll(
        filters: IQueryFilters = {},
        options: IPaginationOptions = {}
    ): Promise<{ departments: IDepartment[]; total: number }> {
        const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc' } = options;
        const skip = (page - 1) * limit;

        const departments = await DepartmentModel.find(filters)
            .populate('parentDepartment', 'name code')
            .populate('headOfDepartment', 'firstName lastName email')
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit);

        const total = await DepartmentModel.countDocuments(filters);

        return { departments, total };
    }

    /**
     * Update department
     */
    async update(id: string, updateData: Partial<IDepartment>): Promise<IDepartment | null> {
        return await DepartmentModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        )
            .populate('parentDepartment', 'name code')
            .populate('headOfDepartment', 'firstName lastName email');
    }

    /**
     * Delete department
     */
    async delete(id: string): Promise<IDepartment | null> {
        return await DepartmentModel.findByIdAndUpdate(
            id,
            { $set: { isActive: false } },
            { new: true }
        );
    }

    /**
     * Hard delete department
     */
    async hardDelete(id: string): Promise<IDepartment | null> {
        return await DepartmentModel.findByIdAndDelete(id);
    }/**
    
    Find department by code
    */
    async findByCode(code: string): Promise<IDepartment | null> {
        return await DepartmentModel.findOne({ code });
    }
    /**
    
    Get department hierarchy tree
    */
    async getDepartmentTree(): Promise<IDepartmentTree[]> {
        const departments = await DepartmentModel.find({ isActive: true })
            .populate('headOfDepartment', 'firstName lastName email')
            .sort({ level: 1, name: 1 });
        const buildTree = (parentId: string | null = null): IDepartmentTree[] => {
            return departments
                .filter(dept => {
                    const parent = dept.parentDepartment?.toString() || null;
                    return parent === parentId;
                })
                .map(dept => ({
                    _id: dept._id.toString(),
                    name: dept.name,
                    code: dept.code,
                    headOfDepartment: dept.headOfDepartment,
                    employeeCount: dept.employeeCount,
                    children: buildTree(dept._id.toString())
                }));
        };

        return buildTree(null);
    }
    /**
    
    Get all subdepartments
    */
    async getSubDepartments(parentId: string): Promise<IDepartment[]> {
        return await DepartmentModel.find({ parentDepartment: parentId, isActive: true })
            .populate('headOfDepartment', 'firstName lastName email');
    }

    /**
    
    Add employee to department
    */
    async addEmployee(departmentId: string, userId: string): Promise<IDepartment | null> {
        return await DepartmentModel.findByIdAndUpdate(
            departmentId,
            { $addToSet: { employees: userId } },
            { new: true }
        );
    }

    /**
    
    Remove employee from department
    */
    async removeEmployee(departmentId: string, userId: string): Promise<IDepartment | null> {
        return await DepartmentModel.findByIdAndUpdate(
            departmentId,
            { $pull: { employees: userId } },
            { new: true }
        );
    }

    /**
    
    Get department statistics
    */
    async getDepartmentStats(): Promise<any> {
        return await DepartmentModel.aggregate([
          {
            $match: { isActive: true }
          },
          {
            $group: {
              _id: null,
            totalDepartments: { $sum: 1 },
            totalEmployees: { $sum: "$employeeCount" },
            avgEmployeesPerDept: { $avg: "$employeeCount" }
            }
          }
        ]);
      }
    }
    
    
    export const departmentDAL = new DepartmentDAL();