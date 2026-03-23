import { UserModel } from '../models/user.model';
import { IUser, IUserCreateInput, IUserUpdateInput } from '../interfaces/user.interface';
import { IQueryFilters, IPaginationOptions } from '../interfaces/common.interface';
import { EMPLOYMENT_STATUS } from '../../config/constants';
import { Types } from 'mongoose';

export class UserDAL {
  /**
   * Create a new user
   */
  async create(userData: IUserCreateInput): Promise<IUser> {
    const user = await UserModel.create(userData);
    await user.populate([
      { path: 'createdBy', select: 'firstName lastName email phone profilePicture' },
      { path: 'updatedBy', select: 'firstName lastName email phone profilePicture' }
    ]);
    return user;
  }

  /**
   * Find user by ID
   */
  async findById(id: string, selectPassword = false): Promise<IUser | null> {
    const query = UserModel.findById(id)
      .populate({ path: 'professionalDetails.department', select: 'name code', match: { isActive: true } })
      .populate('professionalDetails.designation', 'name code level')
      .populate('professionalDetails.reportingManager', 'firstName lastName email phone profilePicture')
      .populate('createdBy', 'firstName lastName email phone profilePicture')
      .populate('updatedBy', 'firstName lastName email phone profilePicture');

    if (selectPassword) {
      query.select('+password');
    }

    return await query.exec();
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string, selectPassword = false): Promise<IUser | null> {
    const query = UserModel.findOne({ email });

    if (selectPassword) {
      query.select('+password');
    }

    return await query.exec();
  }

  /**
   * Find user by employee ID
   */
  async findByEmployeeId(employeeId: string): Promise<IUser | null> {
    return await UserModel.findOne({ 'professionalDetails.employeeId': employeeId })
      .populate({ path: 'professionalDetails.department', select: 'name code', match: { isActive: true } })
      .populate('professionalDetails.designation', 'name code level')
      .populate('professionalDetails.reportingManager', 'firstName lastName email phone profilePicture')
      .populate('createdBy', 'firstName lastName email phone profilePicture')
      .populate('updatedBy', 'firstName lastName email phone profilePicture');
  }

  /**
   * Find all users with filters and pagination
   */
  async findAll(
    filters: IQueryFilters = {},
    options: IPaginationOptions = {}
  ): Promise<{ users: IUser[]; total: number }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;

    const query: any = {
      ...filters
    };

    if (!query['professionalDetails.employmentStatus']) {
      query['professionalDetails.employmentStatus'] = { $ne: 'DRAFT' };
    }

    const users = await UserModel.find(query)
      .populate({ path: 'professionalDetails.department', select: 'name code', match: { isActive: true } })
      .populate('professionalDetails.designation', 'name code level')
      .populate('professionalDetails.reportingManager', 'firstName lastName email phone profilePicture')
      .populate('createdBy', 'firstName lastName email phone profilePicture')
      .populate('updatedBy', 'firstName lastName email phone profilePicture')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    const total = await UserModel.countDocuments(query);

