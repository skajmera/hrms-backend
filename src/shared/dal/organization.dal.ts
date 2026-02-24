import { FilterQuery } from 'mongoose';
import { OrganizationModel } from '../models/organization.model';
import { IOrganization, IOrganizationCreateInput } from '../interfaces/organization.interface';
import { IPaginationOptions, IPaginatedResponse } from '../interfaces/common.interface';
import { PAGINATION_DEFAULTS } from '../../config/constants';

/**
 * Organization Data Access Layer
 */

export class OrganizationDAL {
  /**
   * Create organization
   */
  static async create(organizationData: Partial<IOrganization>): Promise<IOrganization> {
    const organization = await OrganizationModel.create(organizationData);
    return organization;
  }

  /**
   * Find organization by ID
   */
  static async findById(organizationId: string): Promise<IOrganization | null> {
    return await OrganizationModel.findById(organizationId)
      .populate('owner', 'firstName lastName email')
      .populate('admins', 'firstName lastName email');
  }

  /**
   * Find organization by owner
   */
  static async findByOwner(ownerId: string): Promise<IOrganization | null> {
    return await OrganizationModel.findOne({ owner: ownerId })
      .populate('admins', 'firstName lastName email');
  }

  /**
   * Find organization by email
   */
  static async findByEmail(email: string): Promise<IOrganization | null> {
    return await OrganizationModel.findOne({ email: email.toLowerCase() });
  }

  /**
   * Get all organizations
   */
  static async findAll(
    filters: FilterQuery<IOrganization> = {},
    options: IPaginationOptions = {}
  ): Promise<IPaginatedResponse<IOrganization>> {
    const {
      page = PAGINATION_DEFAULTS.PAGE,
      limit = PAGINATION_DEFAULTS.LIMIT,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    const skip = (page - 1) * limit;
    const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [data, totalItems] = await Promise.all([
      OrganizationModel.find(filters)
        .populate('owner', 'firstName lastName email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      OrganizationModel.countDocuments(filters)
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
   * Update organization
   */
  static async updateById(organizationId: string, updateData: Partial<IOrganization>): Promise<IOrganization | null> {
    return await OrganizationModel.findByIdAndUpdate(
      organizationId,
      updateData,
      { new: true }
    ).populate('owner', 'firstName lastName email');
  }

  /**
   * Delete organization
   */
  static async deleteById(organizationId: string): Promise<IOrganization | null> {
    return await OrganizationModel.findByIdAndDelete(organizationId);
  }

  /**
   * Add admin to organization
   */
  static async addAdmin(organizationId: string, adminId: string): Promise<IOrganization | null> {
    return await OrganizationModel.findByIdAndUpdate(
      organizationId,
      { $addToSet: { admins: adminId } },
      { new: true }
    );
  }

  /**
   * Remove admin from organization
   */
  static async removeAdmin(organizationId: string, adminId: string): Promise<IOrganization | null> {
    return await OrganizationModel.findByIdAndUpdate(
      organizationId,
      { $pull: { admins: adminId } },
      { new: true }
    );
  }

  /**
   * Update settings
   */
  static async updateSettings(organizationId: string, settings: Partial<IOrganization['settings']>): Promise<IOrganization | null> {
    return await OrganizationModel.findByIdAndUpdate(
      organizationId,
      { $set: { settings } },
      { new: true }
    );
  }

  /**
   * Update subscription
   */
  static async updateSubscription(
    organizationId: string, 
    subscription: Partial<IOrganization['subscription']>
  ): Promise<IOrganization | null> {
    return await OrganizationModel.findByIdAndUpdate(
      organizationId,
      { $set: { subscription } },
      { new: true }
    );
  }

  /**
   * Check if user belongs to organization
   */
  static async isUserInOrganization(organizationId: string, userId: string): Promise<boolean> {
    const org = await OrganizationModel.findOne({
      _id: organizationId,
      $or: [
        { owner: userId },
        { admins: userId }
      ]
    });
    
    return !!org;
  }

  /**
   * Get employee count
   */
  static async getEmployeeCount(organizationId: string): Promise<number> {
    const UserModel = require('./user.dal').UserDAL;
    // This would need to be implemented based on how you link users to organizations
    return 0; // Placeholder
  }
}