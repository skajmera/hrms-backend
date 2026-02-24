import { FilterQuery } from 'mongoose';
import { OffboardingModel } from '../models/offboarding.model';
import { IOffboarding, IOffboardingCreateInput } from '../interfaces/offboarding.interface';
import { IPaginationOptions, IPaginatedResponse } from '../interfaces/common.interface';
import { PAGINATION_DEFAULTS } from '../../config/constants';

/**
 * Offboarding Data Access Layer
 */

export class OffboardingDAL {
  /**
   * Create resignation request
   */
  static async create(offboardingData: Partial<IOffboarding>): Promise<IOffboarding> {
    const offboarding = await OffboardingModel.create(offboardingData);
    return offboarding;
  }

  /**
   * Find offboarding by ID
   */
  static async findById(offboardingId: string): Promise<IOffboarding | null> {
    return await OffboardingModel.findById(offboardingId)
    
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
  static async findAll(
    filters: FilterQuery<IOffboarding> = {},
    options: IPaginationOptions = {}
  ): Promise<IPaginatedResponse<IOffboarding>> {
    const {
      page = PAGINATION_DEFAULTS.PAGE,
      limit = PAGINATION_DEFAULTS.LIMIT,
      sortBy = 'resignationDate',
      sortOrder = 'desc'
    } = options;

    const skip = (page - 1) * limit;
    const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [data, totalItems] = await Promise.all([
      OffboardingModel.find(filters)
        .populate('userId', 'firstName lastName email professionalDetails.employeeId profilePicture')
        .populate('department', 'name code')
        .populate('approvedBy', 'firstName lastName')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      OffboardingModel.countDocuments(filters)
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

  static async updateById(
    offboardingId: string,
    updateData: Partial<IOffboarding>
  ): Promise<IOffboarding> {
  
    const updated = await OffboardingModel.findByIdAndUpdate(
      offboardingId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
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
  static async deleteById(offboardingId: string): Promise<IOffboarding | null> {
    return await OffboardingModel.findByIdAndDelete(offboardingId);
  }

  /**
   * Find by user ID
   */
  static async findByUserId(userId: string): Promise<IOffboarding | null> {
    return await OffboardingModel.findOne({ userId })
      .populate('department', 'name code')
      .sort({ createdAt: -1 });
  }

  /**
   * Get pending resignations
   */
  static async getPendingResignations(): Promise<IOffboarding[]> {
    return await OffboardingModel.find({ status: 'PENDING' })
      .populate('userId', 'firstName lastName email professionalDetails.employeeId profilePicture')
      .populate('department', 'name code')
      .sort({ resignationDate: 1 });
  }

  /**
   * Get employees in notice period
   */
  static async getNoticePeriodEmployees(): Promise<IOffboarding[]> {
    return await OffboardingModel.find({ status: 'NOTICE_PERIOD' })
      .populate('userId', 'firstName lastName email professionalDetails.employeeId profilePicture')
      .populate('department', 'name code')
      .sort({ lastWorkingDate: 1 });
  }

  /**
   * Get offboarding statistics
   */
  static async getStats(month?: number, year?: number): Promise<any> {
    const matchStage: any = {};
    
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      matchStage.resignationDate = { $gte: startDate, $lte: endDate };
    }

    const stats = await OffboardingModel.aggregate([
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
  static async countByStatus(status: IOffboarding['status']): Promise<number> {
    return await OffboardingModel.countDocuments({ status });
  }
}