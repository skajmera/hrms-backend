import { announcementDAL } from '../../../../shared/dal/announcement.dal';
import { userDAL } from '../../../../shared/dal/user.dal';
import { IAnnouncementCreateInput } from '../../../../shared/interfaces/announcement.interface';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';
import { notificationsService } from '../../notifications/notifications.service';
import { NotificationType } from '../../../../shared/interfaces/notification.interface';

export class AnnouncementService {
  async createAnnouncement(announcementData: IAnnouncementCreateInput & { createdBy: string }) {
    const announcement = await announcementDAL.create(announcementData);

    // --- TRIGGER NOTIFICATIONS FOR TARGET AUDIENCE ---
    try {
      if (announcement.isActive) {
        let targetUserIds: string[] = [];

        if (announcement.targetAudience.isGlobal) {
          // Notify everyone (active users)
          const allUsers = await userDAL.findAll({ isActive: true }, { limit: 2000, page: 1 });
          targetUserIds = allUsers.users.map(u => u._id.toString());
        } else {
          // Notify specific audience
          const filters: any = { isActive: true, $or: [] };

          if (announcement.targetAudience.roles?.length) {
            filters.$or.push({ role: { $in: announcement.targetAudience.roles } });
          }
          if (announcement.targetAudience.departments?.length) {
            filters.$or.push({ 'professionalDetails.department': { $in: announcement.targetAudience.departments } });
          }
          if (announcement.targetAudience.specificUsers?.length) {
            filters.$or.push({ _id: { $in: announcement.targetAudience.specificUsers } });
          }

          if (filters.$or.length > 0) {
            const users = await userDAL.findAll(filters, { limit: 1000, page: 1 });
            targetUserIds = users.users.map(u => u._id.toString());
          }
        }

        if (targetUserIds.length > 0) {
          const notificationPayloads = targetUserIds.map(userId => ({
            userId,
            type: NotificationType.ANNOUNCEMENT,
            title: 'New Announcement',
            message: announcement.title,
            targetApp: 'EMPLOYEE' as const,
            data: { announcementId: announcement._id }
          }));
          await notificationsService.sendBulkNotifications(notificationPayloads);
        }
      }
    } catch (error) {
      console.error('[AnnouncementService] Failed to send announcement notifications:', error);
    }

    return announcement;
  }

  async getAnnouncementById(id: string, userId?: string) {
    const announcement = await announcementDAL.findById(id);
    if (!announcement) {
      throw new Error('Announcement not found');
    }
    return userId ? this.injectLikedField(announcement, userId) : announcement;
  }

  async getAllAnnouncements(filters: any, options: IPaginationOptions, userId?: string, role?: string) {
    const { startDate, expiryDate, announcementType, ...rest } = filters || {};

    const queryFilters: any = { ...rest };

    if (startDate) queryFilters.startDate = { $gte: new Date(startDate as string) };
    if (expiryDate) queryFilters.expiryDate = { $lte: new Date(expiryDate as string) };
    if (announcementType) queryFilters.announcementType = announcementType;

    // Employees/Managers only see active, valid-date announcements
    const isEmployee = role && !['SUPER_ADMIN', 'HR_ADMIN'].includes(role);
    if (isEmployee) Object.assign(queryFilters, announcementDAL.getActiveFilter());

    const result = await announcementDAL.findAll(queryFilters, options);
    if (userId) {
      result.announcements = result.announcements.map(a => this.injectLikedField(a, userId));
    }
    return result;
  }

  async updateAnnouncement(id: string, updateData: any, userId: string) {
    const announcement = await announcementDAL.update(id, updateData);
    if (!announcement) {
      throw new Error('Announcement not found');
    }
    return this.injectLikedField(announcement, userId);
  }

  async deleteAnnouncement(id: string) {
    const announcement = await announcementDAL.delete(id);
    if (!announcement) {
      throw new Error('Announcement not found');
    }
    return announcement;
  }

  async markAsViewed(id: string, userId: string) {
    await announcementDAL.markAsViewed(id, userId);
  }

  async togglePin(id: string, userId: string) {
    const announcement = await announcementDAL.togglePin(id);
    if (!announcement) {
      throw new Error('Announcement not found');
    }
    return this.injectLikedField(announcement, userId);
  }

  async getActiveAnnouncementsForUser(userId: string, userRole: string, userDepartment: string) {
    const announcements = await announcementDAL.getActiveAnnouncementsForUser(userId, userRole, userDepartment);
    return announcements.map(a => this.injectLikedField(a, userId));
  }

  async getTypedAnnouncements(type: string, options: IPaginationOptions, userId: string, role: string) {
    const isEmployee = !['SUPER_ADMIN', 'HR_ADMIN'].includes(role);
    const result = await announcementDAL.findTypedWithUsers(type, options, isEmployee);
    if (userId) {
      result.announcements = result.announcements.map(a => this.injectLikedField(a, userId));
    }
    return result;
  }

  async toggleLikeAnnouncement(id: string, userId: string) {
    const announcement = await announcementDAL.toggleLike(id, userId);
    if (!announcement) {
      throw new Error('Announcement not found');
    }
    return this.injectLikedField(announcement, userId);
  }

  async toggleCommentLikeAnnouncement(id: string, commentId: string, userId: string) {
    const announcement = await announcementDAL.toggleCommentLike(id, commentId, userId);
    if (!announcement) {
      throw new Error('Announcement or comment not found');
    }
    return this.injectLikedField(announcement, userId);
  }

  async addComment(id: string, userId: string, content: string) {
    const announcement = await announcementDAL.addComment(id, userId, content);
    if (!announcement) {
      throw new Error('Announcement not found');
    }
    return this.injectLikedField(announcement, userId);
  }

  async addReplyToComment(id: string, commentId: string, userId: string, content: string) {
    const announcement = await announcementDAL.addReply(id, commentId, userId, content);
    if (!announcement) {
      throw new Error('Announcement or comment not found');
    }
    return this.injectLikedField(announcement, userId);
  }

  async deleteComment(id: string, commentId: string, userId: string) {
    const announcement = await announcementDAL.deleteComment(id, commentId, userId);
    if (!announcement) {
      throw new Error('Announcement not found or unauthorized to delete this comment');
    }
    return this.injectLikedField(announcement, userId);
  }

  /**
   * Inject runtime 'liked' field for frontend consumption
   */
  private injectLikedField(announcement: any, userId: string): any {
    const a = announcement.toObject ? announcement.toObject() : announcement;

    // Announcement liked status
    a.liked = a.likes?.some((id: any) =>
      (id._id || id).toString() === userId.toString()
    ) || false;

    // Comments liked status
    if (a.comments) {
      a.comments = a.comments.map((c: any) => ({
        ...c,
        liked: c.likes?.some((id: any) =>
          (id._id || id).toString() === userId.toString()
        ) || false,
        replies: c.replies ? c.replies.map((r: any) => ({
          ...r,
          liked: r.likes?.some((id: any) =>
            (id._id || id).toString() === userId.toString()
          ) || false
        })) : []
      }));
    }

    return a;
  }
}

export const announcementService = new AnnouncementService();