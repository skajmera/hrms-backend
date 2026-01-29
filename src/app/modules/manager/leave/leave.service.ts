import { leaveDAL } from '../../../../shared/dal/leave.dal';
import { userDAL } from '../../../../shared/dal/user.dal';
import { sendLeaveApprovalEmail } from '../../../../shared/utils/email';

export class ManagerLeaveService {
  /**
   * Approve team member leave
   */
  async approveTeamLeave(managerId: string, leaveId: string) {
    const leave = await leaveDAL.findById(leaveId);
    
    if (!leave) {
      throw new Error('Leave not found');
    }

    // Verify this is manager's team member
    const user = await userDAL.findById(leave.userId.toString());
    if (!user || user.professionalDetails.reportingManager?.toString() !== managerId) {
      throw new Error('Unauthorized to approve this leave');
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
        console.error('Failed to send approval email:', error);
      }
    }

    return approvedLeave;
  }

  /**
   * Reject team member leave
   */
  async rejectTeamLeave(managerId: string, leaveId: string, rejectionReason: string) {
    const leave = await leaveDAL.findById(leaveId);
    
    if (!leave) {
      throw new Error('Leave not found');
    }

    // Verify this is manager's team member
    const user = await userDAL.findById(leave.userId.toString());
    if (!user || user.professionalDetails.reportingManager?.toString() !== managerId) {
      throw new Error('Unauthorized to reject this leave');
    }

    return await leaveDAL.reject(leaveId, managerId, rejectionReason);
  }
}

export const managerLeaveService = new ManagerLeaveService();