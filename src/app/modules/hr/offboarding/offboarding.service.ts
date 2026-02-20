import { OffboardingDAL } from '../../../../shared/dal/offboarding.dal';
import { userDAL } from '../../../../shared/dal/user.dal';
import { IOffboarding, IOffboardingCreateInput, IOffboardingUpdateInput } from '../../../../shared/interfaces/offboarding.interface';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';

/**
 * Offboarding Service
 */

export class OffboardingService {
  /**
   * Create resignation request
   */
  static async createResignation(resignationData: IOffboardingCreateInput, createdBy: string): Promise<IOffboarding> {
    // Get user details
    const user = await userDAL.findById(resignationData.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user already has pending resignation
    const existingResignation = await OffboardingDAL.findByUserId(resignationData.userId);
    if (existingResignation && ['PENDING', 'APPROVED', 'NOTICE_PERIOD'].includes(existingResignation.status)) {
      throw new Error('User already has an active resignation request');
    }

    // Calculate notice period days
    const resignationDate = new Date(resignationData.resignationDate);
    const lastWorkingDate = new Date(resignationData.lastWorkingDate);
    const diffTime = Math.abs(lastWorkingDate.getTime() - resignationDate.getTime());
    const noticePeriodDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Create offboarding record
    const offboardingData: Partial<IOffboarding> = {
      userId: user._id,
      employeeId: user.professionalDetails.employeeId,
      employeeName: `${user.firstName} ${user.lastName}`,
      designation: user.professionalDetails.designation,
      department: user.professionalDetails.department,
      resignationDate,
      lastWorkingDate,
      noticePeriodDays,
      reason: resignationData.reason,
      reasonExplanation: resignationData.reasonExplanation,
      employeeNotes: resignationData.employeeNotes,
      status: 'PENDING',
      createdBy
    };

    const offboarding = await OffboardingDAL.create(offboardingData);
    return offboarding;
  }

  /**
   * Get resignation by ID
   */
  static async getResignationById(offboardingId: string): Promise<IOffboarding> {
    const offboarding = await OffboardingDAL.findById(offboardingId);
    if (!offboarding) {
      throw new Error('Resignation request not found');
    }
    return offboarding;
  }

  /**
   * Get all resignations
   */
  static async getAllResignations(filters: any = {}, options: IPaginationOptions) {
    return await OffboardingDAL.findAll(filters, options);
  }

  /**
   * Update resignation
   */
  static async updateResignation(offboardingId: string, updateData: IOffboardingUpdateInput): Promise<IOffboarding> {
    const offboarding = await OffboardingDAL.updateById(offboardingId, updateData);
    if (!offboarding) {
      throw new Error('Resignation request not found');
    }
    return offboarding;
  }

  /**
   * Delete resignation
   */
  static async deleteResignation(offboardingId: string): Promise<void> {
    const offboarding = await OffboardingDAL.deleteById(offboardingId);
    if (!offboarding) {
      throw new Error('Resignation request not found');
    }
  }

  /**
   * Approve resignation
   */
  static async approveResignation(offboardingId: string, approvedBy: string, hrNotes?: string): Promise<IOffboarding> {
    const offboarding = await this.getResignationById(offboardingId);

    if (offboarding.status !== 'PENDING') {
      throw new Error('Only pending resignations can be approved');
    }

    const updateData: Partial<IOffboarding> = {
      status: 'NOTICE_PERIOD',
      approvedBy,
      approvedAt: new Date(),
      hrNotes
    };

    // Update user status to resigned
    await userDAL.update(offboarding.userId.toString(), {
    //   'professionalDetails.employmentStatus': 'RESIGNED'
    professionalDetails: {
        employmentStatus: 'RESIGNED'
      }
    });

    return await OffboardingDAL.updateById(offboardingId, updateData);
  }

  /**
   * Reject resignation
   */
  static async rejectResignation(offboardingId: string, rejectedBy: string, rejectionReason: string): Promise<IOffboarding> {
    const offboarding = await this.getResignationById(offboardingId);

    if (offboarding.status !== 'PENDING') {
      throw new Error('Only pending resignations can be rejected');
    }

    const updateData: Partial<IOffboarding> = {
      status: 'REJECTED',
      rejectedBy,
      rejectedAt: new Date(),
      rejectionReason
    };

    return await OffboardingDAL.updateById(offboardingId, updateData);
  }

  /**
   * Withdraw resignation
   */
  static async withdrawResignation(offboardingId: string): Promise<IOffboarding> {
    const offboarding = await this.getResignationById(offboardingId);

    if (!['PENDING', 'NOTICE_PERIOD'].includes(offboarding.status)) {
      throw new Error('Cannot withdraw resignation at this stage');
    }

    const updateData: Partial<IOffboarding> = {
      status: 'WITHDRAWN'
    };

    // Revert user status back to active
    await userDAL.update(offboarding.userId.toString(), {
    //   'professionalDetails.employmentStatus': 'ACTIVE'
      professionalDetails: {
        employmentStatus: 'ACTIVE'
      }
    });

    return await OffboardingDAL.updateById(offboardingId, updateData);
  }

  /**
   * Complete offboarding
   */
  static async completeOffboarding(offboardingId: string): Promise<IOffboarding> {
    const offboarding = await this.getResignationById(offboardingId);

    if (offboarding.status !== 'NOTICE_PERIOD') {
      throw new Error('Only employees in notice period can be offboarded');
    }

    // Check if all clearances are completed
    const clearance = offboarding.clearance;
    const allClearancesCompleted = 
      clearance.assetReturn.status === 'COMPLETED' &&
      clearance.itClearance.status === 'COMPLETED' &&
      clearance.financeClearance.status === 'COMPLETED' &&
      clearance.hrClearance.status === 'COMPLETED';

    if (!allClearancesCompleted) {
      throw new Error('All clearances must be completed before offboarding');
    }

    const updateData: Partial<IOffboarding> = {
      status: 'COMPLETED'
    };

    // Update user status
    await userDAL.update(offboarding.userId.toString(), {
      isActive: false,
    //   'professionalDetails.employmentStatus': 'RESIGNED'
    professionalDetails: {
        employmentStatus: 'RESIGNED'
      }
    });

    return await OffboardingDAL.updateById(offboardingId, updateData);
  }

  /**
   * Update clearance status
   */
  static async updateClearance(
    offboardingId: string, 
    clearanceType: 'assetReturn' | 'itClearance' | 'financeClearance' | 'hrClearance',
    status: 'PENDING' | 'COMPLETED',
    notes?: string
  ): Promise<IOffboarding> {
    const offboarding = await this.getResignationById(offboardingId);

    const updateData: any = {
      [`clearance.${clearanceType}.status`]: status,
      [`clearance.${clearanceType}.notes`]: notes
    };

    if (status === 'COMPLETED') {
      updateData[`clearance.${clearanceType}.completedAt`] = new Date();
    }

    return await OffboardingDAL.updateById(offboardingId, updateData);
  }

  /**
   * Get pending resignations
   */
  static async getPendingResignations() {
    return await OffboardingDAL.getPendingResignations();
  }

  /**
   * Get notice period employees
   */
  static async getNoticePeriodEmployees() {
    return await OffboardingDAL.getNoticePeriodEmployees();
  }

  /**
   * Get offboarding statistics
   */
  static async getStats(month?: number, year?: number) {
    const stats = await OffboardingDAL.getStats(month, year);
    const pending = await OffboardingDAL.countByStatus('PENDING');
    const noticePeriod = await OffboardingDAL.countByStatus('NOTICE_PERIOD');
    
    return {
      stats,
      pending,
      noticePeriod,
      total: stats.reduce((sum: number, item: any) => sum + item.count, 0)
    };
  }
}