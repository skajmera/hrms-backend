"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OffboardingService = void 0;
const offboarding_dal_1 = require("../../../../shared/dal/offboarding.dal");
const user_dal_1 = require("../../../../shared/dal/user.dal");
/**
 * Offboarding Service
 */
class OffboardingService {
    /**
     * Create resignation request
     */
    static async createResignation(resignationData, createdBy) {
        // Get user details
        const user = await user_dal_1.userDAL.findById(resignationData.userId);
        if (!user) {
            throw new Error('User not found');
        }
        // Check if user already has pending resignation
        const existingResignation = await offboarding_dal_1.OffboardingDAL.findByUserId(resignationData.userId);
        if (existingResignation && ['PENDING', 'APPROVED', 'NOTICE_PERIOD'].includes(existingResignation.status)) {
            throw new Error('User already has an active resignation request');
        }
        // Calculate notice period days
        const resignationDate = new Date(resignationData.resignationDate);
        const lastWorkingDate = new Date(resignationData.lastWorkingDate);
        const diffTime = Math.abs(lastWorkingDate.getTime() - resignationDate.getTime());
        const noticePeriodDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        // Create offboarding record
        const offboardingData = {
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
        const offboarding = await offboarding_dal_1.OffboardingDAL.create(offboardingData);
        return offboarding;
    }
    /**
     * Get resignation by ID
     */
    static async getResignationById(offboardingId) {
        const offboarding = await offboarding_dal_1.OffboardingDAL.findById(offboardingId);
        if (!offboarding) {
            throw new Error('Resignation request not found');
        }
        return offboarding;
    }
    /**
     * Get all resignations
     */
    static async getAllResignations(filters = {}, options) {
        return await offboarding_dal_1.OffboardingDAL.findAll(filters, options);
    }
    /**
     * Update resignation
     */
    static async updateResignation(offboardingId, updateData) {
        const offboarding = await offboarding_dal_1.OffboardingDAL.updateById(offboardingId, updateData);
        if (!offboarding) {
            throw new Error('Resignation request not found');
        }
        return offboarding;
    }
    /**
     * Delete resignation
     */
    static async deleteResignation(offboardingId) {
        const offboarding = await offboarding_dal_1.OffboardingDAL.deleteById(offboardingId);
        if (!offboarding) {
            throw new Error('Resignation request not found');
        }
    }
    /**
     * Approve resignation
     */
    static async approveResignation(offboardingId, approvedBy, hrNotes) {
        const offboarding = await this.getResignationById(offboardingId);
        if (offboarding.status !== 'PENDING') {
            throw new Error('Only pending resignations can be approved');
        }
        const updateData = {
            status: 'NOTICE_PERIOD',
            approvedBy,
            approvedAt: new Date(),
            hrNotes
        };
        // Update user status to resigned
        await user_dal_1.userDAL.update(offboarding.userId?._id.toString(), {
            //   'professionalDetails.employmentStatus': 'RESIGNED'
            professionalDetails: {
                employmentStatus: 'RESIGNED'
            }
        });
        return await offboarding_dal_1.OffboardingDAL.updateById(offboardingId, updateData);
    }
    /**
     * Reject resignation
     */
    static async rejectResignation(offboardingId, rejectedBy, rejectionReason) {
        const offboarding = await this.getResignationById(offboardingId);
        if (offboarding.status !== 'PENDING') {
            throw new Error('Only pending resignations can be rejected');
        }
        const updateData = {
            status: 'REJECTED',
            rejectedBy,
            rejectedAt: new Date(),
            rejectionReason
        };
        return await offboarding_dal_1.OffboardingDAL.updateById(offboardingId, updateData);
    }
    /**
     * Withdraw resignation
     */
    static async withdrawResignation(offboardingId) {
        const offboarding = await this.getResignationById(offboardingId);
        if (!['PENDING', 'NOTICE_PERIOD'].includes(offboarding.status)) {
            throw new Error('Cannot withdraw resignation at this stage');
        }
        const updateData = {
            status: 'WITHDRAWN'
        };
        // Revert user status back to active
        await user_dal_1.userDAL.update(offboarding.userId.toString(), {
            //   'professionalDetails.employmentStatus': 'ACTIVE'
            professionalDetails: {
                employmentStatus: 'ACTIVE'
            }
        });
        return await offboarding_dal_1.OffboardingDAL.updateById(offboardingId, updateData);
    }
    /**
     * Complete offboarding
     */
    static async completeOffboarding(offboardingId) {
        const offboarding = await this.getResignationById(offboardingId);
        if (offboarding.status !== 'NOTICE_PERIOD') {
            throw new Error('Only employees in notice period can be offboarded');
        }
        // Check if all clearances are completed
        const clearance = offboarding.clearance;
        const allClearancesCompleted = clearance.assetReturn.status === 'COMPLETED' &&
            clearance.itClearance.status === 'COMPLETED' &&
            clearance.financeClearance.status === 'COMPLETED' &&
            clearance.hrClearance.status === 'COMPLETED';
        if (!allClearancesCompleted) {
            throw new Error('All clearances must be completed before offboarding');
        }
        const updateData = {
            status: 'COMPLETED'
        };
        // Update user status
        await user_dal_1.userDAL.update(offboarding.userId.toString(), {
            isActive: false,
            //   'professionalDetails.employmentStatus': 'RESIGNED'
            professionalDetails: {
                employmentStatus: 'RESIGNED'
            }
        });
        return await offboarding_dal_1.OffboardingDAL.updateById(offboardingId, updateData);
    }
    /**
     * Update clearance status
     */
    static async updateClearance(offboardingId, clearanceType, status, notes) {
        const offboarding = await this.getResignationById(offboardingId);
        const updateData = {
            [`clearance.${clearanceType}.status`]: status,
            [`clearance.${clearanceType}.notes`]: notes
        };
        if (status === 'COMPLETED') {
            updateData[`clearance.${clearanceType}.completedAt`] = new Date();
        }
        return await offboarding_dal_1.OffboardingDAL.updateById(offboardingId, updateData);
    }
    /**
     * Get pending resignations
     */
    static async getPendingResignations() {
        return await offboarding_dal_1.OffboardingDAL.getPendingResignations();
    }
    /**
     * Get notice period employees
     */
    static async getNoticePeriodEmployees() {
        return await offboarding_dal_1.OffboardingDAL.getNoticePeriodEmployees();
    }
    /**
     * Get offboarding statistics
     */
    static async getStats(month, year) {
        const stats = await offboarding_dal_1.OffboardingDAL.getStats(month, year);
        const pending = await offboarding_dal_1.OffboardingDAL.countByStatus('PENDING');
        const noticePeriod = await offboarding_dal_1.OffboardingDAL.countByStatus('NOTICE_PERIOD');
        return {
            stats,
            pending,
            noticePeriod,
            total: stats.reduce((sum, item) => sum + item.count, 0)
        };
    }
}
exports.OffboardingService = OffboardingService;
//# sourceMappingURL=offboarding.service.js.map