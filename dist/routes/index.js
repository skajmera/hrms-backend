"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Auth
const auth_route_1 = __importDefault(require("../app/modules/auth/auth.route"));
const organization_route_1 = __importDefault(require("../app/modules/organization/organization.route"));
const settings_route_1 = __importDefault(require("../app/modules/settings/settings.route"));
// Employee
const profile_route_1 = __importDefault(require("../app/modules/employee/profile/profile.route"));
const attendance_route_1 = __importDefault(require("../app/modules/employee/attendance/attendance.route"));
const leave_route_1 = __importDefault(require("../app/modules/employee/leave/leave.route"));
const payroll_route_1 = __importDefault(require("../app/modules/employee/payroll/payroll.route"));
const dashboard_route_1 = __importDefault(require("../app/modules/employee/dashboard/dashboard.route"));
// Manager
const team_route_1 = __importDefault(require("../app/modules/manager/team/team.route"));
const leave_route_2 = __importDefault(require("../app/modules/manager/leave/leave.route"));
// HR
const user_route_1 = __importDefault(require("../app/modules/hr/user/user.route"));
const attendance_route_2 = __importDefault(require("../app/modules/hr/attendance/attendance.route"));
const leave_route_3 = __importDefault(require("../app/modules/hr/leave/leave.route"));
const payroll_route_2 = __importDefault(require("../app/modules/hr/payroll/payroll.route"));
const announcement_route_1 = __importDefault(require("../app/modules/hr/announcement/announcement.route"));
const department_route_1 = __importDefault(require("../app/modules/hr/department/department.route"));
const dashboard_route_2 = __importDefault(require("../app/modules/hr/dashboard/dashboard.route"));
const reports_route_1 = __importDefault(require("../app/modules/hr/reports/reports.route"));
const holidays_route_1 = __importDefault(require("../app/modules/hr/holidays/holidays.route"));
const analytics_route_1 = __importDefault(require("../app/modules/hr/analytics/analytics.route"));
const shifts_route_1 = __importDefault(require("../app/modules/hr/shifts/shifts.route"));
const permissions_route_1 = __importDefault(require("../app/modules/hr/permissions/permissions.route")); // NEW
const offboarding_route_1 = __importDefault(require("../app/modules/hr/offboarding/offboarding.route")); // NEW
const router = (0, express_1.Router)();
// Auth routes
router.use('/auth', auth_route_1.default);
router.use('/organization', organization_route_1.default);
router.use('/settings', settings_route_1.default);
// Employee routes (Self-service)
router.use('/employee/profile', profile_route_1.default);
router.use('/employee/attendance', attendance_route_1.default);
router.use('/employee/leave', leave_route_1.default);
router.use('/employee/payroll', payroll_route_1.default);
router.use('/employee/dashboard', dashboard_route_1.default);
// Manager routes (Team management)
router.use('/manager/team', team_route_1.default);
router.use('/manager/leave', leave_route_2.default);
// HR routes (Admin operations)
router.use('/hr/users', user_route_1.default);
router.use('/hr/attendance', attendance_route_2.default);
router.use('/hr/leave', leave_route_3.default);
router.use('/leaves', leave_route_3.default);
router.use('/hr/payroll', payroll_route_2.default);
router.use('/hr/announcements', announcement_route_1.default);
router.use('/hr/departments', department_route_1.default);
router.use('/hr/dashboard', dashboard_route_2.default);
router.use('/hr/reports', reports_route_1.default);
router.use('/hr/holidays', holidays_route_1.default);
router.use('/hr/analytics', analytics_route_1.default);
router.use('/hr/shifts', shifts_route_1.default);
router.use('/hr/permissions', permissions_route_1.default); // Permissions routes
router.use('/hr/offboarding', offboarding_route_1.default); // NEW
router.use('/attendance', attendance_route_2.default);
exports.default = router;
//# sourceMappingURL=index.js.map