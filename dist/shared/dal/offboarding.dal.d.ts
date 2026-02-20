import { FilterQuery } from 'mongoose';
import { IOffboarding } from '../interfaces/offboarding.interface';
import { IPaginationOptions, IPaginatedResponse } from '../interfaces/common.interface';
/**
 * Offboarding Data Access Layer
 */
export declare class OffboardingDAL {
    /**
     * Create resignation request
     */
    static create(offboardingData: Partial<IOffboarding>): Promise<IOffboarding>;
    /**
     * Find offboarding by ID
     */
    static findById(offboardingId: string): Promise<IOffboarding | null>;
    /**
     * Get all offboarding records with pagination
     */
    static findAll(filters?: FilterQuery<IOffboarding>, options?: IPaginationOptions): Promise<IPaginatedResponse<IOffboarding>>;
    /**
     * Update offboarding
     */
    static updateById(offboardingId: string, updateData: Partial<IOffboarding>): Promise<IOffboarding>;
    /**
     * Delete offboarding
     */
    static deleteById(offboardingId: string): Promise<IOffboarding | null>;
    /**
     * Find by user ID
     */
    static findByUserId(userId: string): Promise<IOffboarding | null>;
    /**
     * Get pending resignations
     */
    static getPendingResignations(): Promise<IOffboarding[]>;
    /**
     * Get employees in notice period
     */
    static getNoticePeriodEmployees(): Promise<IOffboarding[]>;
    /**
     * Get offboarding statistics
     */
    static getStats(month?: number, year?: number): Promise<any>;
    /**
     * Count by status
     */
    static countByStatus(status: IOffboarding['status']): Promise<number>;
}
//# sourceMappingURL=offboarding.dal.d.ts.map