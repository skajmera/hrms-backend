import { announcementDAL } from '../../../../shared/dal/announcement.dal';
import { IAnnouncementCreateInput } from '../../../../shared/interfaces/announcement.interface';
import { IPaginationOptions } from '../../../../shared/interfaces/common.interface';

export class AnnouncementService {
  async createAnnouncement(announcementData: IAnnouncementCreateInput & { createdBy: string }) {
    return await announcementDAL.create(announcementData);
  }

  async getAnnouncementById(id: string) {
    const announcement = await announcementDAL.findById(id);
    if (!announcement) {
      throw new Error('Announcement not found');
    }
    return announcement;
  }

  async getAllAnnouncements(filters: any, options: IPaginationOptions) {
    return await announcementDAL.findAll(filters, options);
  }

  async updateAnnouncement(id: string, updateData: any) {
    const announcement = await announcementDAL.update(id, updateData);
    if (!announcement) {
      throw new Error('Announcement not found');
    }
    return announcement;
  }

  async deleteAnnouncement(id: string) {
    const announcement = await announcementDAL.delete(id);
    if (!announcement) {
      throw new Error('Announcement not found');
    }
    return announcement;
  }

  async getActiveAnnouncementsForUser(userId: string, userRole: string, userDepartment: string) {
    return await announcementDAL.getActiveAnnouncementsForUser(userId, userRole, userDepartment);
  }

  async markAsViewed(id: string, userId: string) {
    await announcementDAL.markAsViewed(id, userId);
  }

  async togglePin(id: string) {
    const announcement = await announcementDAL.togglePin(id);
    if (!announcement) {
      throw new Error('Announcement not found');
    }
    return announcement;
  }
}

export const announcementService = new AnnouncementService();