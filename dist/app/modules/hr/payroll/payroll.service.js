"use strict";
// import { payrollDAL } from '../../../../shared/dal/payroll.dal';
// import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollService = void 0;
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
const payroll_dal_1 = require("../../../../shared/dal/payroll.dal");
// import { UserDAL } from '../../../../shared/dal/user.dal';
const user_dal_1 = require("../../../../shared/dal/user.dal");
const attendance_dal_1 = require("../../../../shared/dal/attendance.dal");
const leave_dal_1 = require("../../../../shared/dal/leave.dal");
const notifications_service_1 = require("../../notifications/notifications.service");
const notification_interface_1 = require("../../../../shared/interfaces/notification.interface");
const constants_1 = require("../../../../config/constants");
const pdfGenerator_1 = require("../../../../shared/utils/pdfGenerator");
/**
 * Payroll Service
 * Business logic for payroll operations
 */
class PayrollService {
    /**
     * Create payroll with all calculations
     */
    static async createPayroll(payrollData, generatedBy) {
        // Get user details
        const user = await user_dal_1.userDAL.findById(payrollData.userId);
        if (!user) {
            throw new Error('User not found');
        }
        // Check if payroll already exists for this month/year
        const existingPayroll = await payroll_dal_1.payrollDAL.findByUserAndPeriod(payrollData.userId, payrollData.month, payrollData.year);
        if (existingPayroll) {
            throw new Error('Payroll already exists for this period');
        }
        // Get attendance data for the month
        const attendanceReport = await attendance_dal_1.attendanceDAL.getMonthlyReport(payrollData.userId, payrollData.month, payrollData.year);
        // Calculate days
        const workingDays = payrollData.workingDays || 30;
        const presentDays = attendanceReport.presentDays + attendanceReport.wfhDays;
        const absentDays = attendanceReport.absentDays;
        // Get LOP (Leave without pay) days
        const startDate = new Date(payrollData.year, payrollData.month - 1, 1);
        const endDate = new Date(payrollData.year, payrollData.month, 0);
        const leaves = await leave_dal_1.leaveDAL.findByDateRange(startDate, endDate);
        const unpaidLeaveDays = leaves.filter(l => l.leaveType === 'UNPAID').reduce((sum, l) => sum + l.numberOfDays, 0);
        // Get late arrival count
        const lateArrivals = await attendance_dal_1.attendanceDAL.getLateArrivalsCount(payrollData.userId, payrollData.month, payrollData.year);
        // Complete payroll data
        const completePayrollData = {
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
            paymentStatus: constants_1.PAYMENT_STATUS.PENDING
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
        const payroll = await payroll_dal_1.payrollDAL.create(completePayrollData);
        return payroll;
    }
    /**
     * Get payroll by ID
     */
    static async getPayrollById(payrollId) {
        const payroll = await payroll_dal_1.payrollDAL.findById(payrollId);
        if (!payroll) {
            throw new Error('Payroll not found');
        }
        return payroll;
    }
    /**
     * Get all payrolls with filters
     */
    static async getAllPayrolls(filters = {}, options) {
        return await payroll_dal_1.payrollDAL.findAll(filters, options);
    }
    /**
     * Update payroll
     */
    static async updatePayroll(payrollId, updateData) {
        const payroll = await payroll_dal_1.payrollDAL.update(payrollId, updateData);
        if (!payroll) {
            throw new Error('Payroll not found');
        }
        return payroll;
    }
    /**
     * Delete payroll
     */
    static async deletePayroll(payrollId) {
        const payroll = await payroll_dal_1.payrollDAL.delete(payrollId);
        if (!payroll) {
            throw new Error('Payroll not found');
        }
    }
    /**
     * Generate payslip (move from draft to generated)
     */
    static async generatePayslip(payrollId, approvedBy) {
        const payroll = await this.getPayrollById(payrollId);
        if (payroll.isGenerated)
            throw new Error('Payroll is already generated');
        const updateData = {
            isDraft: false,
            isGenerated: true,
            isPending: false, // Mutual exclusivity with generated
            approvedBy,
            approvedAt: new Date()
        };
        const updatedPayroll = await payroll_dal_1.payrollDAL.updateById(payrollId, updateData);
        // --- TRIGGER NOTIFICATION ---
        try {
            await notifications_service_1.notificationsService.sendNotification({
                userId: payroll.userId.toString(),
                type: notification_interface_1.NotificationType.PAYROLL_GENERATED,
                title: 'Payslip Generated',
                message: `Your payslip for ${payroll.month}/${payroll.year} has been generated. You can now view and download it.`,
                targetApp: 'EMPLOYEE',
                data: { payrollId: updatedPayroll._id }
            });
        }
        catch (error) {
            console.error('[PayrollService] Failed to send payroll notification:', error);
        }
        return updatedPayroll;
    }
    /**
     * Mark payroll as paid
     */
    static async markAsPaid(payrollId, paymentDetails) {
        const updateData = {
            paymentStatus: constants_1.PAYMENT_STATUS.PAID,
            paymentDate: new Date(),
            isPending: false,
            ...paymentDetails
        };
        const payroll = await payroll_dal_1.payrollDAL.update(payrollId, updateData);
        if (!payroll) {
            throw new Error('Payroll not found');
        }
        return payroll;
    }
    /**
     * Get payroll statistics for dashboard
     */
    static async getPayrollStats(month, year) {
        const stats = await payroll_dal_1.payrollDAL.getPayrollStatsDashboard(month, year);
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
    static async getDrafts(month, year) {
        return await payroll_dal_1.payrollDAL.getDrafts(month, year);
    }
    /**
     * Get pending payrolls
     */
    static async getPending(month, year) {
        return await payroll_dal_1.payrollDAL.getPending(month, year);
    }
    /**
     * Bulk generate payrolls for multiple employees
     */
    static async bulkGeneratePayrolls(userIds, month, year, generatedBy) {
        const payrolls = [];
        for (const userId of userIds) {
            try {
                const user = await user_dal_1.userDAL.findById(userId);
                if (!user)
                    continue;
                const salaryDetails = user.professionalDetails.salaryDetails;
                if (!salaryDetails)
                    continue;
                const payrollData = {
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
            }
            catch (error) {
                console.error(`Error generating payroll for user ${userId}:`, error);
            }
        }
        return payrolls;
    }
    /**
     * Revise payroll
     */
    static async revisePayroll(payrollId, revisionData, revisionReason) {
        const updateData = {
            ...revisionData,
            isRevised: true,
            revisionDate: new Date(),
            revisionReason,
            isDraft: false,
            isGenerated: false,
            isPending: true
        };
        const payroll = await payroll_dal_1.payrollDAL.update(payrollId, updateData);
        if (!payroll) {
            throw new Error('Payroll not found');
        }
        return payroll;
    }
    /**
     * Get payroll by user and period
     */
    static async getPayrollByUserAndPeriod(userId, month, year) {
        return await payroll_dal_1.payrollDAL.findByUserAndPeriod(userId, month, year);
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
    static async downloadPayslip(payrollId) {
        const payroll = await payroll_dal_1.payrollDAL.findById(payrollId);
        if (!payroll) {
            throw new Error('Payroll not found');
        }
        if (!payroll.payslipPath) {
            // Generate PDF if not exists
            const user = await user_dal_1.userDAL.findById(payroll.userId._id.toString());
            if (!user) {
                throw new Error('User not found');
            }
            const pdfPath = await pdfGenerator_1.PDFGenerator.generateSalarySlip({ payroll, user });
            payroll.payslipPath = pdfPath;
            await payroll.save();
            return pdfPath;
        }
        return payroll.payslipPath;
    }
    /**
     * Regenerate payslip
     */
    async regeneratePayslip(payrollId) {
        const payroll = await payroll_dal_1.payrollDAL.findById(payrollId);
        if (!payroll) {
            throw new Error('Payroll not found');
        }
        const user = await user_dal_1.userDAL.findById(payroll.userId.toString());
        if (!user) {
            throw new Error('User not found');
        }
        const pdfPath = await pdfGenerator_1.PDFGenerator.generateSalarySlip({ payroll, user });
        payroll.payslipPath = pdfPath;
        await payroll.save();
        return pdfPath;
    }
    static async getUserPayrollHistory(userId, limit = 12) {
        return await payroll_dal_1.payrollDAL.getUserPayrollHistory(userId, limit);
    }
}
exports.PayrollService = PayrollService;
//# sourceMappingURL=payroll.service.js.map