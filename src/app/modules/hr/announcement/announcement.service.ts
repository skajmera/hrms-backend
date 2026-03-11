import { announcementDAL } from '../../../../shared/dal/announcement.dal';
import { IAnnouncementCreateInput } from '../../../../shared/interfaces/announcement.interface';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';

export class AnnouncementService {
  async createAnnouncement(announcementData: IAnnouncementCreateInput & { createdBy: string }) {
    return await announcementDAL.create(announcementData);
  }

  async getAnnouncementById(id: string, userId?: string) {
    const announcement = await announcementDAL.findById(id);
    if (!announcement) {
      throw new Error('Announcement not found');
    }
    return userId ? this.injectLikedField(announcement, userId) : announcement;
  }

  async getAllAnnouncements(filters: any, options: IPaginationOptions, userId?: string) {
    // Normalize and parse query filters here so controller stays thin and consistent
    const { startDate, expiryDate, announcementType, ...rest } = filters || {};

    const queryFilters: any = { ...rest };

    if (startDate) {
      // fetch announcements starting on/after provided date
      queryFilters.startDate = { $gte: new Date(startDate as string) };
    }

    if (expiryDate) {
      // fetch announcements expiring on/before provided date
      queryFilters.expiryDate = { $lte: new Date(expiryDate as string) };
    }

    if (announcementType) {
      queryFilters.announcementType = announcementType;
    }

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