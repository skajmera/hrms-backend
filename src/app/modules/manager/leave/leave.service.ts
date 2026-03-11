import { leaveDAL } from '../../../../shared/dal/leave.dal';
import { userDAL } from '../../../../shared/dal/user.dal';
import { sendLeaveApprovalEmail } from '../../../../shared/utils/email';
import { USER_ROLES } from '../../../../config/constants';

export class ManagerLeaveService {
  /**
   * Approve team member leave
   */
  async approveTeamLeave(managerId: string, leaveId: string, callerRole?: string) {
    console.log(`[ManagerLeaveService] approveTeamLeave - managerId: ${managerId}, leaveId: ${leaveId}`);

    const leave = await leaveDAL.findById(leaveId);

    if (!leave) {
      console.error(`[ManagerLeaveService] Leave not found: ${leaveId}`);
      throw new Error('Leave not found');
    }

    // userId may be populated (object) or plain ID — safely extract string
    const userId = (leave.userId as any)?._id?.toString() ?? leave.userId?.toString();
    console.log(`[ManagerLeaveService] Leave found. userId: ${userId}, status: ${leave.status}`);

    const user = await userDAL.findById(userId);
    if (!user) {
      console.error(`[ManagerLeaveService] User not found for userId: ${userId}`);
      throw new Error('Leave owner not found');
    }

    // SUPER_ADMIN and HR_ADMIN bypass the reporting manager ownership check
    const isPrivileged = callerRole === USER_ROLES.SUPER_ADMIN || callerRole === USER_ROLES.HR_ADMIN;
    if (!isPrivileged) {
      const reportingManagerId = user.professionalDetails?.reportingManager?.toString();
      console.log(`[ManagerLeaveService] reportingManager on user: ${reportingManagerId}, current managerId: ${managerId}`);
      if (reportingManagerId !== managerId) {
        console.error(`[ManagerLeaveService] Auth check failed — manager ${managerId} is not reporting manager ${reportingManagerId}`);
        throw new Error('Unauthorized to approve this leave');
      }
    }

    const approvedLeave = await leaveDAL.approve(leaveId, managerId);

    // Update leave balance
    if (approvedLeave) {
      await leaveDAL.updateLeaveBalanceAfterApproval(approvedLeave);

      // Send email notification
      try {
        await sendLeaveApprovalEmail(
          user.email,
          user.getFullName(),
          leave.leaveType,
          leave.startDate.toDateString(),
          leave.endDate.toDateString()
        );
      } catch (error) {
        console.error('[ManagerLeaveService] Failed to send approval email:', error);
      }
    }

    console.log(`[ManagerLeaveService] Leave approved successfully: ${leaveId}`);
    return approvedLeave;
  }

  /**
   * Reject team member leave
   */
  async rejectTeamLeave(managerId: string, leaveId: string, rejectionReason: string, callerRole?: string) {
    console.log(`[ManagerLeaveService] rejectTeamLeave - managerId: ${managerId}, leaveId: ${leaveId}`);

    const leave = await leaveDAL.findById(leaveId);

    if (!leave) {
      console.error(`[ManagerLeaveService] Leave not found: ${leaveId}`);
      throw new Error('Leave not found');
    }

    // userId may be populated (object) or plain ID — safely extract string
    console.log("leave : ", leave)
    const userId = (leave.userId as any)?._id?.toString() ?? leave.userId?.toString();
    console.log(`[ManagerLeaveService] Leave found. userId: ${userId}, status: ${leave.status}`);

    const user = await userDAL.findById(userId);
    if (!user) {
      console.error(`[ManagerLeaveService] User not found for userId: ${userId}`);
      throw new Error('Leave owner not found');
    }

    // SUPER_ADMIN and HR_ADMIN bypass the reporting manager ownership check
    const isPrivileged = callerRole === USER_ROLES.SUPER_ADMIN || callerRole === USER_ROLES.HR_ADMIN;
    if (!isPrivileged) {
      const reportingManagerId = user.professionalDetails?.reportingManager?.toString();
      console.log(`[ManagerLeaveService] reportingManager on user: ${reportingManagerId}, current managerId: ${managerId}`);
      if (reportingManagerId !== managerId) {
        console.error(`[ManagerLeaveService] Auth check failed — manager ${managerId} is not reporting manager ${reportingManagerId}`);
        throw new Error('Unauthorized to reject this leave');
      }
    }

    console.log(`[ManagerLeaveService] Leave rejected successfully: ${leaveId}`);
    return await leaveDAL.reject(leaveId, managerId, rejectionReason);
  }
}

export const managerLeaveService = new ManagerLeaveService();