import { attendanceDAL } from '../../../../shared/dal/attendance.dal';
import { leaveDAL } from '../../../../shared/dal/leave.dal';
import { announcementDAL } from '../../../../shared/dal/announcement.dal';

export class EmployeeDashboardService {
  async getMyDashboard(userId: string, userRole: string, userDepartment: string) {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // Get attendance summary
    const attendanceStats = await attendanceDAL.getUserAttendanceStats(userId, currentMonth, currentYear);

    // Get leave balance
    const leaveBalance = await leaveDAL.getLeaveBalance(userId, currentYear);

    // Get pending leaves
    const myLeaves = await leaveDAL.findAll({ userId, status: 'PENDING' }, {});

    // Get announcements
    const announcements = await announcementDAL.getActiveAnnouncementsForUser(userId, userRole, userDepartment);

    return {
      attendance: attendanceStats,
      leaveBalance,
      pendingLeaves: myLeaves.total,
      announcements: announcements.slice(0, 5)
    };
  }
}

export const employeeDashboardService = new EmployeeDashboardService();