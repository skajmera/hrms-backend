import { attendanceDAL } from '../../../../shared/dal/attendance.dal';
import { leaveDAL } from '../../../../shared/dal/leave.dal';
import { announcementDAL } from '../../../../shared/dal/announcement.dal';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';
import { getWorkingDaysForMonth } from '../../../../shared/utils/workingDays';

export class EmployeeDashboardService {
  async getMyDashboard(userId: string, userRole: string, userDepartment: string, organizationId?: string) {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const [attendanceStatsRaw, checkInSummaryRaw, leaveBalance, myLeaves, announcements, workingDays] = await Promise.all([
      attendanceDAL.getUserAttendanceStats(userId, currentMonth, currentYear),
      attendanceDAL.getUserMonthlyCheckInSummary(userId, currentMonth, currentYear),
      leaveDAL.getLeaveBalance(userId, currentYear),
      leaveDAL.findAll({ userId, status: 'PENDING' }, {}),
      announcementDAL.getActiveAnnouncementsForUser(userId, userRole, userDepartment),
      getWorkingDaysForMonth(currentYear, currentMonth, organizationId)
    ]);

    const attendanceStats = (attendanceStatsRaw || []).reduce((acc: any, row: any) => {
      acc[row._id] = row.count;
      return acc;
    }, {});

    const checkInSummary = {
      total: checkInSummaryRaw?.checkin || 0,
      onTime: checkInSummaryRaw?.ontime || 0,
      late: checkInSummaryRaw?.late || 0,
      remaining: Math.max(workingDays - (checkInSummaryRaw?.checkin || 0), 0),
      workingDays,
      // backward compatible keys (older apps)
      checkin: checkInSummaryRaw?.checkin || 0,
      ontime: checkInSummaryRaw?.ontime || 0
    };

    return {
      attendance: {
        total: workingDays,
        present: attendanceStats.PRESENT || 0,
        absent: attendanceStats.ABSENT || 0,
        late: attendanceStats.LATE || 0,
        wfh: attendanceStats.WFH || 0,
        halfDay: attendanceStats.HALF_DAY || 0,
        onLeave: attendanceStats.ON_LEAVE || 0,
        workingDays
      },
      checkInSummary,
      leaveBalance,
      pendingLeaves: myLeaves.total,
      announcements: announcements.slice(0, 5)
    };
  }

  async getBirthdays(userId: string, userRole: string, deptId: string) {
    const options: IPaginationOptions = { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' };
    return await this.getAllAnnouncementsByType('BIRTHDAY', userId, userRole, deptId, options);
  }

  async getAnniversary(userId: string, userRole: string, deptId: string) {
    const options: IPaginationOptions = { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' };
    return await this.getAllAnnouncementsByType('ANNIVERSARY', userId, userRole, deptId, options);
  }

  async getNewHires(userId: string, userRole: string, deptId: string) {
    const options: IPaginationOptions = { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' };
    const { announcements, total } = await announcementDAL.findTypedWithUsers('NEWHIRE', options, true);

    const visible = (announcements || []).filter((a: any) => {
      const ta = a.targetAudience || {};
      const roles: string[] = ta.roles || [];
      const departments: any[] = ta.departments || [];
      const specificUsers: any[] = ta.specificUsers || [];
      return (
        ta.isGlobal === true ||
        roles.includes(userRole) ||
        departments.some(d => (d?._id || d)?.toString?.() === deptId) ||
        specificUsers.some(u => (u?._id || u)?.toString?.() === userId)
      );
    });

    return { announcements: visible, total: visible.length };
  }

  private async getAllAnnouncementsByType(type: string, userId: string, userRole: string, deptId: string, options: IPaginationOptions) {
    const filters: any = {
      ...announcementDAL.getActiveFilter(),
      announcementType: type,
      $or: [
        { 'targetAudience.isGlobal': true },
        { 'targetAudience.roles': userRole },
        { 'targetAudience.departments': deptId },
        { 'targetAudience.specificUsers': userId }
      ]
    };
    return await announcementDAL.findAll(filters, options);
  }

  async getAllAnnouncements(userId: string, userRole: string, deptId: string, options: IPaginationOptions) {
    // Use active filter + audience targeting for employee-visible announcements
    const filters: any = {
      ...announcementDAL.getActiveFilter(),
      $or: [
        { 'targetAudience.isGlobal': true },
        { 'targetAudience.roles': userRole },
        { 'targetAudience.departments': deptId },
        { 'targetAudience.specificUsers': userId }
      ]
    };
    return await announcementDAL.findAll(filters, options);
  }
}

export const employeeDashboardService = new EmployeeDashboardService();