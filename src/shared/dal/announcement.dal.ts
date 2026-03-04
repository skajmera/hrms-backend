import { AnnouncementModel } from '../models/announcement.model';
import { IAnnouncement, IAnnouncementCreateInput } from '../interfaces/announcement.interface';
import { IQueryFilters, IPaginationOptions } from '../interfaces/common.interface';

export class AnnouncementDAL {
  /**
   * Create announcement
   */
  async create(announcementData: IAnnouncementCreateInput & { createdBy: string }): Promise<IAnnouncement> {
    return await AnnouncementModel.create(announcementData);
  }

  /**
   * Find announcement by ID
   */
  async findById(id: string): Promise<IAnnouncement | null> {
    return await AnnouncementModel.findById(id)
      .populate('createdBy', 'firstName lastName email profilePicture')
      .populate('targetAudience.departments', 'name code')
      .populate('targetAudience.specificUsers', 'firstName lastName email')
      .populate('likes', 'firstName lastName profilePicture')
      .populate('comments.userId', 'firstName lastName profilePicture')
      .populate('comments.likes', 'firstName lastName profilePicture');
  }

  /**
   * Find all announcements
   */
  async findAll(
    filters: IQueryFilters = {},
    options: IPaginationOptions = {}
  ): Promise<{ announcements: IAnnouncement[]; total: number }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;

    const announcements = await AnnouncementModel.find(filters)
      .populate('createdBy', 'firstName lastName profilePicture')
      .populate('targetAudience.departments', 'name code')
      .populate('likes', 'firstName lastName profilePicture')
      .sort({ isPinned: -1, [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    const total = await AnnouncementModel.countDocuments(filters);

    return { announcements, total };
  }

  /**
   * Update announcement
   */
  async update(id: string, updateData: Partial<IAnnouncement>): Promise<IAnnouncement | null> {
    return await AnnouncementModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'firstName lastName profilePicture');
  }

  /**
   * Delete announcement
   */
  async delete(id: string): Promise<IAnnouncement | null> {
    return await AnnouncementModel.findByIdAndDelete(id);
  }

  /**
   * Get active announcements for a user
   */
  async getActiveAnnouncementsForUser(
    userId: string,
    userRole: string,
    userDepartmentId: string
  ): Promise<IAnnouncement[]> {
    const now = new Date();
    return await AnnouncementModel.find({
      isActive: true,
      startDate: { $lte: now },

      $and: [
        {
          $or: [
            { expiryDate: { $exists: false } },
            { expiryDate: { $gte: now } }
          ]
        },
        {
          $or: [
            { "targetAudience.isGlobal": true },
            { "targetAudience.roles": userRole },
            { "targetAudience.departments": userDepartmentId },
            { "targetAudience.specificUsers": userId }
          ]
        }
      ]
    })
      .populate('createdBy', 'firstName lastName profilePicture')
      .populate('likes', 'firstName lastName profilePicture')
      .populate('comments.userId', 'firstName lastName profilePicture')
      .populate('comments.likes', 'firstName lastName profilePicture')
      .sort({ isPinned: -1, priority: -1, createdAt: -1 });
  }

  /**
   * Mark announcement as viewed
   */
  async markAsViewed(id: string, userId: string): Promise<void> {
    await AnnouncementModel.findByIdAndUpdate(id, {
      $addToSet: {
        viewedBy: {
          userId,
          viewedAt: new Date()
        }
      }
    });
  }

  /**
   * Pin/Unpin announcement
   */
  async togglePin(id: string): Promise<IAnnouncement | null> {
    const announcement = await AnnouncementModel.findById(id);
    if (announcement) {
      announcement.isPinned = !announcement.isPinned;
      return await announcement.save();
    }
    return null;
  }

  /**
   * Get pinned announcements
   */
  async getPinnedAnnouncements(): Promise<IAnnouncement[]> {
    return await AnnouncementModel.find({ isPinned: true, isActive: true })
      .populate('createdBy', 'firstName lastName profilePicture')
      .populate('likes', 'firstName lastName profilePicture')
      .sort({ createdAt: -1 });
  }

  /**
   * Toggle Like on announcement (Add if not present, remove if present)
   */
  async toggleLike(id: string, userId: string): Promise<IAnnouncement | null> {
    const announcement = await AnnouncementModel.findById(id);
    if (!announcement) return null;

    const isLiked = announcement.likes.some(id => id.toString() === userId.toString());
    const update = isLiked
      ? { $pull: { likes: userId } }
      : { $addToSet: { likes: userId } };

    return await AnnouncementModel.findByIdAndUpdate(
      id,
      update,
      { new: true }
    )
      .populate('likes', 'firstName lastName profilePicture')
      .populate('comments.userId', 'firstName lastName profilePicture')
      .populate('comments.likes', 'firstName lastName profilePicture');
  }

  /**
   * Toggle Like on a comment
   */
  async toggleCommentLike(announcementId: string, commentId: string, userId: string): Promise<IAnnouncement | null> {
    const announcement = await AnnouncementModel.findById(announcementId);
    if (!announcement) return null;

    const comment = announcement.comments.find(c => c._id.toString() === commentId.toString());
    if (!comment) throw new Error('Comment not found');

    const isLiked = comment.likes.some(id => id.toString() === userId.toString());
    const update = isLiked
      ? { $pull: { "comments.$.likes": userId } }
      : { $addToSet: { "comments.$.likes": userId } };

    return await AnnouncementModel.findOneAndUpdate(
      { _id: announcementId, "comments._id": commentId },
      update as any,
      { new: true }
    )
      .populate('likes', 'firstName lastName profilePicture')
      .populate('comments.userId', 'firstName lastName profilePicture')
      .populate('comments.likes', 'firstName lastName profilePicture');
  }

  /**
   * Add comment to announcement
   */
  async addComment(id: string, userId: string, content: string): Promise<IAnnouncement | null> {
    return await AnnouncementModel.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: {
            userId,
            content,
            likes: [],
            createdAt: new Date()
          }
        }
      },
      { new: true }
    )
      .populate('likes', 'firstName lastName profilePicture')
      .populate('comments.userId', 'firstName lastName profilePicture')
      .populate('comments.likes', 'firstName lastName profilePicture');
  }

  /**
   * Delete comment from announcement
   */
  async deleteComment(id: string, commentId: string, userId: string): Promise<IAnnouncement | null> {
    return await AnnouncementModel.findByIdAndUpdate(
      id,
      {
        $pull: {
          comments: {
            _id: commentId,
            userId: userId // Ensure user can only delete their own comment
          }
        }
      },
      { new: true }
    )
      .populate('likes', 'firstName lastName profilePicture')
      .populate('comments.userId', 'firstName lastName profilePicture')
      .populate('comments.likes', 'firstName lastName profilePicture');
  }
}

export const announcementDAL = new AnnouncementDAL();