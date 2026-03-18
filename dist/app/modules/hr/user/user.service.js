"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const user_dal_1 = require("../../../../shared/dal/user.dal");
const leave_dal_1 = require("../../../../shared/dal/leave.dal");
const email_1 = require("../../../../shared/utils/email");
class UserService {
    /**
     * Create new user
     */
    async createUser(userData) {
        // Clean empty strings for unique fields to avoid duplicate-key errors
        const uniqueFields = ['email', 'personalEmail', 'adhaarNumber', 'panNumber'];
        uniqueFields.forEach(field => {
            if (userData[field] === '' || userData[field] === null) {
                delete userData[field];
            }
        });
        let draftUser = (userData._id || userData.id) ? await user_dal_1.userDAL.findById(userData._id || userData.id) : null;
        if (draftUser && draftUser.professionalDetails?.employmentStatus !== 'DRAFT') {
            throw new Error('User already exists and is not a draft');
        }
        const checkExisting = async (value, finder, errorMsg) => {
            if (!value)
                return;
            const existing = await finder(value);
            if (existing) {
                if (draftUser && draftUser._id.toString() !== existing._id.toString())
                    throw new Error(errorMsg);
                if (!draftUser) {
                    if (existing.professionalDetails?.employmentStatus === 'DRAFT')
                        draftUser = existing;
                    else
                        throw new Error(errorMsg);
                }
            }
        };
        await checkExisting(userData.email, (v) => user_dal_1.userDAL.findByEmail(v), 'User with this email already exists');
        if (userData.professionalDetails?.employeeId) {
            await checkExisting(userData.professionalDetails.employeeId, (v) => user_dal_1.userDAL.findByEmployeeId(v), 'Employee ID already exists');
        }
        let generatedPassword = '';
        if (!userData?.password && (!draftUser || !draftUser.password)) {
            generatedPassword = Math.random().toString(36).slice(-8) + 'A1@'; // Generate a random 8-character password with complexity
            userData.password = generatedPassword;
            console.log(`Generated password for new user: ${userData.password}`);
        }
        if (!userData.professionalDetails)
            userData.professionalDetails = {};
        if (userData.professionalDetails.employmentStatus === 'DRAFT' || !draftUser) {
            userData.professionalDetails.employmentStatus = 'ACTIVE';
        }
        userData.role = userData.role || 'EMPLOYEE';
        let user;
        if (draftUser) {
            const { _id, id, ...updateData } = userData;
            user = await user_dal_1.userDAL.update(draftUser._id.toString(), updateData);
        }
        else {
            user = await user_dal_1.userDAL.create(userData);
        }
        if (!user)
            throw new Error('Failed to create or update user');
        // Send welcome email asynchronously so it doesn't block the response
        if (user.email && (generatedPassword || userData.password)) {
            (0, email_1.sendWelcomeEmail)(user.firstName, user.email, generatedPassword || userData.password).catch(err => {
                console.error('Failed to send welcome email:', err);
            });
        }
        // ✅ CREATE INITIAL LEAVE BALANCE
        const currentYear = new Date().getFullYear();
        await leave_dal_1.leaveDAL.upsertLeaveBalance(user._id.toString(), currentYear, {
            userId: user._id.toString(),
            year: currentYear,
            casualLeave: { total: 12, used: 0, remaining: 12 },
            sickLeave: { total: 10, used: 0, remaining: 10 },
            earnedLeave: { total: 15, used: 0, remaining: 15 },
            maternityLeave: { total: 180, used: 0, remaining: 180 },
            paternityLeave: { total: 15, used: 0, remaining: 15 }
        });
        return user;
    }
    /**
     * Create draft user
     */
    async createDraftEmployee(userData) {
        // Prevent MongoDB unique sparse index duplicate key errors for empty string inputs
        const uniqueFields = ['email', 'personalEmail', 'adhaarNumber', 'panNumber'];
        uniqueFields.forEach(field => {
            if (userData[field] === '' || userData[field] === null) {
                delete userData[field];
            }
        });
        if (userData.professionalDetails && userData.professionalDetails.employeeId === '') {
            delete userData.professionalDetails.employeeId;
        }
        let draftUser = (userData._id || userData.id) ? await user_dal_1.userDAL.findById(userData._id || userData.id) : null;
        if (draftUser && draftUser.professionalDetails?.employmentStatus !== 'DRAFT') {
            throw new Error('Cannot update a non-draft employee through this endpoint');
        }
        const checkExisting = async (value, finder, errorMsg) => {
            if (!value)
                return;
            const existing = await finder(value);
            if (existing) {
                if (draftUser && draftUser._id.toString() !== existing._id.toString())
                    throw new Error(errorMsg);
                if (!draftUser) {
                    if (existing.professionalDetails?.employmentStatus === 'DRAFT')
                        draftUser = existing;
                    else
                        throw new Error(errorMsg);
                }
            }
        };
        await checkExisting(userData.email, (v) => user_dal_1.userDAL.findByEmail(v), 'User with this email already exists');
        await checkExisting(userData.professionalDetails?.employeeId, (v) => user_dal_1.userDAL.findByEmployeeId(v), 'Employee ID already exists');
        // Set draft status
        if (!userData.professionalDetails) {
            userData.professionalDetails = {};
        }
        userData.professionalDetails.employmentStatus = 'DRAFT';
        // Always set role to EMPLOYEE for drafts if not provided
        if (!userData.role) {
            userData.role = 'EMPLOYEE';
        }
        if (draftUser) {
            const { _id, id, ...updateData } = userData;
            return await user_dal_1.userDAL.update(draftUser._id.toString(), updateData);
        }
        return await user_dal_1.userDAL.create(userData);
    }
    /**
     * Get all draft employees
     */
    async getDraftEmployees(options) {
        const filters = {
            'professionalDetails.employmentStatus': 'DRAFT'
        };
        return await user_dal_1.userDAL.findAll(filters, options);
    }
    /**
     * Get user by ID
     */
    async getUserById(id) {
        const user = await user_dal_1.userDAL.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    /**
     * Get all users
     */
    async getAllUsers(filters = {}, options) {
        return await user_dal_1.userDAL.findAll(filters, options);
    }
    /**
     * Get all users including drafts
     */
    async getAllUsersWithDrafts(filters = {}, options) {
        return await user_dal_1.userDAL.findAllWithDrafts(filters, options);
    }
    /**
     * Update user
     */
    async updateUser(id, updateData) {
        const user = await user_dal_1.userDAL.update(id, updateData);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    /**
     * Delete user (soft delete)
     */
    async deleteUser(id) {
        const user = await user_dal_1.userDAL.delete(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    /**
     * Delete draft employee
     */
    async deleteDraftEmployee(id) {
        const user = await user_dal_1.userDAL.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        if (user.professionalDetails?.employmentStatus !== 'DRAFT') {
            throw new Error('Only draft employees can be deleted using this endpoint');
        }
        return await user_dal_1.userDAL.hardDelete(id);
    }
    /**
     * Get users by department
     */
    async getUsersByDepartment(departmentId) {
        return await user_dal_1.userDAL.findByDepartment(departmentId);
    }
    /**
     * Get users by role
     */
    async getUsersByRole(role) {
        return await user_dal_1.userDAL.findByRole(role);
    }
    /**
     * Search users
     */
    async searchUsers(searchTerm) {
        return await user_dal_1.userDAL.search(searchTerm);
    }
    /**
     * Get user statistics
     */
    async getUserStats() {
        return await user_dal_1.userDAL.getUserStats();
    }
    /**
     * Get user by employee ID
     */
    async getUserByEmployeeId(employeeId) {
        const user = await user_dal_1.userDAL.findByEmployeeId(employeeId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    /**
     * Clear registered device ID for a user
     */
    async clearUserDevice(id) {
        const user = await user_dal_1.userDAL.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return await user_dal_1.userDAL.update(id, { $unset: { registeredDeviceId: "" } });
    }
    /**
     * Upload user avatar using base64 or file path
     */
    async uploadAvatar(userId, imageUrl) {
        return await user_dal_1.userDAL.update(userId, { profilePicture: imageUrl });
    }
    /**
     * Add FCM Device Token for Push Notifications
     */
    async addFcmToken(userId, token) {
        const user = await user_dal_1.userDAL.update(userId, { $addToSet: { fcmTokens: token } });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
//# sourceMappingURL=user.service.js.map