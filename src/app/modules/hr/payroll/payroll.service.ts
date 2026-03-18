// import { payrollDAL } from '../../../../shared/dal/payroll.dal';
// import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';

// import { userDAL } from '../../../../shared/dal/user.dal';
// export class PayrollService {
//   async generatePayroll(payrollData: any) {
//     // Check if payroll already exists
//     const existing = await payrollDAL.findByUserMonthYear(payrollData.userId, payrollData.month, payrollData.year);
//     if (existing) {
//       throw new Error('Payroll already generated for this month');
//     }

//     return await payrollDAL.create(payrollData);
//   }

//   async getPayrollById(id: string) {
//     const payroll = await payrollDAL.findById(id);
//     if (!payroll) {
//       throw new Error('Payroll record not found');
//     }
//     return payroll;
//   }

//   async getAllPayroll(filters: any, options: IPaginationOptions) {
//     return await payrollDAL.findAll(filters, options);
//   }

//   async getUserPayrollHistory(userId: string, limit: number = 12) {
//     return await payrollDAL.getUserPayrollHistory(userId, limit);
//   }

//   async getPayrollByMonthYear(month: number, year: number) {
//     return await payrollDAL.findByMonthYear(month, year);
//   }

//   async getPayrollStats(month: number, year: number) {
//     return await payrollDAL.getPayrollStats(month, year);
//   }

//   async markAsPaid(id: string, paymentDetails: any) {
//     const payroll = await payrollDAL.markAsPaid(id, paymentDetails);
//     if (!payroll) {
//       throw new Error('Payroll record not found');
//     }
//     return payroll;
//   }

//   /**
//    * Download payslip
//    */
//   async downloadPayslip(payrollId: string): Promise<string> {
//     const payroll = await payrollDAL.findById(payrollId);

//     if (!payroll) {
//       throw new Error('Payroll not found');
//     }

//     if (!payroll.payslipPath) {
//       // Generate PDF if not exists
//       const user = await userDAL.findById(payroll.userId.toString());
//       if (!user) {
//         throw new Error('User not found');
//       }

//       const pdfPath = await PDFGenerator.generateSalarySlip({ payroll, user });
//       payroll.payslipPath = pdfPath;
//       await payroll.save();

//       return pdfPath;
//     }

//     return payroll.payslipPath;
//   }

//   /**
//    * Regenerate payslip
//    */
//   async regeneratePayslip(payrollId: string): Promise<string> {
//     const payroll = await payrollDAL.findById(payrollId);

//     if (!payroll) {
//       throw new Error('Payroll not found');
//     }

//     const user = await userDAL.findById(payroll.userId.toString());
//     if (!user) {
//       throw new Error('User not found');
//     }

//     const pdfPath = await PDFGenerator.generateSalarySlip({ payroll, user });
//     payroll.payslipPath = pdfPath;
//     await payroll.save();

//     return pdfPath;
//   }

//   /**
//    * Bulk generate payroll for all employees
//    */
//   async bulkGeneratePayroll(month: number, year: number, departmentId?: string) {
//     // Get all active users
//     const filters: any = { isActive: true };
//     if (departmentId) {
//       filters['professionalDetails.department'] = departmentId;
//     }

//     const users = await userDAL.findAll(filters, { limit: 1000 });

//     const payrollPromises = users.users.map(async (user) => {
//       try {
//         // Check if already exists
//         const existing = await payrollDAL.findByUserMonthYear(user._id.toString(), month, year);
//         if (existing) {
//           return { success: false, user: user.email, error: 'Already exists' };
//         }

//         // Calculate salary (you can customize this logic)
//         const salaryComponents = user.professionalDetails.salaryDetails || {
//           basic: 30000,
//           hra: 12000,
//           allowances: { transport: 2000, medical: 1500, special: 3000, foodAllowance: 1500, other: 0 },
//           deductions: { providentFund: 3600, professionalTax: 200, incomeTax: 5000, esi: 0, loanDeduction: 0, other: 0 }
//         };

//         const payrollData = {
//           userId: user._id.toString(),
//           employeeId: user.professionalDetails.employeeId,
//           month,
//           year,
//           salaryComponents,
//           workingDays: 22,
//           presentDays: 22, // You should calculate from attendance
//           absentDays: 0,
//           paidLeaveDays: 0,
//           unpaidLeaveDays: 0,
//           generatedBy: 'system' // You should pass actual admin ID
//         };

//         const payroll = await this.generatePayroll(payrollData);

//         return { success: true, user: user.email, payrollId: payroll._id };
//       } catch (error: any) {
//         return { success: false, user: user.email, error: error.message };
//       }
//     });

//     const results = await Promise.allSettled(payrollPromises);

//     return results.map(result => result.status === 'fulfilled' ? result.value : { success: false, error: 'Failed' });
//   }
// }

// export const payrollService = new PayrollService();
import { payrollDAL } from '../../../../shared/dal/payroll.dal';
// import { UserDAL } from '../../../../shared/dal/user.dal';
import { userDAL } from '../../../../shared/dal/user.dal';

