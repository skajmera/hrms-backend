import { payrollDAL } from '../../../../shared/dal/payroll.dal';

export class EmployeePayrollService {
  /**
   * Get own payslips
   */
  async getMyPayslips(userId: string, limit: number = 12) {
    return await payrollDAL.getUserPayrollHistory(userId, limit);
  }

  /**
   * Get specific payslip
   */
  async getMyPayslip(userId: string, payrollId: string) {
    const payroll = await payrollDAL.findById(payrollId);
    
    if (!payroll) {
      throw new Error('Payslip not found');
    }

    if (payroll.userId.toString() !== userId) {
      throw new Error('Unauthorized to access this payslip');
    }

    return payroll;
  }
}

export const employeePayrollService = new EmployeePayrollService();