import { AnnouncementModel } from '../models/announcement.model';
import { IAnnouncement, IAnnouncementCreateInput } from '../interfaces/announcement.interface';
import { IQueryFilters, IPaginationOptions } from '../interfaces/common.interface';

export class AnnouncementDAL {
  /**
   * Create announcement
   */
  async create(announcementData: IAnnouncementCreateInput & { createdBy: string }): Promise<IAnnouncement> {
    // Sanitize junk frontend data if announcement is global to prevent CastErrors
    if (announcementData.targetAudience?.isGlobal) {
      announcementData.targetAudience.departments = [];
      announcementData.targetAudience.roles = [];
      announcementData.targetAudience.specificUsers = [];
    }

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
      .populate('targetAudience.specificUsers', 'firstName lastName profilePicture professionalDetails.designation professionalDetails.department professionalDetails.joiningDate')
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

  /**
   * Add a reply to a comment
   */
  async addReply(id: string, commentId: string, userId: string, content: string): Promise<IAnnouncement | null> {
    return await AnnouncementModel.findOneAndUpdate(
      { _id: id, "comments._id": commentId },
      {
        $push: {
          "comments.$.replies": {
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
      .populate('comments.likes', 'firstName lastName profilePicture')
      .populate('comments.replies.userId', 'firstName lastName profilePicture')
      .populate('comments.replies.likes', 'firstName lastName profilePicture');
  }

  /**
   * Reusable active + date validity filter for employee-side visibility
   */
  getActiveFilter() {
    const now = new Date();
    return {
      isActive: true,
      startDate: { $lte: now },
      $or: [{ expiryDate: { $exists: false } }, { expiryDate: { $gte: now } }]
    };
  }

  /**
   * Get typed announcements (NEWHIRE/BIRTHDAY/ANNIVERSARY) with target employee data embedded
   */
  async findTypedWithUsers(
    announcementType: string,
    options: IPaginationOptions = {},
    applyActiveFilter = false
  ): Promise<{ announcements: any[]; total: number }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;

    const match: any = { announcementType };
    if (applyActiveFilter) Object.assign(match, this.getActiveFilter());

    const pipeline: any[] = [
      { $match: match },
      // Embed target employee details from specificUsers
      {
        $lookup: {
          from: 'users',
          localField: 'targetAudience.specificUsers',
          foreignField: '_id',
          pipeline: [{ $project: { firstName: 1, lastName: 1, profilePicture: 1, 'professionalDetails.designation': 1, 'professionalDetails.department': 1, 'professionalDetails.joiningDate': 1 } }],
          as: 'targetEmployees'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          pipeline: [{ $project: { firstName: 1, lastName: 1, profilePicture: 1 } }],
          as: 'createdByUser'
        }
      },
      { $addFields: { createdBy: { $arrayElemAt: ['$createdByUser', 0] } } },
      { $project: { createdByUser: 0 } },
      { $sort: { isPinned: -1, [sortBy]: sortOrder === 'asc' ? 1 : -1 } }
    ];

    const [announcements, countResult] = await Promise.all([
      AnnouncementModel.aggregate([...pipeline, { $skip: skip }, { $limit: limit }]),
      AnnouncementModel.aggregate([...pipeline, { $count: 'total' }])
    ]);

    return { announcements, total: countResult[0]?.total ?? 0 };
  }
}

export const announcementDAL = new AnnouncementDAL();