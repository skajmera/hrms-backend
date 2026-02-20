"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const user_dal_1 = require("../../../../shared/dal/user.dal");
const leave_dal_1 = require("../../../../shared/dal/leave.dal");
class UserService {
    /**
     * Create new user
     */
    async createUser(userData) {
        // Check if email exists
        const existingUser = await user_dal_1.userDAL.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        // Check if employee ID exists
        const existingEmployeeId = await user_dal_1.userDAL.findByEmployeeId(userData.professionalDetails.employeeId);
        if (existingEmployeeId) {
            throw new Error('Employee ID already exists');
        }
        if (!userData?.password) {
            const GeneratedPassword = Math.random().toString(36).slice(-8) + 'A1@'; // Generate a random 8-character password with complexity
            userData.password = GeneratedPassword;
        }
        console.log(`Generated password for new user: ${userData.password}`);
        const user = await user_dal_1.userDAL.create(userData);
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
}
exports.UserService = UserService;
exports.userService = new UserService();
//# sourceMappingURL=user.service.js.map