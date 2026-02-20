"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const user_service_1 = require("./user.service");
const response_1 = require("../../../../shared/utils/response");
const constants_1 = require("../../../../config/constants");
class UserController {
    /**
     * Create new user
     */
    async createUser(req, res, next) {
        try {
            const user = await user_service_1.userService.createUser(req.body);
            (0, response_1.sendSuccessResponse)(res, 'User created successfully', user, constants_1.HTTP_STATUS.CREATED);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
    /**
     * Get user by ID
     */
    async getUserById(req, res, next) {
        try {
            const user = await user_service_1.userService.getUserById(req.params.id);
            (0, response_1.sendSuccessResponse)(res, 'User retrieved successfully', user);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.NOT_FOUND);
        }
    }
    /**
     * Get all users
     */
    async getAllUsers(req, res, next) {
        try {
            const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = req.query;
            const result = await user_service_1.userService.getAllUsers(filters, {
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
    /**
     * Update user
     */
    async updateUser(req, res, next) {
        try {
            const user = await user_service_1.userService.updateUser(req.params.id, req.body);
            (0, response_1.sendSuccessResponse)(res, 'User updated successfully', user);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
    /**
     * Delete user
     */
    async deleteUser(req, res, next) {
        try {
            await user_service_1.userService.deleteUser(req.params.id);
            (0, response_1.sendSuccessResponse)(res, 'User deleted successfully');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.NOT_FOUND);
        }
    }
    /**
     * Get users by department
     */
    async getUsersByDepartment(req, res, next) {
        try {
            const users = await user_service_1.userService.getUsersByDepartment(req.params.departmentId);
            (0, response_1.sendSuccessResponse)(res, 'Users retrieved successfully', users);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    /**
     * Search users
     */
    async searchUsers(req, res, next) {
        try {
            const { q } = req.query;
            const users = await user_service_1.userService.searchUsers(q);
            (0, response_1.sendSuccessResponse)(res, 'Search results retrieved successfully', users);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    /**
     * Get user statistics
     */
    async getUserStats(req, res, next) {
        try {
            const stats = await user_service_1.userService.getUserStats();
            (0, response_1.sendSuccessResponse)(res, 'Statistics retrieved successfully', stats);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
}
exports.UserController = UserController;
exports.userController = new UserController();
//# sourceMappingURL=user.controller.js.map