    return { users, total };
  }

  async findIds(filters: IQueryFilters = {}): Promise<string[]> {
    const query: any = { ...filters };
    if (!query['professionalDetails.employmentStatus']) query['professionalDetails.employmentStatus'] = { $ne: EMPLOYMENT_STATUS.DRAFT };
    const rows = await UserModel.find(query).select('_id').lean();
    return rows.map((r: any) => r._id.toString());
  }

  /**
   * Find all users including drafts
   */
  async findAllWithDrafts(
    filters: IQueryFilters = {},
    options: IPaginationOptions = {}
  ): Promise<{ users: IUser[]; total: number }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;

    const query: any = { ...filters };

    const users = await UserModel.find(query)
      .populate({ path: 'professionalDetails.department', select: 'name code', match: { isActive: true } })
      .populate('professionalDetails.designation', 'name code level')
      .populate('professionalDetails.reportingManager', 'firstName lastName email phone profilePicture')
      .populate('createdBy', 'firstName lastName email phone profilePicture')
      .populate('updatedBy', 'firstName lastName email phone profilePicture')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    const total = await UserModel.countDocuments(query);

    return { users, total };
  }

  async update(id: string, updateData: any): Promise<IUser | null> {
    // Check if updateData already contains MongoDB operators (e.g., $unset)
    const hasOperators = Object.keys(updateData).some(key => key.startsWith('$'));

    if (!hasOperators) {
      // Sanitize empty strings for ObjectId and other fields
      if (updateData.professionalDetails) {
        const pd = updateData.professionalDetails;

        // Fields that should be null if empty or literal "null"
        if (['', 'null', 'undefined'].includes(pd.reportingManager)) pd.reportingManager = null;
        if (['', 'null', 'undefined'].includes(pd.department)) pd.department = null;
        if (['', 'null', 'undefined'].includes(pd.designation)) pd.designation = null;

        // Clean up other potential empty strings that might cause issues
        if (updateData.adhaarNumber === '') updateData.adhaarNumber = undefined;
        if (updateData.panNumber === '') updateData.panNumber = undefined;
        if (updateData.profilePicture === '') updateData.profilePicture = undefined;
      }

      updateData = { $set: updateData };
    }

    return await UserModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: false }
    )
      .populate('createdBy', 'firstName lastName email phone profilePicture')
      .populate('updatedBy', 'firstName lastName email phone profilePicture');
  }

  /**
   * Delete user by ID (soft delete)
   */
  async delete(id: string): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    );
  }

  /**
   * Hard delete user by ID
   */
  async hardDelete(id: string): Promise<IUser | null> {
    return await UserModel.findByIdAndDelete(id);
  }

  /**
   * Find users by department
   */
  async findByDepartment(departmentId: string): Promise<IUser[]> {
    return await UserModel.find({
      'professionalDetails.department': departmentId,
      isActive: true,
      'professionalDetails.employmentStatus': { $ne: 'DRAFT' }
    })
      .populate('professionalDetails.reportingManager', 'firstName lastName email phone profilePicture')
      .populate('createdBy', 'firstName lastName email phone profilePicture')
      .populate('updatedBy', 'firstName lastName email phone profilePicture');
  }

  /**
   * Find users by role
   */
  async findByRole(role: string): Promise<IUser[]> {
    return await UserModel.find({
      role,
      isActive: true,
      'professionalDetails.employmentStatus': { $ne: 'DRAFT' }
    })
      .populate({ path: 'professionalDetails.department', select: 'name code', match: { isActive: true } })
      .populate('professionalDetails.designation', 'name code level')
      .populate('createdBy', 'firstName lastName email phone profilePicture')
      .populate('updatedBy', 'firstName lastName email phone profilePicture');
  }

  /**
   * Get users with birthdays today
   */
  async getBirthdaysToday(): Promise<IUser[]> {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    return await UserModel.aggregate([
      {
        $addFields: {
          birthMonth: { $month: '$dateOfBirth' },
          birthDay: { $dayOfMonth: '$dateOfBirth' }
        }
      },
      {
        $match: {
          birthMonth: month,
          birthDay: day,
          isActive: true,
          'professionalDetails.employmentStatus': { $ne: 'DRAFT' },
          role: { $ne: 'SUPER_ADMIN' }
        }
      },
      {
        $lookup: {
          from: "announcements",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$isActive", true] },
                    { $eq: ["$announcementType", "BIRTHDAY"] },
                    { $lte: ["$startDate", today] },
                    {
                      $or: [
                        { $eq: ["$expiryDate", null] },
                        { $gte: ["$expiryDate", today] }
                      ]
                    },
                    {
                      $or: [
                        { $eq: ["$targetAudience.isGlobal", true] },
                        { $in: ["$$userId", "$targetAudience.specificUsers"] }
                      ]
                    }
                  ]
                }
              }
            },
            {
              $project: {
                title: 1,
                content: 1,
                priority: 1,
                isPinned: 1,
                attachments: 1
              }
            }
          ],
          as: "birthdayAnnouncements"
        }
      },

      // 4️⃣ Clean response
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          profilePicture: 1,
          profileImage: "$profilePicture"
        }
      }
    ]);
  }

  /**
   * Get recently joined users
   */
  async getNewHires(days: number = 30, date?: string): Promise<any[]> {
    const today = date ? new Date(date) : new Date();

    const dateThreshold = new Date(today);
    dateThreshold.setDate(dateThreshold.getDate() - days);

    return await UserModel.aggregate([
      {
        $match: {
          isActive: true,
          'professionalDetails.employmentStatus': { $in: [EMPLOYMENT_STATUS.ACTIVE, EMPLOYMENT_STATUS.PROBATION] },
          "professionalDetails.joiningDate": { $gte: dateThreshold },
          role: { $ne: 'SUPER_ADMIN' }
        }
      },

      // 2️⃣ Sort by joining date
      {
        $sort: {
          "professionalDetails.joiningDate": -1
        }
      },

      // 3️⃣ Department lookup (populate replacement)
      {
        $lookup: {
          from: "designations",
          localField: "professionalDetails.designation",
          foreignField: "_id",
          as: "designation"
        }
      },
      {
        $lookup: {
          from: "departments",
          localField: "professionalDetails.department",
          foreignField: "_id",
          as: "department"
        }
      },
      {
        $unwind: {
          path: "$department",
          preserveNullAndEmptyArrays: true
        }
      },

      // 4️⃣ Lookup New Hire Announcements (Including Drafts & Scheduled)
      {
        $lookup: {
          from: "announcements",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$announcementType", "NEWHIRES"] },
                    {
                      $or: [
                        { $eq: ["$targetAudience.isGlobal", true] },
                        { $in: ["$$userId", "$targetAudience.specificUsers"] }
                      ]
                    }
                  ]
                }
              }
            },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
            {
              $project: {
                title: 1,
                content: 1,
                attachments: 1
              }
            }
          ],
          as: "newHireAnnouncements"
        }
      },

      // 5️⃣ Final Optimized Response Shape
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          fullName: { $concat: [{ $ifNull: ["$firstName", ""] }, " ", { $ifNull: ["$lastName", ""] }] },
          profileImage: { $ifNull: ["$profilePicture", ""] },
          designation: "$designation.name",
          department: "$department.name",
          joiningDate: "$professionalDetails.joiningDate",

          announcement: {
            $let: {
              vars: {
                firstAnn: { $arrayElemAt: ["$newHireAnnouncements", 0] }
              },
              in: {
                $cond: {
                  if: { $ne: ["$$firstAnn", null] },
                  then: {
                    _id: "$$firstAnn._id",
                    title: { $ifNull: ["$$firstAnn.title", ""] },
                    description: { $ifNull: ["$$firstAnn.content", ""] },
                    attachments: { $cond: { if: { $isArray: "$$firstAnn.attachments" }, then: "$$firstAnn.attachments", else: [] } }
                  },
                  else: {
                    title: "",
                    description: "",
                    attachments: []
                  }
                }
              }
            }
          }
        }
      }
    ]);
  }

  // async getNewHires(days: number = 30): Promise<IUser[]> {
  //   const dateThreshold = new Date();
  //   dateThreshold.setDate(dateThreshold.getDate() - days);

  //   return await UserModel.find({
  //     'professionalDetails.joiningDate': { $gte: dateThreshold },
  //     isActive: true
  //   })
  //     .populate('professionalDetails.department', 'name code')
  //     .sort({ 'professionalDetails.joiningDate': -1 });
  // }

  /**
   * Update last login
   */
  async updateLastLogin(id: string): Promise<void> {
    await UserModel.findByIdAndUpdate(id, { lastLogin: new Date() });
  }

  /**
   * Search users by name, email, or employee ID
   */
  async search(searchTerm: string): Promise<IUser[]> {
    const searchRegex = { $regex: searchTerm, $options: 'i' };
    const parts = searchTerm.trim().split(/\s+/);

    const orQuery: any[] = [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { email: searchRegex },
      { 'professionalDetails.employeeId': searchRegex }
    ];

    // If search term has multiple words, try matching first and last name combinations
    if (parts.length >= 2) {
      orQuery.push({
        $and: [
          { firstName: { $regex: parts[0], $options: 'i' } },
          { lastName: { $regex: parts[parts.length - 1], $options: 'i' } }
        ]
      });
    }

    return await UserModel.find({
      $or: orQuery,
      isActive: true,
      'professionalDetails.employmentStatus': { $ne: 'DRAFT' }
    })
      .populate({ path: 'professionalDetails.department', select: 'name code', match: { isActive: true } })
      .populate('professionalDetails.designation', 'name code level')
      .populate('professionalDetails.reportingManager', 'firstName lastName email phone profilePicture')
      .populate('createdBy', 'firstName lastName email phone profilePicture')
      .populate('updatedBy', 'firstName lastName email phone profilePicture')
      .limit(20);
  }

  /**
   * Find user by full name
   */
  async findByName(name: string): Promise<IUser | null> {
    const parts = name.trim().split(/\s+/);
    let query: any = {};

    if (parts.length === 1) {
      query = {
        $or: [
          { firstName: { $regex: `^${parts[0]}$`, $options: 'i' } },
          { lastName: { $regex: `^${parts[0]}$`, $options: 'i' } }
        ]
      };
    } else {
      // Try exact match on first and last name
      query = {
        firstName: { $regex: `^${parts[0]}$`, $options: 'i' },
        lastName: { $regex: `^${parts[parts.length - 1]}$`, $options: 'i' }
      };
    }

    return await UserModel.findOne({
      ...query,
      isActive: true,
      'professionalDetails.employmentStatus': { $ne: 'DRAFT' }
    })
      .populate({ path: 'professionalDetails.department', select: 'name code', match: { isActive: true } })
      .populate('professionalDetails.designation', 'name code level')
      .populate('professionalDetails.reportingManager', 'firstName lastName email phone profilePicture')
      .populate('createdBy', 'firstName lastName email phone profilePicture')
      .populate('updatedBy', 'firstName lastName email phone profilePicture');
  }

  /**
   * Get user count by status
   */
  async getUserStats(): Promise<any> {
    return await UserModel.aggregate([
      {
        $group: {
          _id: '$professionalDetails.employmentStatus',
          count: { $sum: 1 }
        }
      }
    ]);
  }

  async getAnniversaryToday(): Promise<IUser[]> {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    return await UserModel.aggregate([
      {
        $addFields: {
          anniversaryMonth: { $month: '$anniversary' },
          anniversary: { $dayOfMonth: '$anniversary' }
        }
      },
      {
        $match: {
          anniversaryMonth: month,
          anniversary: day,
          isActive: true,
          'professionalDetails.employmentStatus': { $ne: 'DRAFT' },
          role: { $ne: 'SUPER_ADMIN' }
        }
      },
      {
        $lookup: {
          from: "announcements",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$isActive", true] },
                    { $eq: ["$announcementType", "ANNIVERSARY"] },
                    { $lte: ["$startDate", today] },
                    {
                      $or: [
                        { $eq: ["$expiryDate", null] },
                        { $gte: ["$expiryDate", today] }
                      ]
                    },
                    {
                      $or: [
                        { $eq: ["$targetAudience.isGlobal", true] },
                        { $in: ["$$userId", "$targetAudience.specificUsers"] }
                      ]
                    }
                  ]
                }
              }
            },
            {
              $project: {
                title: 1,
                content: 1,
                priority: 1,
                isPinned: 1,
                attachments: 1
              }
            }
          ],
          as: "anniversaryAnnouncements"
        }
      },

      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          profilePicture: 1,
          profileImage: "$profilePicture"
        }
      }
    ]);
  }
  // async getTodayAttendanceOverview(): Promise<any[]> {
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   const tomorrow = new Date(today);
  //   tomorrow.setDate(tomorrow.getDate() + 1);

  //   return await UserModel.aggregate([
  //     {
  //       $match: {
  //         isActive: true,
  //         role: "EMPLOYEE"
  //       }
  //     },

  //     {
  //       $lookup: {
  //         from: "attendances",
  //         let: { userId: "$_id" },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [
  //                   { $eq: ["$userId", "$$userId"] },
  //                   { $gte: ["$date", today] },
  //                   { $lt: ["$date", tomorrow] }
  //                 ]
  //               }
  //             }
  //           }
  //         ],
  //         as: "todayAttendance"
  //       }
  //     },

  //     {
  //       $addFields: {
  //         todayAttendance: { $arrayElemAt: ["$todayAttendance", 0] }
  //       }
  //     },

  //     {
  //       $addFields: {
  //         shiftStartTime: {
  //           $dateFromString: {
  //             dateString: {
  //               $concat: [
  //                 { $dateToString: { format: "%Y-%m-%d", date: today } },
  //                 "T",
  //                 "$professionalDetails.shift.startTime",
  //                 ":00"
  //               ]
  //             }
  //           }
  //         }
  //       }
  //     },

  //     {
  //       $addFields: {
  //         attendanceStatus: {
  //           $cond: [
  //             { $ifNull: ["$todayAttendance.checkInTime", false] },
  //             {
  //               $cond: [
  //                 { $gt: ["$todayAttendance.checkInTime", "$shiftStartTime"] },
  //                 "LATE",
  //                 "ON_TIME"
  //               ]
  //             },
  //             "YET_TO_CHECK_IN"
  //           ]
  //         }
  //       }
  //     },

  //     {
  //       $project: {
  //         firstName: 1,
  //         lastName: 1,
  //         email: 1,
  //         "professionalDetails.employeeId": 1,
  //         "professionalDetails.department": 1,
  //         attendanceStatus: 1,
  //         checkInTime: "$todayAttendance.checkInTime"
  //       }
  //     }
  //   ]);
  // }
  async getTodayAttendanceOverview(organizationId?: string): Promise<any[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const orgFilter =
      organizationId && Types.ObjectId.isValid(organizationId)
        ? { organizationId: new Types.ObjectId(organizationId) }
        : {};

    return await UserModel.aggregate([
      // 1️⃣ Active users except SUPER_ADMIN (optionally scoped to org)
      {
        $match: {
          isActive: true,
          role: { $ne: "SUPER_ADMIN" },
          ...orgFilter,
          'professionalDetails.employmentStatus': { $ne: 'DRAFT' }
        }
      },

      // 2️⃣ Lookup today's attendance
      {
        $lookup: {
          from: "attendances",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", "$$userId"] },
                    { $gte: ["$date", today] },
                    { $lt: ["$date", tomorrow] }
                  ]
                }
              }
            },
            {
              $project: {
                status: 1,
                checkInTime: 1,
                checkOutTime: 1,
                shift: 1,
                isLate: 1,
                workingHours: 1,
                overtimeHours: 1
              }
            }
          ],
          as: "todayAttendance"
        }
      },

      // 3️⃣ Flatten attendance array
      {
        $addFields: {
          todayAttendance: { $arrayElemAt: ["$todayAttendance", 0] }
        }
      },

      // 4️⃣ Attendance status (USING isLate FLAG)
      {
        $addFields: {
          attendanceStatus: {
            $cond: [
              { $ifNull: ["$todayAttendance", false] },
              {
                $switch: {
                  branches: [
                    { case: { $eq: ["$todayAttendance.status", "ABSENT"] }, then: "ABSENT" },
                    { case: { $eq: ["$todayAttendance.status", "ON_LEAVE"] }, then: "ON_LEAVE" },
                    { case: { $eq: ["$todayAttendance.status", "WFH"] }, then: "WFH" },
                    { case: { $eq: ["$todayAttendance.status", "HALF_DAY"] }, then: "HALF_DAY" },
                    { case: { $or: [{ $eq: ["$todayAttendance.status", "LATE"] }, { $eq: ["$todayAttendance.isLate", true] }] }, then: "LATE" }
                  ],
                  default: "ON_TIME"
                }
              },
              "YET_TO_CHECK_IN"
            ]
          }
        }
      },

      // 5️⃣ Final response
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          phone: 1,
          profilePicture: 1,
          profileImage: "$profilePicture",
          "professionalDetails.employeeId": 1,
          "professionalDetails.department": 1,
          attendanceStatus: 1,
          shift: "$todayAttendance.shift",
          checkInTime: "$todayAttendance.checkInTime",
          checkOutTime: "$todayAttendance.checkOutTime",
          workingHours: {
            $cond: [
              { $ne: ["$todayAttendance.workingHours", null] },
              { $round: ["$todayAttendance.workingHours", 2] },
              "$todayAttendance.workingHours"
            ]
          },
          overtimeHours: {
            $cond: [
              { $ne: ["$todayAttendance.overtimeHours", null] },
              { $round: ["$todayAttendance.overtimeHours", 2] },
              "$todayAttendance.overtimeHours"
            ]
          }
        }
      }
    ]);
  }

  async getYetToCheckInCount(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await UserModel.aggregate([
      {
        $match: {
          isActive: true,
          role: 'EMPLOYEE',
          'professionalDetails.employmentStatus': { $ne: 'DRAFT' }
        }
      },

      {
        $lookup: {
          from: 'attendances',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$userId', '$$userId'] },
                    { $gte: ['$date', today] },
                    { $lt: ['$date', tomorrow] }
                  ]
                }
              }
            }
          ],
          as: 'todayAttendance'
        }
      },

      {
        $match: {
          todayAttendance: { $size: 0 }
        }
      },

      {
        $count: 'yetToCheckInCount'
      }
    ]);

    return result.length ? result[0].yetToCheckInCount : 0;
  }

}

export const userDAL = new UserDAL();