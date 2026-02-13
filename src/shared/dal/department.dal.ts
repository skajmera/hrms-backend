import { DepartmentModel } from '../models/department.model';
import { IDepartment, IDepartmentCreateInput, IDepartmentTree } from '../interfaces/department.interface';
import { IQueryFilters, IPaginationOptions } from '../interfaces/common.interface';
import { UserModel } from '../models/user.model';
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
            .populate('employees', 'firstName lastName email')
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
            .populate('employees', 'firstName lastName email')
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
                    employees: dept.employees,//hellloo
                    children: buildTree(dept._id.toString())
                }));
        };

        return buildTree(null);
    }

   async getHierarchyRaw() {
    return DepartmentModel.aggregate([
      {
        $match: { isActive: true }
      },

      // Head of department
      {
        $lookup: {
          from: 'users',
          localField: 'headOfDepartment',
          foreignField: '_id',
          as: 'head'
        }
      },
      { $unwind: { path: '$head', preserveNullAndEmptyArrays: true } },

      // Employees of department
      {
        $lookup: {
          from: 'users',
          localField: 'employees',
          foreignField: '_id',
          as: 'employees'
        }
      },

      {
        $project: {
          _id: 1,
          name: 1,
          code: 1,
          parentDepartment: 1,
          level: 1,
          path: 1,

          head: {
            _id: '$head._id',
            fullName: { $concat: ['$head.firstName', ' ', '$head.lastName'] },
            designation: '$head.professionalDetails.designation'
          },

          employees: {
            $map: {
              input: '$employees',
              as: 'e',
              in: {
                _id: '$$e._id',
                fullName: { $concat: ['$$e.firstName', ' ', '$$e.lastName'] },
                designation: '$$e.professionalDetails.designation',
                reportingManager: '$$e.professionalDetails.reportingManager'
              }
            }
          }
        }
      },

      { $sort: { level: 1 } }
    ]);
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

        /**
   * Sync employees in department
   * Called when user department changes
   */
  async syncEmployees(departmentId: string): Promise<void> {
    const employees = await UserModel.find({
      'professionalDetails.department': departmentId,
      isActive: true
    }).select('_id');

    const employeeIds = employees.map(emp => emp._id);

    await DepartmentModel.findByIdAndUpdate(departmentId, {
      $set: {
        employees: employeeIds,
        employeeCount: employeeIds.length
      }
    });
  }

  /**
   * Get all employees in department and sub-departments
   */
  async getAllEmployeesRecursive(departmentId: string): Promise<string[]> {
    const department = await DepartmentModel.findById(departmentId);
    if (!department) return [];

    let allEmployees = [...department.employees.map(e => e.toString())];

    const subDepts = await this.getSubDepartments(departmentId);
    
    for (const subDept of subDepts) {
      const subEmployees = await this.getAllEmployeesRecursive(subDept._id.toString());
      allEmployees = [...allEmployees, ...subEmployees];
    }

    return allEmployees;
  }
    }
    
    
    export const departmentDAL = new DepartmentDAL();