"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.departmentDAL = exports.DepartmentDAL = void 0;
const department_model_1 = require("../models/department.model");
const user_model_1 = require("../models/user.model");
class DepartmentDAL {
    /**
     * Create department
     */
    async create(departmentData) {
        return await department_model_1.DepartmentModel.create(departmentData);
    }
    /**
     * Find department by ID
     */
    async findById(id) {
        return await department_model_1.DepartmentModel.findById(id)
            .populate('parentDepartment', 'name code')
            .populate('headOfDepartment', 'firstName lastName email')
            .populate('employees', 'firstName lastName email professionalDetails.employeeId')
            .populate('createdBy', 'firstName lastName');
    }
    /**
     * Find all departments
     */
    async findAll(filters = {}, options = {}) {
        const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc' } = options;
        const skip = (page - 1) * limit;
        const departments = await department_model_1.DepartmentModel.find(filters)
            .populate('parentDepartment', 'name code')
            .populate('headOfDepartment', 'firstName lastName email')
            .populate('employees', 'firstName lastName email')
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit);
        const total = await department_model_1.DepartmentModel.countDocuments(filters);
        return { departments, total };
    }
    /**
     * Update department
     */
    async update(id, updateData) {
        return await department_model_1.DepartmentModel.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true })
            .populate('parentDepartment', 'name code')
            .populate('headOfDepartment', 'firstName lastName email');
    }
    /**
     * Delete department
     */
    async delete(id) {
        return await department_model_1.DepartmentModel.findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true });
    }
    /**
     * Hard delete department
     */
    async hardDelete(id) {
        return await department_model_1.DepartmentModel.findByIdAndDelete(id);
    } /**
    
    Find department by code
    */
    async findByCode(code) {
        return await department_model_1.DepartmentModel.findOne({ code });
    }
    /**
    
    Get department hierarchy tree
    */
    async getDepartmentTree() {
        const departments = await department_model_1.DepartmentModel.find({ isActive: true })
            .populate('headOfDepartment', 'firstName lastName email')
            .populate('employees', 'firstName lastName email')
            .sort({ level: 1, name: 1 });
        const buildTree = (parentId = null) => {
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
                employees: dept.employees, //hellloo
                children: buildTree(dept._id.toString())
            }));
        };
        return buildTree(null);
    }
    async getHierarchyRaw() {
        return department_model_1.DepartmentModel.aggregate([
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
    async getSubDepartments(parentId) {
        return await department_model_1.DepartmentModel.find({ parentDepartment: parentId, isActive: true })
            .populate('headOfDepartment', 'firstName lastName email');
    }
    /**
    
    Add employee to department
    */
    async addEmployee(departmentId, userId) {
        return await department_model_1.DepartmentModel.findByIdAndUpdate(departmentId, { $addToSet: { employees: userId } }, { new: true });
    }
    /**
    
    Remove employee from department
    */
    async removeEmployee(departmentId, userId) {
        return await department_model_1.DepartmentModel.findByIdAndUpdate(departmentId, { $pull: { employees: userId } }, { new: true });
    }
    /**
    
    Get department statistics
    */
    async getDepartmentStats() {
        return await department_model_1.DepartmentModel.aggregate([
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
    async syncEmployees(departmentId) {
        const employees = await user_model_1.UserModel.find({
            'professionalDetails.department': departmentId,
            isActive: true
        }).select('_id');
        const employeeIds = employees.map(emp => emp._id);
        await department_model_1.DepartmentModel.findByIdAndUpdate(departmentId, {
            $set: {
                employees: employeeIds,
                employeeCount: employeeIds.length
            }
        });
    }
    /**
     * Get all employees in department and sub-departments
     */
    async getAllEmployeesRecursive(departmentId) {
        const department = await department_model_1.DepartmentModel.findById(departmentId);
        if (!department)
            return [];
        let allEmployees = [...department.employees.map(e => e.toString())];
        const subDepts = await this.getSubDepartments(departmentId);
        for (const subDept of subDepts) {
            const subEmployees = await this.getAllEmployeesRecursive(subDept._id.toString());
            allEmployees = [...allEmployees, ...subEmployees];
        }
        return allEmployees;
    }
}
exports.DepartmentDAL = DepartmentDAL;
exports.departmentDAL = new DepartmentDAL();
//# sourceMappingURL=department.dal.js.map