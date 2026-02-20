"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OffboardingController = void 0;
const offboarding_service_1 = require("./offboarding.service");
const response_1 = require("../../../../shared/utils/response");
/**
 * Offboarding Controller
 */
class OffboardingController {
    /**
     * Create resignation request
     * POST /api/v1/hr/offboarding
     */
    static async createResignation(req, res, next) {
        try {
            const resignationData = req.body;
            const createdBy = req.user?.id;
            const offboarding = await offboarding_service_1.OffboardingService.createResignation(resignationData, createdBy);
            (0, response_1.sendSuccessResponse)(res, 'Resignation request created successfully', offboarding);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get all resignations
     * GET /api/v1/hr/offboarding
     */
    static async getAllResignations(req, res, next) {
        try {
            const { status, search, page, limit, sortBy, sortOrder } = req.query;
            const filters = {};
            if (status)
                filters.status = status;
            const options = {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                sortBy: sortBy || 'resignationDate',
                sortOrder: sortOrder || 'desc'
            };
            const result = await offboarding_service_1.OffboardingService.getAllResignations(filters, options);
            (0, response_1.sendSuccessResponse)(res, 'Resignations retrieved successfully', result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get resignation by ID
     * GET /api/v1/hr/offboarding/:id
     */
    static async getResignationById(req, res, next) {
        try {
            const { id } = req.params;
            const offboarding = await offboarding_service_1.OffboardingService.getResignationById(id);
            (0, response_1.sendSuccessResponse)(res, 'Resignation retrieved successfully', offboarding);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update resignation
     * PUT /api/v1/hr/offboarding/:id
     */
    static async updateResignation(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const offboarding = await offboarding_service_1.OffboardingService.updateResignation(id, updateData);
            (0, response_1.sendSuccessResponse)(res, 'Resignation updated successfully', offboarding);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Delete resignation
     * DELETE /api/v1/hr/offboarding/:id
     */
    static async deleteResignation(req, res, next) {
        try {
            const { id } = req.params;
            await offboarding_service_1.OffboardingService.deleteResignation(id);
            (0, response_1.sendSuccessResponse)(res, 'Resignation deleted successfully');
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Approve resignation
     * POST /api/v1/hr/offboarding/:id/approve
     */
    static async approveResignation(req, res, next) {
        try {
            const { id } = req.params;
            const { hrNotes } = req.body;
            const approvedBy = req.user?.id;
            const offboarding = await offboarding_service_1.OffboardingService.approveResignation(id, approvedBy, hrNotes);
            (0, response_1.sendSuccessResponse)(res, 'Resignation approved successfully', offboarding);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Reject resignation
     * POST /api/v1/hr/offboarding/:id/reject
     */
    static async rejectResignation(req, res, next) {
        try {
            const { id } = req.params;
            const { rejectionReason } = req.body;
            const rejectedBy = req.user?.id;
            const offboarding = await offboarding_service_1.OffboardingService.rejectResignation(id, rejectedBy, rejectionReason);
            (0, response_1.sendSuccessResponse)(res, 'Resignation rejected successfully', offboarding);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Withdraw resignation
     * POST /api/v1/hr/offboarding/:id/withdraw
     */
    static async withdrawResignation(req, res, next) {
        try {
            const { id } = req.params;
            const offboarding = await offboarding_service_1.OffboardingService.withdrawResignation(id);
            (0, response_1.sendSuccessResponse)(res, 'Resignation withdrawn successfully', offboarding);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Complete offboarding
     * POST /api/v1/hr/offboarding/:id/complete
     */
    static async completeOffboarding(req, res, next) {
        try {
            const { id } = req.params;
            const offboarding = await offboarding_service_1.OffboardingService.completeOffboarding(id);
            (0, response_1.sendSuccessResponse)(res, 'Offboarding completed successfully', offboarding);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update clearance
     * PUT /api/v1/hr/offboarding/:id/clearance
     */
    static async updateClearance(req, res, next) {
        try {
            const { id } = req.params;
            const { clearanceType, status, notes } = req.body;
            const offboarding = await offboarding_service_1.OffboardingService.updateClearance(id, clearanceType, status, notes);
            (0, response_1.sendSuccessResponse)(res, 'Clearance updated successfully', offboarding);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get pending resignations
     * GET /api/v1/hr/offboarding/pending
     */
    static async getPendingResignations(req, res, next) {
        try {
            const resignations = await offboarding_service_1.OffboardingService.getPendingResignations();
            (0, response_1.sendSuccessResponse)(res, 'Pending resignations retrieved successfully', resignations);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get notice period employees
     * GET /api/v1/hr/offboarding/notice-period
     */
    static async getNoticePeriodEmployees(req, res, next) {
        try {
            const employees = await offboarding_service_1.OffboardingService.getNoticePeriodEmployees();
            (0, response_1.sendSuccessResponse)(res, 'Notice period employees retrieved successfully', employees);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get statistics
     * GET /api/v1/hr/offboarding/stats
     */
    static async getStats(req, res, next) {
        try {
            const { month, year } = req.query;
            const stats = await offboarding_service_1.OffboardingService.getStats(month ? parseInt(month) : undefined, year ? parseInt(year) : undefined);
            (0, response_1.sendSuccessResponse)(res, 'Statistics retrieved successfully', stats);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.OffboardingController = OffboardingController;
//# sourceMappingURL=offboarding.controller.js.map