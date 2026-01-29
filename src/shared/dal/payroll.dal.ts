import { PayrollModel } from '../models/payroll.model';
import { IPayroll, IPayrollCreateInput } from '../interfaces/payroll.interface';
import { IQueryFilters, IPaginationOptions } from '../interfaces/common.interface';

export class PayrollDAL {
  /**
   * Create payroll
   */
  async create(payrollData: any): Promise<IPayroll> {
    return await PayrollModel.create(payrollData);
  }

  /**
   * Find payroll by ID
   */
  async findById(id: string): Promise<IPayroll | null> {
    return await PayrollModel.findById(id)
      .populate('userId', 'firstName lastName email professionalDetails.employeeId')
      .populate('generatedBy', 'firstName lastName')
      .populate('approvedBy', 'firstName lastName');
  }

  /**
   * Find all payroll records
   */
  async findAll(
    filters: IQueryFilters = {},
    options: IPaginationOptions = {}
  ): Promise<{ records: IPayroll[]; total: number }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;

    const records = await PayrollModel.find(filters)
      .populate('userId', 'firstName lastName email professionalDetails.employeeId')
      .populate('generatedBy', 'firstName lastName')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    const total = await PayrollModel.countDocuments(filters);

    return { records, total };
  }

  /**
   * Update payroll
   */
  async update(id: string, updateData: Partial<IPayroll>): Promise<IPayroll | null> {
    return await PayrollModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('userId', 'firstName lastName email');
  }

  /**
   * Delete payroll
   */
  async delete(id: string): Promise<IPayroll | null> {
    return await PayrollModel.findByIdAndDelete(id);
  }

  /**
   * Find payroll by user, month, and year
   */
  async findByUserMonthYear(userId: string, month: number, year: number): Promise<IPayroll | null> {
    return await PayrollModel.findOne({ userId, month, year })
      .populate('userId', 'firstName lastName email professionalDetails.employeeId');
  }

  /**
   * Get payroll by month and year
   */
  async findByMonthYear(month: number, year: number): Promise<IPayroll[]> {
    return await PayrollModel.find({ month, year })
      .populate('userId', 'firstName lastName email professionalDetails.employeeId professionalDetails.department');
  }

  /**
   * Get user payroll history
   */
  async getUserPayrollHistory(userId: string, limit: number = 12): Promise<IPayroll[]> {
    return await PayrollModel.find({ userId })
      .sort({ year: -1, month: -1 })
      .limit(limit);
  }

  /**
   * Get payroll statistics
   */
  async getPayrollStats(month: number, year: number): Promise<any> {
    return await PayrollModel.aggregate([
      {
        $match: { month, year }
      },
      {
        $group: {
          _id: null,
          totalGrossSalary: { $sum: '$grossSalary' },
          totalDeductions: { $sum: '$totalDeductions' },
          totalNetSalary: { $sum: '$netSalary' },
          totalEmployees: { $sum: 1 },
          averageSalary: { $avg: '$netSalary' }
        }
      }
    ]);
  }

  /**
   * Mark payroll as paid
   */
  async markAsPaid(id: string, paymentDetails: any): Promise<IPayroll | null> {
    return await PayrollModel.findByIdAndUpdate(
      id,
      {
        $set: {
          paymentStatus: 'PAID',
          paymentDate: new Date(),
          ...paymentDetails
        }
      },
      { new: true }
    );
  }

  /**
   * Bulk generate payroll
   */
  async bulkCreate(payrollRecords: any[]): Promise<IPayroll[] | any> {
    return await PayrollModel.insertMany(payrollRecords);
  }
}

export const payrollDAL = new PayrollDAL();