import { attendanceDAL } from '../../../../shared/dal/attendance.dal';
import { leaveDAL } from '../../../../shared/dal/leave.dal';
import { IPayroll } from '../../../../shared/interfaces/payroll.interface';
import { notificationsService } from '../../notifications/notifications.service';
import { NotificationType } from '../../../../shared/interfaces/notification.interface';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';
import { PAYMENT_STATUS } from '../../../../config/constants';
import { PDFGenerator } from '../../../../shared/utils/pdfGenerator';
/**
 * Payroll Service
 * Business logic for payroll operations
 */

export class PayrollService {
  /**
   * Create payroll with all calculations
   */
  static async createPayroll(payrollData: Partial<IPayroll>, generatedBy: string): Promise<IPayroll> {
    // Get user details
    const user = await userDAL.findById(payrollData.userId as string);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if payroll already exists for this month/year
    const existingPayroll = await payrollDAL.findByUserAndPeriod(
      payrollData.userId as string,
      payrollData.month!,
      payrollData.year!
    );

    if (existingPayroll) {
      throw new Error('Payroll already exists for this period');
    }

    // Get attendance data for the month
    const attendanceReport = await attendanceDAL.getMonthlyReport(
      payrollData.userId as string,
      payrollData.month!,
      payrollData.year!
    );

    // Calculate days
    const workingDays = payrollData.workingDays || 30;
    const presentDays = attendanceReport.presentDays + attendanceReport.wfhDays;
    const absentDays = attendanceReport.absentDays;

    // Get LOP (Leave without pay) days
    const startDate = new Date(payrollData.year!, payrollData.month! - 1, 1);
    const endDate = new Date(payrollData.year!, payrollData.month!, 0);
    const leaves = await leaveDAL.findByDateRange(startDate, endDate);
    const unpaidLeaveDays = leaves.filter(l => l.leaveType === 'UNPAID').reduce((sum, l) => sum + l.numberOfDays, 0);

    // Get late arrival count
    const lateArrivals = await attendanceDAL.getLateArrivalsCount(
      payrollData.userId as string,
      payrollData.month!,
      payrollData.year!
    );

    // Complete payroll data
    const completePayrollData: Partial<IPayroll> = {
      ...payrollData,
      employeeId: user.professionalDetails.employeeId,
      workingDays,
      presentDays,
      absentDays,
      unpaidLeaveDays,
      generatedBy,
      isDraft: false,
      isGenerated: false,
      isPending: true,
      paymentStatus: PAYMENT_STATUS.PENDING
    };

    // Calculate deductions for late arrivals
    if (lateArrivals > 0 && completePayrollData.salaryComponents) {
      const perDaySalary = (completePayrollData.salaryComponents.basic || 0) / workingDays;
      completePayrollData.salaryComponents.deductions.lateArrivalDeductions = lateArrivals * (perDaySalary * 0.1); // 10% of per day salary
    }

    // Calculate LOP deduction
    if (unpaidLeaveDays > 0 && completePayrollData.salaryComponents) {
      const perDaySalary = (completePayrollData.salaryComponents.basic || 0) / workingDays;
      completePayrollData.salaryComponents.deductions.leaveWithoutPay = unpaidLeaveDays * perDaySalary;
    }

    const payroll = await payrollDAL.create(completePayrollData);
    return payroll;
  }

  /**
   * Get payroll by ID
   */
  static async getPayrollById(payrollId: string): Promise<IPayroll> {
    const payroll = await payrollDAL.findById(payrollId);
    if (!payroll) {
      throw new Error('Payroll not found');
    }
    return payroll;
  }

  /**
   * Get all payrolls with filters
   */
  static async getAllPayrolls(filters: any = {}, options: IPaginationOptions) {
    return await payrollDAL.findAll(filters, options);
  }

  /**
   * Update payroll
   */
  static async updatePayroll(payrollId: string, updateData: Partial<IPayroll>): Promise<IPayroll> {
    const payroll = await payrollDAL.update(payrollId, updateData);
    if (!payroll) {
      throw new Error('Payroll not found');
    }
    return payroll;
  }

  /**
   * Delete payroll
   */
  static async deletePayroll(payrollId: string): Promise<void> {
    const payroll = await payrollDAL.delete(payrollId);
    if (!payroll) {
      throw new Error('Payroll not found');
    }
  }

  /**
   * Generate payslip (move from draft to generated)
   */
  static async generatePayslip(payrollId: string, approvedBy: string): Promise<IPayroll> {
    const payroll = await this.getPayrollById(payrollId);

    if (payroll.isGenerated) throw new Error('Payroll is already generated');

    const updateData: Partial<IPayroll> = {
      isDraft: false,
      isGenerated: true,
      isPending: false, // Mutual exclusivity with generated
      approvedBy,
      approvedAt: new Date()
    };

    const updatedPayroll = await payrollDAL.updateById(payrollId, updateData);

    // --- TRIGGER NOTIFICATION ---
    try {
      await notificationsService.sendNotification({
        userId: payroll.userId.toString(),
        type: NotificationType.PAYROLL_GENERATED,
        title: 'Payslip Generated',
        message: `Your payslip for ${payroll.month}/${payroll.year} has been generated. You can now view and download it.`,
        targetApp: 'EMPLOYEE',
        data: { payrollId: updatedPayroll._id }
      });
    } catch (error) {
      console.error('[PayrollService] Failed to send payroll notification:', error);
    }

    return updatedPayroll;
  }

