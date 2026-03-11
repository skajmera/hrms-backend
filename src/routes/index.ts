import { Router } from 'express';

// Auth
import authRoutes from '../app/modules/auth/auth.route';
import organizationRoutes from '../app/modules/organization/organization.route';
import settingsRoutes from '../app/modules/settings/settings.route';
// Employee
import employeeProfileRoutes from '../app/modules/employee/profile/profile.route';
import employeeAttendanceRoutes from '../app/modules/employee/attendance/attendance.route';
import employeeLeaveRoutes from '../app/modules/employee/leave/leave.route';
import employeePayrollRoutes from '../app/modules/employee/payroll/payroll.route';
import employeeDashboardRoutes from '../app/modules/employee/dashboard/dashboard.route';

// Manager
import managerTeamRoutes from '../app/modules/manager/team/team.route';
import managerLeaveRoutes from '../app/modules/manager/leave/leave.route';
import managerReportsRoutes from '../app/modules/manager/reports/reports.route';

// HR
import userRoutes from '../app/modules/hr/user/user.route';
import attendanceRoutes from '../app/modules/hr/attendance/attendance.route';
import leaveRoutes from '../app/modules/hr/leave/leave.route';
import payrollRoutes from '../app/modules/hr/payroll/payroll.route';
import announcementRoutes from '../app/modules/hr/announcement/announcement.route';
import departmentRoutes from '../app/modules/hr/department/department.route';
import dashboardRoutes from '../app/modules/hr/dashboard/dashboard.route';
import reportsRoutes from '../app/modules/hr/reports/reports.route';
import holidaysRoutes from '../app/modules/hr/holidays/holidays.route';
import analyticsRoutes from '../app/modules/hr/analytics/analytics.route';
import shiftsRoutes from '../app/modules/hr/shifts/shifts.route';
import permissionsRoutes from '../app/modules/hr/permissions/permissions.route'; // NEW
import offboardingRoutes from '../app/modules/hr/offboarding/offboarding.route'; // NEW

const router = Router();

// Auth routes
router.use('/auth', authRoutes);
router.use('/organization', organizationRoutes);
router.use('/settings', settingsRoutes);
// Employee routes (Self-service)
router.use('/employee/profile', employeeProfileRoutes);
router.use('/employee/attendance', employeeAttendanceRoutes);
router.use('/employee/leave', employeeLeaveRoutes);
router.use('/employee/payroll', employeePayrollRoutes);
router.use('/employee/dashboard', employeeDashboardRoutes);

// Manager routes (Team management)
router.use('/manager/team', managerTeamRoutes);
router.use('/manager/leave', managerLeaveRoutes);
router.use('/manager/reports', managerReportsRoutes);

// HR routes (Admin operations)
router.use('/hr/users', userRoutes);
router.use('/hr/attendance', attendanceRoutes);
router.use('/hr/leave', leaveRoutes);
router.use('/leaves', leaveRoutes);
router.use('/hr/payroll', payrollRoutes);
router.use('/hr/announcements', announcementRoutes);
router.use('/hr/departments', departmentRoutes);
router.use('/hr/dashboard', dashboardRoutes);
router.use('/hr/reports', reportsRoutes);
router.use('/hr/holidays', holidaysRoutes);
router.use('/hr/analytics', analyticsRoutes);
router.use('/hr/shifts', shiftsRoutes);
router.use('/hr/permissions', permissionsRoutes); // Permissions routes
router.use('/hr/offboarding', offboardingRoutes); // NEW
router.use('/attendance', attendanceRoutes);


export default router;

