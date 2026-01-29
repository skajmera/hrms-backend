import { payrollDAL } from '../../../../shared/dal/payroll.dal';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';

export class PayrollService {
  async generatePayroll(payrollData: any) {
    // Check if payroll already exists
    const existing = await payrollDAL.findByUserMonthYear(payrollData.userId, payrollData.month, payrollData.year);
    if (existing) {
      throw new Error('Payroll already generated for this month');
    }

    return await payrollDAL.create(payrollData);
  }

  async getPayrollById(id: string) {
    const payroll = await payrollDAL.findById(id);
    if (!payroll) {
      throw new Error('Payroll record not found');
    }
    return payroll;
  }

  async getAllPayroll(filters: any, options: IPaginationOptions) {
    return await payrollDAL.findAll(filters, options);
  }

  async getUserPayrollHistory(userId: string, limit: number = 12) {
    return await payrollDAL.getUserPayrollHistory(userId, limit);
  }

  async getPayrollByMonthYear(month: number, year: number) {
    return await payrollDAL.findByMonthYear(month, year);
  }

  async getPayrollStats(month: number, year: number) {
    return await payrollDAL.getPayrollStats(month, year);
  }

  async markAsPaid(id: string, paymentDetails: any) {
    const payroll = await payrollDAL.markAsPaid(id, paymentDetails);
    if (!payroll) {
      throw new Error('Payroll record not found');
    }
    return payroll;
  }
}

export const payrollService = new PayrollService();