  /**
   * Mark payroll as paid
   */
  static async markAsPaid(
    payrollId: string,
    paymentDetails: {
      paymentMode: 'BANK_TRANSFER' | 'CASH' | 'CHEQUE';
      transactionId?: string;
      bankName?: string;
      accountNumber?: string;
    }
  ): Promise<IPayroll> {
    const updateData: Partial<IPayroll> = {
      paymentStatus: PAYMENT_STATUS.PAID,
      paymentDate: new Date(),
      isPending: false,
      ...paymentDetails
    };

    const payroll = await payrollDAL.update(payrollId, updateData);
    if (!payroll) {
      throw new Error('Payroll not found');
    }
    return payroll;
  }

  /**
   * Get payroll statistics for dashboard
   */
  static async getPayrollStats(month: number, year: number) {
    const stats = await payrollDAL.getPayrollStatsDashboard(month, year);

    // Calculate percentage changes (mock for now - you can implement actual comparison)
    const percentageChange = stats.totalEmployees > 0 ? 3 : 0;

    return {
      totalPayroll: stats.totalPayroll || 0,
      paidEmployees: stats.paidEmployees || 0,
      pendingPayments: stats.pendingPayments || 0,
      averageSalary: Math.round(stats.averageSalary || 0),
      totalEmployees: stats.totalEmployees || 0,
      percentageChange,
      paidPercentage: stats.totalEmployees > 0
        ? Math.round((stats.paidEmployees / stats.totalEmployees) * 100)
        : 0
    };
  }

  /**
   * Get drafts
   */
  static async getDrafts(month?: number, year?: number) {
    return await payrollDAL.getDrafts(month, year);
  }

  /**
   * Get pending payrolls
   */
  static async getPending(month?: number, year?: number) {
    return await payrollDAL.getPending(month, year);
  }

  /**
   * Bulk generate payrolls for multiple employees
   */
  static async bulkGeneratePayrolls(
    userIds: string[],
    month: number,
    year: number,
    generatedBy: string
  ): Promise<IPayroll[]> {
    const payrolls: IPayroll[] = [];

    for (const userId of userIds) {
      try {
        const user = await userDAL.findById(userId);
        if (!user) continue;

        const salaryDetails = user.professionalDetails.salaryDetails;
        if (!salaryDetails) continue;

        const payrollData: Partial<IPayroll> = {
          userId,
          month,
          year,
          salaryComponents: {
            basic: salaryDetails.basic,
            hra: salaryDetails.hra,
            allowances: salaryDetails.allowances,
            deductions: salaryDetails.deductions,
            customEarnings: [],
            customDeductions: []
          },
          workingDays: 30,
          presentDays: 0
        };

        const payroll = await this.createPayroll(payrollData, generatedBy);
        payrolls.push(payroll);
      } catch (error) {
        console.error(`Error generating payroll for user ${userId}:`, error);
      }
    }

    return payrolls;
  }

  /**
   * Revise payroll
   */
  static async revisePayroll(
    payrollId: string,
    revisionData: Partial<IPayroll>,
    revisionReason: string
  ): Promise<IPayroll> {
    const updateData: Partial<IPayroll> = {
      ...revisionData,
      isRevised: true,
      revisionDate: new Date(),
      revisionReason,
      isDraft: false,
      isGenerated: false,
      isPending: true
    };

    const payroll = await payrollDAL.update(payrollId, updateData);
    if (!payroll) {
      throw new Error('Payroll not found');
    }
    return payroll;
  }

  /**
   * Get payroll by user and period
   */
  static async getPayrollByUserAndPeriod(userId: string, month: number, year: number): Promise<IPayroll | null> {
    return await payrollDAL.findByUserAndPeriod(userId, month, year);
  }

  /**
   * Download payslip (generate PDF)
   */
  // static async downloadPayslip(payrollId: string): Promise<string> {
  //   const payroll = await this.getPayrollById(payrollId);

  //   if (payroll.isDraft) {
  //     throw new Error('Cannot download payslip for draft payroll');
  //   }

  //   // Here you would implement PDF generation
  //   // For now, returning a mock path
  //   return `/payslips/${payrollId}.pdf`;
  // }

  /**
   * Download payslip
   */
  static async downloadPayslip(payrollId: string): Promise<string> {
    const payroll = await payrollDAL.findById(payrollId);

    if (!payroll) {
      throw new Error('Payroll not found');
    }

    if (!payroll.payslipPath) {
      // Generate PDF if not exists
      const uid = (payroll.userId as any)?._id?.toString?.() ?? (payroll.userId as any)?.toString?.();
      if (!uid) throw new Error('Payroll userId missing');
      const user = await userDAL.findById(uid);
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


  static async getUserPayrollHistory(userId: string, limit: number = 12) {
    return await payrollDAL.getUserPayrollHistory(userId, limit);
  }
}