"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceDAL = exports.AttendanceDAL = void 0;
const attendance_model_1 = require("../models/attendance.model");
class AttendanceDAL {
    /**
     * Mark attendance
     */
    async create(attendanceData) {
        return await attendance_model_1.AttendanceModel.create(attendanceData);
    }
    /**
     * Find attendance by ID
     */
    async findById(id) {
        return await attendance_model_1.AttendanceModel.findById(id)
            .populate('userId', 'firstName lastName email professionalDetails.employeeId');
    }
    /**
     * Find attendance by user and date
     */
    async findByUserAndDate(userId, date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        return await attendance_model_1.AttendanceModel.findOne({
            userId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });
    }
    /**
     * Find all attendance records
     */
    async findAll(filters = {}, options = {}) {
        const { page = 1, limit = 10, sortBy = 'date', sortOrder = 'desc' } = options;
        const skip = (page - 1) * limit;
        const records = await attendance_model_1.AttendanceModel.find(filters)
            .populate('userId', 'firstName lastName email professionalDetails.employeeId professionalDetails.department professionalDetails.shiftTime')
            .populate('approvedBy', 'firstName lastName')
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit);
        const total = await attendance_model_1.AttendanceModel.countDocuments(filters);
        return { records, total };
    }
    /**
     * Update attendance
     */
    async update(id, updateData) {
        return await attendance_model_1.AttendanceModel.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true })
            .populate('userId', 'firstName lastName email');
    }
    /**
     * Delete attendance
     */
    async delete(id) {
        return await attendance_model_1.AttendanceModel.findByIdAndDelete(id);
    }
    /**
     * Get attendance by user and date range
     */
    async findByUserAndDateRange(userId, startDate, endDate) {
        return await attendance_model_1.AttendanceModel.find({
            userId,
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 });
    }
    /**
     * Get today's attendance
     */
    async getTodayAttendance() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return await attendance_model_1.AttendanceModel.find({
            date: { $gte: today, $lt: tomorrow }
        })
            .populate('userId', 'firstName lastName shiftTime email professionalDetails.employeeId professionalDetails.department');
    }
    /**
     * Get attendance statistics for a user
     */
    async getUserAttendanceStats(userId, month, year) {
        const mongoose = require('mongoose');
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);
        return await attendance_model_1.AttendanceModel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
    }
    /**
     * Get late arrivals
     */
    async getLateArrivals(startDate, endDate) {
        return await attendance_model_1.AttendanceModel.find({
            date: { $gte: startDate, $lte: endDate },
            isLate: true
        })
            .populate('userId', 'firstName lastName email professionalDetails.employeeId')
            .sort({ date: -1 });
    }
    /**
     * Get department-wise attendance
     */
    async getDepartmentAttendance(departmentId, date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        return await attendance_model_1.AttendanceModel.aggregate([
            {
                $match: {
                    date: { $gte: startOfDay, $lte: endOfDay }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $match: {
                    'user.professionalDetails.department': departmentId
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
    }
    /**
     * Bulk create attendance
     */
    async bulkCreate(attendanceRecords) {
        return await attendance_model_1.AttendanceModel.insertMany(attendanceRecords);
    }
    /**
   * Get late arrivals count for a specific month and year
   */
    async getLateArrivalsCount(userId, month, year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);
        return await attendance_model_1.AttendanceModel.countDocuments({
            userId,
            date: { $gte: startDate, $lte: endDate },
            isLate: true
        });
    }
    /**
     * Get late arrivals details for a specific month and year
     */
    async getLateArrivalsWithUser(userId, month, year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);
        return await attendance_model_1.AttendanceModel.find({
            userId,
            date: { $gte: startDate, $lte: endDate },
            isLate: true
        })
            .sort({ date: 1 })
            .select('date checkInTime lateByMinutes status');
    }
    /**
      * Get daily attendance summary
      */
    static async getDailySummary(date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const summary = await attendance_model_1.AttendanceModel.aggregate([
            {
                $match: {
                    date: { $gte: startOfDay, $lte: endOfDay }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        return summary;
    }
    /**
      * Get monthly attendance report
      */
    async getMonthlyReport(userId, month, year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);
        const attendances = await this.findByUserAndDateRange(userId, startDate, endDate);
        const report = {
            userId,
            userName: '',
            totalDays: endDate.getDate(),
            presentDays: 0,
            absentDays: 0,
            lateDays: 0,
            wfhDays: 0,
            halfDays: 0,
            totalWorkingHours: 0,
            averageWorkingHours: 0
        };
        attendances.forEach(att => {
            if (att.status === 'PRESENT')
                report.presentDays++;
            if (att.status === 'ABSENT')
                report.absentDays++;
            if (att.status === 'WFH')
                report.wfhDays++;
            if (att.status === 'HALF_DAY')
                report.halfDays++;
            if (att.isLate)
                report.lateDays++;
            if (att.workingHours)
                report.totalWorkingHours += att.workingHours;
        });
        if (report.presentDays > 0) {
            report.averageWorkingHours = report.totalWorkingHours / report.presentDays;
        }
        return report;
    }
    /**
       * Get WFH count for month
       */
    static async getWFHCount(userId, month, year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);
        return await attendance_model_1.AttendanceModel.countDocuments({
            userId,
            date: { $gte: startDate, $lte: endDate },
            status: 'WFH'
        });
    }
}
exports.AttendanceDAL = AttendanceDAL;
exports.attendanceDAL = new AttendanceDAL();
//# sourceMappingURL=attendance.dal.js.map