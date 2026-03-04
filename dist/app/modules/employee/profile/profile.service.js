"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeProfileService = exports.EmployeeProfileService = void 0;
const user_dal_1 = require("../../../../shared/dal/user.dal");
class EmployeeProfileService {
    /**
     * Get own profile
     */
    async getMyProfile(userId) {
        const user = await user_dal_1.userDAL.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    /**
     * Update own profile
     */
    async updateMyProfile(userId, updateData) {
        // Employees can only update certain fields
        const allowedFields = [
            'phone',
            'alternatePhone',
            'profilePicture',
            'currentAddress',
            'permanentAddress',
            'education',
            'experience',
            'emergencyContact'
        ];
        const sanitizedData = {};
        Object.keys(updateData).forEach(key => {
            if (allowedFields.includes(key)) {
                sanitizedData[key] = updateData[key];
            }
        });
        const user = await user_dal_1.userDAL.update(userId, sanitizedData);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    /**
     * Change password
     */
    async changePassword(userId, currentPassword, newPassword) {
        const user = await user_dal_1.userDAL.findById(userId, true);
        if (!user) {
            throw new Error('User not found');
        }
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            throw new Error('Current password is incorrect');
        }
        user.password = newPassword;
        await user.save();
    }
    /**
     * Get all users
     */
    async getAllUsers(filters = {}, options) {
        return await user_dal_1.userDAL.findAll(filters, options);
    }
}
exports.EmployeeProfileService = EmployeeProfileService;
exports.employeeProfileService = new EmployeeProfileService();
//# sourceMappingURL=profile.service.js.map