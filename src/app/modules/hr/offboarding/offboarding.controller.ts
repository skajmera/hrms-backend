import { Request, Response, NextFunction } from 'express';
import { OffboardingService } from './offboarding.service';
import { sendSuccessResponse } from '../../../../shared/utils/response';
import { HTTP_STATUS } from '../../../../config/constants';
import { AuthRequest } from '../../../../shared/middlewares/auth.middleware';
/**
 * Offboarding Controller
 */

export class OffboardingController {
  /**
   * Create resignation request
   * POST /api/v1/hr/offboarding
   */
  static async createResignation(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const resignationData = req.body;
      const createdBy = req.user?.id;

      const offboarding = await OffboardingService.createResignation(resignationData, createdBy);

      sendSuccessResponse(res, 'Resignation request created successfully',
         offboarding
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all resignations
   * GET /api/v1/hr/offboarding
   */
  static async getAllResignations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, search, page, limit, sortBy, sortOrder } = req.query;

      const filters: any = {};
      if (status) filters.status = status;

      const options = {
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 10,
        sortBy: (sortBy as string) || 'resignationDate',
        sortOrder: (sortOrder as 'asc' | 'desc') || 'desc'
      };

      const result = await OffboardingService.getAllResignations(filters, options);

      sendSuccessResponse(res, 'Resignations retrieved successfully',
       result
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get resignation by ID
   * GET /api/v1/hr/offboarding/:id
   */
  static async getResignationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const offboarding = await OffboardingService.getResignationById(id);

      sendSuccessResponse(res, 'Resignation retrieved successfully',
        offboarding
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update resignation
   * PUT /api/v1/hr/offboarding/:id
   */
  static async updateResignation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const offboarding = await OffboardingService.updateResignation(id, updateData);

      sendSuccessResponse(res,'Resignation updated successfully',
        offboarding
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete resignation
   * DELETE /api/v1/hr/offboarding/:id
   */
  static async deleteResignation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await OffboardingService.deleteResignation(id);

      sendSuccessResponse(res, 'Resignation deleted successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Approve resignation
   * POST /api/v1/hr/offboarding/:id/approve
   */
  static async approveResignation(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { hrNotes } = req.body;
      const approvedBy = req.user?.id;

      const offboarding = await OffboardingService.approveResignation(id, approvedBy, hrNotes);

      sendSuccessResponse(res,'Resignation approved successfully',
         offboarding
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reject resignation
   * POST /api/v1/hr/offboarding/:id/reject
   */
  static async rejectResignation(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { rejectionReason } = req.body;
      const rejectedBy = req.user?.id;

      const offboarding = await OffboardingService.rejectResignation(id, rejectedBy, rejectionReason);

      sendSuccessResponse(res,'Resignation rejected successfully',
         offboarding
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Withdraw resignation
   * POST /api/v1/hr/offboarding/:id/withdraw
   */
  static async withdrawResignation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const offboarding = await OffboardingService.withdrawResignation(id);

      sendSuccessResponse(res,'Resignation withdrawn successfully',
         offboarding
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Complete offboarding
   * POST /api/v1/hr/offboarding/:id/complete
   */
  static async completeOffboarding(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const offboarding = await OffboardingService.completeOffboarding(id);

      sendSuccessResponse(res, 'Offboarding completed successfully',
         offboarding
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update clearance
   * PUT /api/v1/hr/offboarding/:id/clearance
   */
  static async updateClearance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { clearanceType, status, notes } = req.body;

      const offboarding = await OffboardingService.updateClearance(id, clearanceType, status, notes);

      sendSuccessResponse(res, 'Clearance updated successfully',
        offboarding
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get pending resignations
   * GET /api/v1/hr/offboarding/pending
   */
  static async getPendingResignations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resignations = await OffboardingService.getPendingResignations();

      sendSuccessResponse(res, 'Pending resignations retrieved successfully',
        resignations
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get notice period employees
   * GET /api/v1/hr/offboarding/notice-period
   */
  static async getNoticePeriodEmployees(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const employees = await OffboardingService.getNoticePeriodEmployees();

      sendSuccessResponse(res,  'Notice period employees retrieved successfully',
        employees
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get statistics
   * GET /api/v1/hr/offboarding/stats
   */
  static async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { month, year } = req.query;
      
      const stats = await OffboardingService.getStats(
        month ? parseInt(month as string) : undefined,
        year ? parseInt(year as string) : undefined
      );

      sendSuccessResponse(res, 'Statistics retrieved successfully',
         stats
      );
    } catch (error) {
      next(error);
    }
  }
}