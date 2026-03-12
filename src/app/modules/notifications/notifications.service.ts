import { UserModel } from '../../../shared/models/user.model';
import { notificationDAL } from '../../../shared/dal/notification.dal';
import { sendEmail } from '../../../shared/utils/email';
import { firebaseService } from '../../../shared/services/firebase.service';
import { NotificationType } from '../../../shared/interfaces/notification.interface';
import { Types } from 'mongoose';
import { IPaginationOptions } from '../../../shared/interfaces/common.interface';

// Interface for dispatching new events
interface INotificationPayload {
  userId: string | Types.ObjectId;
  type: NotificationType | string;
  title: string;
  message: string;
  targetApp?: 'EMPLOYEE' | 'HR'; // Optional, defaults to EMPLOYEE in schema
  data?: any;
}

export class NotificationsService {
  /**
   * Get paginated notifications for the authenticated user and platform
   */
  async getUserNotifications(userId: string, targetApp?: 'EMPLOYEE' | 'HR', page: number = 1, limit: number = 10) {
    const options: any = { page, limit, targetApp };
    return await notificationDAL.findAllForUser(userId, options);
  }

  /**
   * Mark a single notification as read
   */
  async markAsRead(notificationId: string, userId: string) {
    const notification = await notificationDAL.markAsRead(notificationId, userId);
    if (!notification) throw new Error('Notification not found');
    return notification;
  }

  /**
   * Mark all of a user's unread notifications as read for a platform
   */
  async markAllAsRead(userId: string, targetApp?: 'EMPLOYEE' | 'HR') {
    return await notificationDAL.markAllAsRead(userId, targetApp);
  }

  /**
   * Send notification
   */
  async sendNotification(notification: INotificationPayload) {
    const user = await UserModel.findById(notification.userId);

    if (!user) {
      throw new Error('User not found');
    }

    // --- CHECK USER PREFERENCES BEFORE SENDING OVERRIDE ---
    const prefs = await notificationDAL.getSettings(user._id);
    if (prefs) {
      const typeStr = String(notification.type);
      if (typeStr === NotificationType.LEAVE_APPROVED && prefs.leaves?.approval === false) return;
      if (typeStr === NotificationType.LEAVE_REJECTED && prefs.leaves?.rejection === false) return;
      if (typeStr === NotificationType.LEAVE_REQUESTED && prefs.leaves?.application === false) return; // Added for new type
      if (typeStr === NotificationType.PAYROLL_GENERATED && prefs.payroll?.payslipGenerated === false) return;
      if (typeStr === NotificationType.ANNOUNCEMENT && prefs.announcements?.newAnnouncement === false) return;
      if (typeStr === NotificationType.BIRTHDAY && prefs.reminders?.birthdays === false) return;
      if (typeStr === NotificationType.WORK_ANNIVERSARY && prefs.reminders?.anniversaries === false) return;
      if (typeStr === NotificationType.NEW_HIRE && prefs.reminders?.newHiring === false) return;
    }

    // 1. Store notification natively in database via DAL
    await notificationDAL.create({
      userId: user._id,
      title: notification.title,
      message: notification.message,
      type: notification.type as NotificationType,
      targetApp: notification.targetApp || 'EMPLOYEE',
      data: notification.data || {}
    });

    // 2. Mobile Firebase Push Notification Trigger
    if (user.fcmTokens && user.fcmTokens.length > 0) {
      try {
        await firebaseService.sendPushNotification(
          user.fcmTokens,
          notification.title,
          notification.message,
          {
            type: notification.type,
            targetApp: notification.targetApp || 'EMPLOYEE',
            dataPayload: JSON.stringify(notification.data || {}) // stringified for firebase
          }
        );
      } catch (error) {
        console.error('Failed to send Firebase Push notification:', error);
      }
    }

    // 3. Fallback Email sending
    try {
      await sendEmail({
        to: user.email,
        subject: notification.title,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #007bff;">${notification.title}</h2>
            <p>${notification.message}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <small style="color: #ed213a;">This is an automated notification from HRMS.</small>
          </div>
        `
      });
    } catch (error) {
      console.error('Failed to send notification email:', error);
    }
  }

  /**
   * Send bulk notifications
   */
  async sendBulkNotifications(notifications: INotificationPayload[]) {
    const promises = notifications.map(notif => this.sendNotification(notif));
    await Promise.allSettled(promises);
  }
}

export const notificationsService = new NotificationsService();