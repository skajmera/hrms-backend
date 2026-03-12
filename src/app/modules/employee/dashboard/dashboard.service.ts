import { attendanceDAL } from '../../../../shared/dal/attendance.dal';
import { leaveDAL } from '../../../../shared/dal/leave.dal';
import { announcementDAL } from '../../../../shared/dal/announcement.dal';
import { userDAL } from '../../../../shared/dal/user.dal';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';

export class EmployeeDashboardService {
  async getMyDashboard(userId: string, userRole: string, userDepartment: string) {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const attendanceStats = await attendanceDAL.getUserAttendanceStats(userId, currentMonth, currentYear);
    const checkInSummary = await attendanceDAL.getUserMonthlyCheckInSummary(userId, currentMonth, currentYear);
    const leaveBalance = await leaveDAL.getLeaveBalance(userId, currentYear);
    const myLeaves = await leaveDAL.findAll({ userId, status: 'PENDING' }, {});
    const announcements = await announcementDAL.getActiveAnnouncementsForUser(userId, userRole, userDepartment);

    return {
      attendance: attendanceStats,
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
    return await this.getAllAnnouncementsByType('NEWHIRE', userId, userRole, deptId, options);
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