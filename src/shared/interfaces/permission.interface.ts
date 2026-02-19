import { Document, Types } from 'mongoose';

/**
 * User Permissions Interface
 */

export interface IModulePermission {
  module: string;
  permissions: {
    view: boolean;
    edit: boolean;
    fullAccess: boolean;
  };
}

export interface IUserPermission extends Document {
  userId: Types.ObjectId | string;
  role: string;
  email: string;
  
  // Module Permissions
  modules: {
    employees: {
      employeesList: { view: boolean; edit: boolean; fullAccess: boolean };
      employeeProfile: { view: boolean; edit: boolean; fullAccess: boolean };
      employeeCareerHistory: { view: boolean; edit: boolean; fullAccess: boolean };
      employeeDepartment: { view: boolean; edit: boolean; fullAccess: boolean };
      employeeAttendance: { view: boolean; edit: boolean; fullAccess: boolean };
      employeeLeave: { view: boolean; edit: boolean; fullAccess: boolean };
      employeePayslip: { view: boolean; edit: boolean; fullAccess: boolean };
    };
    department: {
      fullAccess: boolean;
      view: boolean;
      edit: boolean;
    };
    attendance: {
      fullAccess: boolean;
      view: boolean;
      edit: boolean;
    };
    leaves: {
      fullAccess: boolean;
      view: boolean;
      edit: boolean;
    };
    offboarding: {
      fullAccess: boolean;
      view: boolean;
      edit: boolean;
    };
    payroll: {
      fullAccess: boolean;
      view: boolean;
      edit: boolean;
    };
    announcements: {
      fullAccess: boolean;
      view: boolean;
      edit: boolean;
    };
    usersPermissions: {
      fullAccess: boolean;
      view: boolean;
      edit: boolean;
    };
  };
  
  isActive: boolean;
  invitedBy: Types.ObjectId | string;
  invitedAt: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface IInviteUserInput {
  userId: string;
  email: string;
  role: string;
  modules: IUserPermission['modules'];
}