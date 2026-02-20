import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
export declare class EmployeePayrollController {
    getMyPayslips(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getMyPayslip(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const employeePayrollController: EmployeePayrollController;
//# sourceMappingURL=payroll.controller.d.ts.map