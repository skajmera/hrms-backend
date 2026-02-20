import { Document, Types } from 'mongoose';
/**
 * Department related interfaces
 */
export interface IDepartment extends Document {
    name: string;
    code: string;
    description?: string;
    active?: boolean;
    parentDepartment?: Types.ObjectId | string;
    level: number;
    path: string;
    headOfDepartment?: Types.ObjectId | string;
    employees: Types.ObjectId[] | string[];
    employeeCount: number;
    email?: string;
    phone?: string;
    location?: string;
    budget?: {
        allocated: number;
        spent: number;
        fiscalYear: number;
    };
    isActive: boolean;
    createdBy: Types.ObjectId | string;
    updatedBy?: Types.ObjectId | string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IDepartmentCreateInput {
    name: string;
    code: string;
    description?: string;
    parentDepartment?: string;
    headOfDepartment?: string;
    email?: string;
    phone?: string;
    location?: string;
}
export interface IDepartmentTree {
    _id: string;
    name: string;
    code: string;
    headOfDepartment?: any;
    employeeCount: number;
    employees?: any[];
    children: IDepartmentTree[];
}
//# sourceMappingURL=department.interface.d.ts.map