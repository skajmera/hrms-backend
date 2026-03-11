"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payrollDAL = exports.PayrollDAL = void 0;
const payroll_model_1 = require("../models/payroll.model");
class PayrollDAL {
    /**
     * Create payroll
     */
    async create(payrollData) {
        return await payroll_model_1.PayrollModel.create(payrollData);
    }
    /**
     * Find payroll by ID
     */
    async findById(id) {
        return await payroll_model_1.PayrollModel.findById(id)
            .populate('userId', 'firstName lastName email profilePicture professionalDetails.employeeId')
            .populate('generatedBy', 'firstName lastName')
            .populate('approvedBy', 'firstName lastName');
    }
    /**
     * Find all payroll records
     */
    async findAll(filters = {}, options = {}) {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
        const skip = (page - 1) * limit;
        const records = await payroll_model_1.PayrollModel.find(filters)
            .populate('userId', 'firstName lastName email profilePicture professionalDetails.employeeId')
            .populate('generatedBy', 'firstName lastName')
            .populate('approvedBy', 'firstName lastName')
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit);
        const total = await payroll_model_1.PayrollModel.countDocuments(filters);
        return { records, total };
    }
    /**
     * Update payroll
     */
    async update(id, updateData) {
        return await payroll_model_1.PayrollModel.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true })
            .populate('userId', 'firstName lastName email profilePicture');
    }
    async updateById(id, updateData) {
        const updatedPayroll = await payroll_model_1.PayrollModel.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).populate('userId', 'firstName lastName email profilePicture');
        if (!updatedPayroll) {
            throw new Error('Payroll not found');
        }
        return updatedPayroll;
    }
    /**
     * Delete payroll
     */
    async delete(id) {
        return await payroll_model_1.PayrollModel.findByIdAndDelete(id);
    }
    /**
     * Find payroll by user, month, and year
     */
    async findByUserMonthYear(userId, month, year) {
        return await payroll_model_1.PayrollModel.findOne({ userId, month, year })
            .populate('userId', 'firstName lastName email profilePicture professionalDetails.employeeId');
    }
    async findByUserAndPeriod(userId, month, year) {
        return await payroll_model_1.PayrollModel.findOne({
            userId,
            month,
            year
        })
            .populate('userId', 'firstName lastName email professionalDetails.employeeId profilePicture')
            .populate('generatedBy', 'firstName lastName')
            .populate('approvedBy', 'firstName lastName');
    }
    /**
     * Get payroll by month and year
     */
    async findByMonthYear(month, year) {
        return await payroll_model_1.PayrollModel.find({ month, year })
            .populate('userId', 'firstName lastName email profilePicture professionalDetails.employeeId professionalDetails.department');
    }
    /**
     * Get user payroll history
     */
    async getUserPayrollHistory(userId, limit = 12) {
        return await payroll_model_1.PayrollModel.find({ userId })
            .sort({ year: -1, month: -1 })
            .limit(limit);
    }
    /**
     * Get payroll statistics
     */
    async getPayrollStats(month, year) {
        return await payroll_model_1.PayrollModel.aggregate([
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
       * Get payroll statistics for dashboard
       */
    async getPayrollStatsDashboard(month, year) {
        const stats = await payroll_model_1.PayrollModel.aggregate([
            {
                $match: { month, year }
            },
            {
                $group: {
                    _id: null,
                    totalPayroll: { $sum: '$netSalary' },
                    paidEmployees: {
                        $sum: { $cond: [{ $eq: ['$paymentStatus', 'PAID'] }, 1, 0] }
                    },
                    pendingPayments: {
                        $sum: { $cond: [{ $eq: ['$paymentStatus', 'PENDING'] }, 1, 0] }
                    },
                    averageSalary: { $avg: '$netSalary' },
                    totalEmployees: { $sum: 1 }
                }
            }
        ]);
        return stats[0] || {
            totalPayroll: 0,
            paidEmployees: 0,
            pendingPayments: 0,
            averageSalary: 0,
            totalEmployees: 0
        };
    }
    /**
      * Get draft payrolls
      */
    async getDrafts(month, year) {
        const filter = { isDraft: true };
        if (month)
            filter.month = month;
        if (year)
            filter.year = year;
        return await payroll_model_1.PayrollModel.find(filter)
            .populate('userId', 'firstName lastName email profilePicture professionalDetails.employeeId')
            .sort({ createdAt: -1 });
    }
    /**
     * Get pending payrolls
     */
    async getPending(month, year) {
        const filter = { paymentStatus: 'PENDING', isGenerated: true };
        if (month)
            filter.month = month;
        if (year)
            filter.year = year;
        return await payroll_model_1.PayrollModel.find(filter)
            .populate('userId', 'firstName lastName email profilePicture professionalDetails.employeeId')
            .sort({ createdAt: -1 });
    }
    /**
     * Mark payroll as paid
     */
    async markAsPaid(id, paymentDetails) {
        return await payroll_model_1.PayrollModel.findByIdAndUpdate(id, {
            $set: {
                paymentStatus: 'PAID',
                paymentDate: new Date(),
                ...paymentDetails
            }
        }, { new: true });
    }
    /**
     * Bulk generate payroll
     */
    async bulkCreate(payrollRecords) {
        return await payroll_model_1.PayrollModel.insertMany(payrollRecords);
    }
}
exports.PayrollDAL = PayrollDAL;
exports.payrollDAL = new PayrollDAL();
//# sourceMappingURL=payroll.dal.js.map