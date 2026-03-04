"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OffboardingDAL = void 0;
const offboarding_model_1 = require("../models/offboarding.model");
const constants_1 = require("../../config/constants");
/**
 * Offboarding Data Access Layer
 */
class OffboardingDAL {
    /**
     * Create resignation request
     */
    static async create(offboardingData) {
        const offboarding = await offboarding_model_1.OffboardingModel.create(offboardingData);
        return offboarding;
    }
    /**
     * Find offboarding by ID
     */
    static async findById(offboardingId) {
        return await offboarding_model_1.OffboardingModel.findById(offboardingId)
            .populate({
            path: 'userId',
            select: 'firstName lastName email professionalDetails profilePicture',
            populate: {
                path: 'professionalDetails.reportingManager',
                select: 'firstName lastName email profilePicture'
            }
        })
            .populate('department', 'name code')
            .populate('approvedBy', 'firstName lastName')
            .populate('rejectedBy', 'firstName lastName')
            .populate('createdBy', 'firstName lastName');
    }
    /**
     * Get all offboarding records with pagination
     */
    static async findAll(filters = {}, options = {}) {
        const { page = constants_1.PAGINATION_DEFAULTS.PAGE, limit = constants_1.PAGINATION_DEFAULTS.LIMIT, sortBy = 'resignationDate', sortOrder = 'desc' } = options;
        const skip = (page - 1) * limit;
        const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const [data, totalItems] = await Promise.all([
            offboarding_model_1.OffboardingModel.find(filters)
                .populate('userId', 'firstName lastName email professionalDetails.employeeId profilePicture')
                .populate('department', 'name code')
                .populate('approvedBy', 'firstName lastName')
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec(),
            offboarding_model_1.OffboardingModel.countDocuments(filters)
        ]);
        const totalPages = Math.ceil(totalItems / limit);
        return {
            data,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        };
    }
    /**
     * Update offboarding
     */
    //   static async updateById(offboardingId: string, updateData: Partial<IOffboarding>): Promise<IOffboarding | null> {
    //     return await OffboardingModel.findByIdAndUpdate(offboardingId, updateData, { new: true })
    //       .populate('userId', 'firstName lastName email')
    //       .populate('department', 'name code');
    //   }
    static async updateById(offboardingId, updateData) {
        const updated = await offboarding_model_1.OffboardingModel.findByIdAndUpdate(offboardingId, { $set: updateData }, { new: true, runValidators: true })
            .populate('userId', 'firstName lastName email')
            .populate('department', 'name code');
        if (!updated) {
            throw new Error('Offboarding record not found');
        }
        return updated;
    }
    /**
     * Delete offboarding
     */
    static async deleteById(offboardingId) {
        return await offboarding_model_1.OffboardingModel.findByIdAndDelete(offboardingId);
    }
    /**
     * Find by user ID
     */
    static async findByUserId(userId) {
        return await offboarding_model_1.OffboardingModel.findOne({ userId })
            .populate('department', 'name code')
            .sort({ createdAt: -1 });
    }
    /**
     * Get pending resignations
     */
    static async getPendingResignations() {
        return await offboarding_model_1.OffboardingModel.find({ status: 'PENDING' })
            .populate('userId', 'firstName lastName email professionalDetails.employeeId profilePicture')
            .populate('department', 'name code')
            .sort({ resignationDate: 1 });
    }
    /**
     * Get employees in notice period
     */
    static async getNoticePeriodEmployees() {
        return await offboarding_model_1.OffboardingModel.find({ status: 'NOTICE_PERIOD' })
            .populate('userId', 'firstName lastName email professionalDetails.employeeId profilePicture')
            .populate('department', 'name code')
            .sort({ lastWorkingDate: 1 });
    }
    /**
     * Get offboarding statistics
     */
    static async getStats(month, year) {
        const matchStage = {};
        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);
            matchStage.resignationDate = { $gte: startDate, $lte: endDate };
        }
        const stats = await offboarding_model_1.OffboardingModel.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        return stats;
    }
    /**
     * Count by status
     */
    static async countByStatus(status) {
        return await offboarding_model_1.OffboardingModel.countDocuments({ status });
    }
}
exports.OffboardingDAL = OffboardingDAL;
//# sourceMappingURL=offboarding.dal.js.map