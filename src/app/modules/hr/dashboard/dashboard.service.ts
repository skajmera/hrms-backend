import { userDAL } from '../../../../shared/dal/user.dal';
import { attendanceDAL } from '../../../../shared/dal/attendance.dal';
import { leaveDAL } from '../../../../shared/dal/leave.dal';
import { announcementDAL } from '../../../../shared/dal/announcement.dal';

export class DashboardService {
  async getDashboardStats() {
    const totalUsers = await userDAL.findAll({ isActive: true });
    const todayAttendance = await attendanceDAL.getTodayAttendance();
    const pendingLeaves = await leaveDAL.getPendingLeaves();
    const employeesOnLeave = await leaveDAL.getEmployeesOnLeaveToday();
    const getYetToCheckInCount = await userDAL.getYetToCheckInCount();

    const presentCount = todayAttendance.filter(a => a.status === 'PRESENT').length;
    const absentCount = todayAttendance.filter(a => a.status === 'ABSENT').length;
    const lateCount = todayAttendance.filter(a => a.isLate).length;
    const wfhCount = todayAttendance.filter(a => a.status === 'WFH').length;

    const newHires = await userDAL.getNewHires(30);
    return {
      totalEmployees: totalUsers.total,
      attendance: {
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        wfh: wfhCount,
        onLeave: employeesOnLeave.length,
        getYetToCheckInCount: getYetToCheckInCount
      },
      leaves: {
        pending: pendingLeaves.length,
        onLeaveToday: employeesOnLeave.length
      },
      newHires: newHires.length
    };
  }

  async getBirthdays() {
    return await userDAL.getBirthdaysToday();
  }

  async getNewHires(days: number = 30) {
    return await userDAL.getNewHires(days);
  }

  async getRecentAnnouncements(userId: string, userRole: string, userDepartment: string) {
    return await announcementDAL.getActiveAnnouncementsForUser(userId, userRole, userDepartment);
  }


  async getAnniversary() {
    return await userDAL.getAnniversaryToday();
  }
}

export const dashboardService = new DashboardService();