import { payrollDAL } from '../../../../shared/dal/payroll.dal';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';
import { PDFGenerator } from '../../../../shared/utils/pdfGenerator';
import { userDAL } from '../../../../shared/dal/user.dal';
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
 
  /**
   * Download payslip
   */
  async downloadPayslip(payrollId: string): Promise<string> {
    const payroll = await payrollDAL.findById(payrollId);
    
    if (!payroll) {
      throw new Error('Payroll not found');
    }

    if (!payroll.payslipPath) {
      // Generate PDF if not exists
      const user = await userDAL.findById(payroll.userId.toString());
      if (!user) {
        throw new Error('User not found');
      }

      const pdfPath = await PDFGenerator.generateSalarySlip({ payroll, user });
      payroll.payslipPath = pdfPath;
      await payroll.save();
      
      return pdfPath;
    }

    return payroll.payslipPath;
  }

  /**
   * Regenerate payslip
   */
  async regeneratePayslip(payrollId: string): Promise<string> {
    const payroll = await payrollDAL.findById(payrollId);
    
    if (!payroll) {
      throw new Error('Payroll not found');
    }

    const user = await userDAL.findById(payroll.userId.toString());
    if (!user) {
      throw new Error('User not found');
    }

    const pdfPath = await PDFGenerator.generateSalarySlip({ payroll, user });
    payroll.payslipPath = pdfPath;
    await payroll.save();

    return pdfPath;
  }

  /**
   * Bulk generate payroll for all employees
   */
  async bulkGeneratePayroll(month: number, year: number, departmentId?: string) {
    // Get all active users
    const filters: any = { isActive: true };
    if (departmentId) {
      filters['professionalDetails.department'] = departmentId;
    }

    const users = await userDAL.findAll(filters, { limit: 1000 });
    
    const payrollPromises = users.users.map(async (user) => {
      try {
        // Check if already exists
        const existing = await payrollDAL.findByUserMonthYear(user._id.toString(), month, year);
        if (existing) {
          return { success: false, user: user.email, error: 'Already exists' };
        }

        // Calculate salary (you can customize this logic)
        const salaryComponents = user.professionalDetails.salaryDetails || {
          basic: 30000,
          hra: 12000,
          allowances: { transport: 2000, medical: 1500, special: 3000, foodAllowance: 1500, other: 0 },
          deductions: { providentFund: 3600, professionalTax: 200, incomeTax: 5000, esi: 0, loanDeduction: 0, other: 0 }
        };

        const payrollData = {
          userId: user._id.toString(),
          employeeId: user.professionalDetails.employeeId,
          month,
          year,
          salaryComponents,
          workingDays: 22,
          presentDays: 22, // You should calculate from attendance
          absentDays: 0,
          paidLeaveDays: 0,
          unpaidLeaveDays: 0,
          generatedBy: 'system' // You should pass actual admin ID
        };

        const payroll = await this.generatePayroll(payrollData);
        
        return { success: true, user: user.email, payrollId: payroll._id };
      } catch (error: any) {
        return { success: false, user: user.email, error: error.message };
      }
    });

    const results = await Promise.allSettled(payrollPromises);
    
    return results.map(result => result.status === 'fulfilled' ? result.value : { success: false, error: 'Failed' });
  }
}

export const payrollService = new PayrollService();