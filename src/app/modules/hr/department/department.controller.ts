import { Response, NextFunction } from 'express';
import { departmentService } from './department.service';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
import { sendSuccessResponse, sendErrorResponse, sendPaginatedResponse } from '../../../../shared/utils/response';
import { HTTP_STATUS } from '../../../../config/constants';

export class DepartmentController {
  async createDepartment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const department = await departmentService.createDepartment({ ...req.body, createdBy: req.user._id });
      sendSuccessResponse(res, 'Department created successfully', department, HTTP_STATUS.CREATED);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  async getDepartmentById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const department = await departmentService.getDepartmentById(req.params.id);
      sendSuccessResponse(res, 'Department retrieved successfully', department);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
  }

  async getAllDepartments(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc', ...filters } = req.query;
      const result = await departmentService.getAllDepartments(filters, { page: Number(page), limit: Number(limit), sortBy: sortBy as string, sortOrder: sortOrder as 'asc' | 'desc' });
      sendPaginatedResponse(res, result.departments, result.total, Number(page), Number(limit), 'Departments retrieved successfully');
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }

  async updateDepartment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const department = await departmentService.updateDepartment(req.params.id, req.body);
      sendSuccessResponse(res, 'Department updated successfully', department);
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  async deleteDepartment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await departmentService.deleteDepartment(req.params.id);
      sendSuccessResponse(res, 'Department deleted successfully');
    } catch (error: any) {
      sendErrorResponse(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
  }

  async getDepartmentTree(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tree = await departmentService.getDepartmentTree();
      sendSuccessResponse(res, 'Department tree retrieved successfully', tree);
    } catch (error: any) {
      sendErrorResponse(res, error.message);
    }
  }
}

export const departmentController = new DepartmentController();