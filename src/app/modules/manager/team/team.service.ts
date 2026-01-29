import { userDAL } from '../../../../shared/dal/user.dal';
import { attendanceDAL } from '../../../../shared/dal/attendance.dal';
import { leaveDAL } from '../../../../shared/dal/leave.dal';

export class ManagerTeamService {
  /**
   * Get team members
   */
  async getTeamMembers(managerId: string) {
    return await userDAL.findAll(
      { 'professionalDetails.reportingManager': managerId, isActive: true },
      {}
    );
  }

  /**
   * Get team attendance today
   */
  async getTeamAttendanceToday(managerId: string) {
    const team = await this.getTeamMembers(managerId);
    const teamIds = team.users.map(u => u._id.toString());
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await attendanceDAL.findAll({
      userId: { $in: teamIds },
      date: { $gte: today, $lt: tomorrow }
    }, {});

    return attendance.records;
  }

  /**
   * Get team leave requests (pending)
   */
  async getTeamLeaveRequests(managerId: string) {
    const team = await this.getTeamMembers(managerId);
    const teamIds = team.users.map(u => u._id.toString());

    return await leaveDAL.findAll(
      { userId: { $in: teamIds }, status: 'PENDING' },
      {}
    );
  }

  /**
   * Get team member details
   */
  async getTeamMemberDetails(managerId: string, userId: string) {
    const user = await userDAL.findById(userId);
    
    if (!user || user.professionalDetails.reportingManager?.toString() !== managerId) {
      throw new Error('Team member not found');
    }

    return user;
  }
}

export const managerTeamService = new ManagerTeamService();