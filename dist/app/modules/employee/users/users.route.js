"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../../hr/user/user.controller");
const auth_middleware_1 = require("../../../../shared/middlewares/auth.middleware");
const validation_1 = require("../../../../shared/middlewares/validation");
const constants_1 = require("../../../../config/constants");
const user_validation_1 = require("../../hr/user/user.validation");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.use((0, auth_middleware_1.authorize)(constants_1.USER_ROLES.EMPLOYEE, constants_1.USER_ROLES.MANAGER, constants_1.USER_ROLES.HR_ADMIN, constants_1.USER_ROLES.SUPER_ADMIN));
// Ensure employees don't accidentally see admin roles and default to active users
const restrictEmployeeView = (req, res, next) => {
    const baseExcluded = ['SUPER_ADMIN', 'HR_ADMIN'];
    const existing = typeof req.query.excludeRole === 'string'
        ? req.query.excludeRole.split(',').map((r) => r.trim()).filter(Boolean)
        : [];
    const merged = Array.from(new Set([...baseExcluded, ...existing]));
    req.query.excludeRole = merged.join(',');
    if (typeof req.query.isActive === 'undefined') {
        req.query.isActive = 'true';
    }
    next();
};
router.get('/', restrictEmployeeView, (0, validation_1.validate)(user_validation_1.queryUsersValidation), user_controller_1.userController.getAllUsers.bind(user_controller_1.userController));
router.get('/search', restrictEmployeeView, user_controller_1.userController.searchUsers.bind(user_controller_1.userController));
router.get('/department/:departmentId', restrictEmployeeView, user_controller_1.userController.getUsersByDepartment.bind(user_controller_1.userController));
exports.default = router;
//# sourceMappingURL=users.route.js.map