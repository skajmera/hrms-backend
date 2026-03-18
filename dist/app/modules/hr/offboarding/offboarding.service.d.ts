import { IOffboarding, IOffboardingCreateInput, IOffboardingUpdateInput } from '../../../../shared/interfaces/offboarding.interface';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';
/**
 * Offboarding Service
 */
export declare class OffboardingService {
    /**
     * Create resignation request
     */
    static createResignation(resignationData: IOffboardingCreateInput, createdBy: string): Promise<IOffboarding>;
    /**
     * Get resignation by ID
     */
    static getResignationById(offboardingId: string): Promise<IOffboarding>;
    /**
     * Get all resignations
     */
    static getAllResignations(filters: any | undefined, options: IPaginationOptions): Promise<import("../../../../shared/interfaces/common.interface").IPaginatedResponse<IOffboarding>>;
    /**
     * Update resignation
     */
    static updateResignation(offboardingId: string, updateData: IOffboardingUpdateInput): Promise<IOffboarding>;
    /**
     * Delete resignation
     */
    static deleteResignation(offboardingId: string): Promise<void>;
    /**
     * Approve resignation
     */
    static approveResignation(offboardingId: string, approvedBy: string, hrNotes?: string): Promise<IOffboarding>;
    /**
     * Reject resignation
     */
    static rejectResignation(offboardingId: string, rejectedBy: string, rejectionReason: string): Promise<IOffboarding>;
    /**
     * Withdraw resignation
     */
    static withdrawResignation(offboardingId: string): Promise<IOffboarding>;
    /**
     * Complete offboarding
     */
    static completeOffboarding(offboardingId: string): Promise<IOffboarding>;
    /**
     * Update clearance status
     */
    static updateClearance(offboardingId: string, clearanceType: 'assetReturn' | 'itClearance' | 'financeClearance' | 'hrClearance', status: 'PENDING' | 'COMPLETED', notes?: string): Promise<IOffboarding>;
    /**
     * Schedule exit interview
     */
    static scheduleExitInterview(offboardingId: string, exitInterviewDate: string, exitInterviewNotes?: string): Promise<IOffboarding>;
    /**
     * Get pending resignations
     */
    static getPendingResignations(): Promise<IOffboarding[]>;
    /**
     * Get notice period employees
     */
    static getNoticePeriodEmployees(): Promise<IOffboarding[]>;
    /**
     * Get offboarding statistics
     */
    static getStats(month?: number, year?: number): Promise<{
        stats: any;
        pending: number;
        noticePeriod: number;
        total: any;
    }>;
}
//# sourceMappingURL=offboarding.service.d.ts.map