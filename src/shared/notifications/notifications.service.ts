import {UserModel  } from '../models/user.model';
import { sendEmail } from '../utils/email'

interface INotification {
  userId: string;
  type: 'LEAVE_APPROVED' | 'LEAVE_REJECTED' | 'PAYROLL_GENERATED' | 'ANNOUNCEMENT' | 'BIRTHDAY' | 'WORK_ANNIVERSARY';
  title: string;
  message: string;
  data?: any;
}

export class NotificationsService {
  /**
   * Send notification
   */
  async sendNotification(notification: INotification) {
    const user = await UserModel.findById(notification.userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Send email notification
    try {
      await sendEmail({
        to: user.email,
        subject: notification.title,
        html: `
          <h2>${notification.title}</h2>
          <p>${notification.message}</p>
        `
      });
    } catch (error) {
      console.error('Failed to send notification email:', error);
    }

    // In a real app, you would also:
    // 1. Store notification in database
    // 2. Send push notification
    // 3. Send in-app notification
    // 4. Send SMS if critical
  }

  /**
   * Send bulk notifications
   */
  async sendBulkNotifications(notifications: INotification[]) {
    const promises = notifications.map(notif => this.sendNotification(notif));
    await Promise.allSettled(promises);
  }
}

export const notificationsService = new NotificationsService();