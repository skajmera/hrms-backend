import { Document, Types } from 'mongoose';

/**
 * Department related interfaces
 */

export interface IDepartment extends Document {
  name: string;
  code: string;
  description?: string;
  active?: boolean;
  // Hierarchy
  parentDepartment?: Types.ObjectId | string;
  level: number;
  path: string; // For easy hierarchy queries
  
  // Leadership
  headOfDepartment?: Types.ObjectId | string;
  
  // Members
  employees: Types.ObjectId[] | string[];
  employeeCount: number;
  
  // Contact
  email?: string;
  phone?: string;
  location?: string;
  
  // Budget (optional)
  budget?: {
    allocated: number;
    spent: number;
    fiscalYear: number;
  };
  
  // Status
  isActive: boolean;
  
  // Metadata
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
  employees?: any[];//hello
  children: IDepartmentTree[];
}