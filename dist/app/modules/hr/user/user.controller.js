"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const user_service_1 = require("./user.service");
const response_1 = require("../../../../shared/utils/response");
const constants_1 = require("../../../../config/constants");
const imageCompressor_1 = require("../../../../shared/utils/imageCompressor");
// When form is sent as multipart/form-data, nested JSON fields arrive as strings — parse them back.
const JSON_FIELDS = ['education', 'experience', 'currentAddress', 'permanentAddress', 'professionalDetails', 'separationInfo', 'bankDetails', 'emergencyContact', 'documents'];
const parseJsonFields = (body) => {
    for (const field of JSON_FIELDS) {
        if (typeof body[field] === 'string') {
            try {
                body[field] = JSON.parse(body[field]);
            }
            catch { /* leave as-is if not valid JSON */ }
        }
    }
    return body;
};
class UserController {
    /**
     * Create new user
     */
    async createUser(req, res, next) {
        try {
            console.log('[CreateEmployee][RawBody]', { body: req.body, files: req.files, file: req.file });
            const createData = parseJsonFields(req.body);
            console.log('[CreateEmployee][ParsedPayload]', { education: createData.education, experience: createData.experience });
            createData.createdBy = req.user._id.toString();
            if (!createData.organizationId && req.user?.organizationId)
                createData.organizationId = req.user.organizationId;
            if (req.file) {
                await (0, imageCompressor_1.compressImageIfNeeded)(req.file.path, req.file.mimetype);
                createData.profilePicture = `/${req.file.path.replace(/\\/g, '/')}`;
            }
            const user = await user_service_1.userService.createUser(createData);
            (0, response_1.sendSuccessResponse)(res, 'User created successfully', user, constants_1.HTTP_STATUS.CREATED);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
    /**
     * Create draft user
     */
    async createDraftEmployee(req, res, next) {
        try {
            const createData = parseJsonFields(req.body);
            createData.createdBy = req.user._id.toString();
            if (!createData.organizationId && req.user?.organizationId)
                createData.organizationId = req.user.organizationId;
            if (req.file) {
                await (0, imageCompressor_1.compressImageIfNeeded)(req.file.path, req.file.mimetype);
                createData.profilePicture = `/${req.file.path.replace(/\\/g, '/')}`;
            }
            const user = await user_service_1.userService.createDraftEmployee(createData);
            (0, response_1.sendSuccessResponse)(res, 'Draft user created successfully', user, constants_1.HTTP_STATUS.CREATED);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
    /**
     * Get all draft employees
     */
    async getDraftEmployees(req, res, next) {
        try {
            const { page, limit, sortBy, sortOrder } = req.query;
            const options = {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                sortBy: sortBy || 'createdAt',
                sortOrder: sortOrder || 'desc'
            };
            const { users, total } = await user_service_1.userService.getDraftEmployees(options);
            (0, response_1.sendPaginatedResponse)(res, users, total, options.page, options.limit, 'Draft employees retrieved successfully');
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
            const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', excludeRole, status, ...filters } = req.query;
            const rawExclude = excludeRole || 'SUPER_ADMIN';
            if (rawExclude) {
                const rolesToExclude = rawExclude.split(',').map(r => r.trim().toUpperCase()).filter(Boolean);
                if (rolesToExclude.length) {
                    filters.role = { $nin: rolesToExclude };
                }
            }
            if (status)
                filters['professionalDetails.employmentStatus'] = String(status).trim().toUpperCase();
            const result = await user_service_1.userService.getAllUsersWithDrafts(filters, {
                page: Number(page),
                limit: Number(limit),
                sortBy: sortBy,
                sortOrder: sortOrder
            });
            const dataWithStatus = result.users.map((u) => ({
                ...u.toObject?.() ?? u,
                status: u.professionalDetails?.employmentStatus || 'ACTIVE'
            }));
            (0, response_1.sendPaginatedResponse)(res, dataWithStatus, result.total, Number(page), Number(limit), 'Users retrieved successfully');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message);
        }
    }
    /**
     * Get all users including drafts, with status field
     */
    async getAllUsersWithDraft(req, res, next) {
        try {
            const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', excludeRole, ...filters } = req.query;
            const rawExclude = excludeRole || 'SUPER_ADMIN';
            if (rawExclude) {
                const rolesToExclude = rawExclude.split(',').map(r => r.trim().toUpperCase()).filter(Boolean);
                if (rolesToExclude.length) {
                    filters.role = { $nin: rolesToExclude };
                }
            }
            const result = await user_service_1.userService.getAllUsersWithDrafts(filters, {
                page: Number(page),
                limit: Number(limit),
                sortBy: sortBy,
                sortOrder: sortOrder
            });
            const dataWithStatus = result.users.map((u) => ({
                ...u.toObject?.() ?? u,
                status: u.professionalDetails?.employmentStatus || 'ACTIVE'
            }));
            (0, response_1.sendPaginatedResponse)(res, dataWithStatus, result.total, Number(page), Number(limit), 'Users (including drafts) retrieved successfully');
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
            console.log('[UpdateEmployee][RawBody]', { params: req.params, body: req.body, files: req.files, file: req.file });
            const updateData = parseJsonFields(req.body);
            console.log('[UpdateEmployee][ParsedPayload]', { education: updateData.education, experience: updateData.experience });
            updateData.updatedBy = req.user._id.toString();
            if (!updateData.organizationId && req.user?.organizationId)
                updateData.organizationId = req.user.organizationId;
            if (req.file) {
                await (0, imageCompressor_1.compressImageIfNeeded)(req.file.path, req.file.mimetype);
                updateData.profilePicture = `/${req.file.path.replace(/\\/g, '/')}`;
            }
            const user = await user_service_1.userService.updateUser(req.params.id, updateData);
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
     * Delete draft employee
     */
    async deleteDraftEmployee(req, res, next) {
        try {
            await user_service_1.userService.deleteDraftEmployee(req.params.id);
            (0, response_1.sendSuccessResponse)(res, 'Draft employee deleted successfully');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, error.message === 'User not found' ? constants_1.HTTP_STATUS.NOT_FOUND : constants_1.HTTP_STATUS.BAD_REQUEST);
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
    /**
     * Get user by employee ID
     */
    async getUserByEmployeeId(req, res, next) {
        try {
            const user = await user_service_1.userService.getUserByEmployeeId(req.params.employeeId);
            (0, response_1.sendSuccessResponse)(res, 'User retrieved successfully', user);
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, error.message === 'User not found' ? constants_1.HTTP_STATUS.NOT_FOUND : constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
    /**
     * Clear user registered device
     */
    async clearUserDevice(req, res, next) {
        try {
            await user_service_1.userService.clearUserDevice(req.params.id);
            (0, response_1.sendSuccessResponse)(res, 'Device cleared successfully');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, error.message === 'User not found' ? constants_1.HTTP_STATUS.NOT_FOUND : constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
    /**
     * Upload user profile picture
     */
    async uploadAvatar(req, res, next) {
        try {
            if (!req.file) {
                throw new Error('No file uploaded');
            }
            const imageUrl = `/${req.file.path.replace(/\\/g, '/')}`;
            (0, response_1.sendSuccessResponse)(res, 'Avatar uploaded successfully', {
                imageUrl,
                path: req.file.path.replace(/\\/g, '/')
            });
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
    /**
     * Register Firebase Cloud Messaging Notification Device Token
     */
    async addDeviceToken(req, res, next) {
        try {
            const { token } = req.body;
            if (!token) {
                throw new Error('FCM push token is required');
            }
            const userId = req.user._id.toString();
            await user_service_1.userService.addFcmToken(userId, token);
            (0, response_1.sendSuccessResponse)(res, 'Device push notification token registered successfully');
        }
        catch (error) {
            (0, response_1.sendErrorResponse)(res, error.message, constants_1.HTTP_STATUS.BAD_REQUEST);
        }
    }
}
exports.UserController = UserController;
exports.userController = new UserController();
//# sourceMappingURL=user.controller.js.map