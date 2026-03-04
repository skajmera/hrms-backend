"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeProfileController = exports.EmployeeProfileController = void 0;
const profile_service_1 = require("./profile.service");
const response_1 = require("../../../../shared/utils/response");
const constants_1 = require("../../../../config/constants");
class EmployeeProfileController {
    async getMyProfile(req, res, next) {
        try {
            const user = await profile_service_1.employeeProfileService.getMyProfile(req.user._id.toString());
            (0, response_1.sendSuccessResponse)(res, 'Profile retrieved successfully', user);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.NOT_FOUND);
        }
    }
    async updateMyProfile(req, res, next) {
        try {
            const user = await profile_service_1.employeeProfileService.updateMyProfile(req.user._id.toString(), req.body);
            (0, response_1.sendSuccessResponse)(res, 'Profile updated successfully', user);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
    async changePassword(req, res, next) {
        try {
            const { currentPassword, newPassword } = req.body;
            await profile_service_1.employeeProfileService.changePassword(req.user._id.toString(), currentPassword, newPassword);
            (0, response_1.sendSuccessResponse)(res, 'Password changed successfully');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
    /**
     * Get all users
     */
    async getAllUsers(req, res, next) {
        try {
            const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = req.query;
            filters.role = 'employee';
            filters.isActive = true;
            const result = await profile_service_1.employeeProfileService.getAllUsers(filters, {
                page: Number(page),
                limit: Number(limit),
                sortBy: sortBy,
                sortOrder: sortOrder
            });
            (0, response_1.sendPaginatedResponse)(res, result.users, result.total, Number(page), Number(limit), 'Users retrieved successfully');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
}
exports.EmployeeProfileController = EmployeeProfileController;
exports.employeeProfileController = new EmployeeProfileController();
//# sourceMappingURL=profile.controller.js.map