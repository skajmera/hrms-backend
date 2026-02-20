import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
export declare class DepartmentController {
    createDepartment(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getDepartmentById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getAllDepartments(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    updateDepartment(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    deleteDepartment(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getDepartmentTree(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getDepartmentHierarchy(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const departmentController: DepartmentController;
//# sourceMappingURL=department.controller.d.ts.map