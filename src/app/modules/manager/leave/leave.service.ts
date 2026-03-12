import { leaveDAL } from '../../../../shared/dal/leave.dal';
import { userDAL } from '../../../../shared/dal/user.dal';
import { sendLeaveApprovalEmail } from '../../../../shared/utils/email';
import { USER_ROLES } from '../../../../config/constants';
import { notificationsService } from '../../notifications/notifications.service';
import { NotificationType } from '../../../../shared/interfaces/notification.interface';

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

      // --- TRIGGER NOTIFICATION ---
      try {
        await notificationsService.sendNotification({
          userId: user._id.toString(),
          type: NotificationType.LEAVE_APPROVED,
          title: 'Leave Approved',
          message: `Your leave request for ${leave.leaveType} from ${leave.startDate.toDateString()} to ${leave.endDate.toDateString()} has been approved.`,
          targetApp: 'EMPLOYEE',
          data: { leaveId: approvedLeave._id }
        });
      } catch (error) {
        console.error('[ManagerLeaveService] Failed to send approval notification:', error);
      }

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

    const rejectedLeave = await leaveDAL.reject(leaveId, managerId, rejectionReason);

    // --- TRIGGER NOTIFICATION ---
    if (rejectedLeave) {
      try {
        await notificationsService.sendNotification({
          userId: user._id.toString(),
          type: NotificationType.LEAVE_REJECTED,
          title: 'Leave Rejected',
          message: `Your leave request for ${leave.leaveType} has been rejected. Reason: ${rejectionReason}`,
          targetApp: 'EMPLOYEE',
          data: { leaveId: rejectedLeave._id }
        });
      } catch (error) {
        console.error('[ManagerLeaveService] Failed to send rejection notification:', error);
      }
    }

    console.log(`[ManagerLeaveService] Leave rejected successfully: ${leaveId}`);
    return rejectedLeave;
  }
}

export const managerLeaveService = new ManagerLeaveService();