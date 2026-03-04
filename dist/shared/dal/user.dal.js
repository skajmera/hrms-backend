"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDAL = exports.UserDAL = void 0;
const user_model_1 = require("../models/user.model");
class UserDAL {
    /**
     * Create a new user
     */
    async create(userData) {
        const user = await user_model_1.UserModel.create(userData);
        return user;
    }
    /**
     * Find user by ID
     */
    async findById(id, selectPassword = false) {
        const query = user_model_1.UserModel.findById(id)
            .populate('professionalDetails.department', 'name code')
            .populate('professionalDetails.designation', 'name code level')
            .populate('professionalDetails.reportingManager', 'firstName lastName email');
        if (selectPassword) {
            query.select('+password');
        }
        return await query.exec();
    }
    /**
     * Find user by email
     */
    async findByEmail(email, selectPassword = false) {
        const query = user_model_1.UserModel.findOne({ email });
        if (selectPassword) {
            query.select('+password');
        }
        return await query.exec();
    }
    /**
     * Find user by employee ID
     */
    async findByEmployeeId(employeeId) {
        return await user_model_1.UserModel.findOne({ 'professionalDetails.employeeId': employeeId })
            .populate('professionalDetails.department', 'name code')
            .populate('professionalDetails.designation', 'name code level')
            .populate('professionalDetails.reportingManager', 'firstName lastName email');
    }
    /**
     * Find all users with filters and pagination
     */
    async findAll(filters = {}, options = {}) {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
        const skip = (page - 1) * limit;
        const query = { ...filters };
        const users = await user_model_1.UserModel.find(query)
            .populate('professionalDetails.department', 'name code')
            .populate('professionalDetails.designation', 'name code level')
            .populate('professionalDetails.reportingManager', 'firstName lastName email')
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit);
        const total = await user_model_1.UserModel.countDocuments(query);
        return { users, total };
    }
    /**
     * Update user by ID
     */
    async update(id, updateData) {
        // Sanitize empty strings for ObjectId and other fields
        if (updateData.professionalDetails) {
            const pd = updateData.professionalDetails;
            // Fields that should be null if empty
            if (pd.reportingManager === '')
                pd.reportingManager = null;
            if (pd.department === '')
                pd.department = null;
            if (pd.designation === '')
                pd.designation = null;
            // Clean up other potential empty strings that might cause issues
            if (updateData.adhaarNumber === '')
                updateData.adhaarNumber = undefined;
            if (updateData.panNumber === '')
                updateData.panNumber = undefined;
            if (updateData.profilePicture === '')
                updateData.profilePicture = undefined;
        }
        return await user_model_1.UserModel.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: false });
    }
    /**
     * Delete user by ID (soft delete)
     */
    async delete(id) {
        return await user_model_1.UserModel.findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true });
    }
    /**
     * Hard delete user by ID
     */
    async hardDelete(id) {
        return await user_model_1.UserModel.findByIdAndDelete(id);
    }
    /**
     * Find users by department
     */
    async findByDepartment(departmentId) {
        return await user_model_1.UserModel.find({ 'professionalDetails.department': departmentId, isActive: true })
            .populate('professionalDetails.reportingManager', 'firstName lastName email');
    }
    /**
     * Find users by role
     */
    async findByRole(role) {
        return await user_model_1.UserModel.find({ role, isActive: true })
            .populate('professionalDetails.department', 'name code')
            .populate('professionalDetails.designation', 'name code level');
    }
    /**
     * Get users with birthdays today
     */
    async getBirthdaysToday() {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        return await user_model_1.UserModel.aggregate([
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
                    isActive: true
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
                    birthMonth: 0,
                    birthDay: 0
                }
            }
        ]);
    }
    /**
     * Get recently joined users
     */
    async getNewHires(days = 30) {
        const today = new Date();
        const dateThreshold = new Date();
        dateThreshold.setDate(dateThreshold.getDate() - days);
        return await user_model_1.UserModel.aggregate([
            // 1️⃣ Only active users
            {
                $match: {
                    isActive: true,
                    "professionalDetails.joiningDate": { $gte: dateThreshold }
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
            // 4️⃣ Lookup New Hire Announcements
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
                                        { $eq: ["$announcementType", "NEWHIRES"] },
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
                    as: "newHireAnnouncements"
                }
            },
            // 5️⃣ Final response shape
            {
                $project: {
                    password: 0,
                    emailVerificationToken: 0,
                    passwordResetToken: 0,
                    passwordResetExpires: 0
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
    async updateLastLogin(id) {
        await user_model_1.UserModel.findByIdAndUpdate(id, { lastLogin: new Date() });
    }
    /**
     * Search users
     */
    async search(searchTerm) {
        return await user_model_1.UserModel.find({
            $or: [
                { firstName: { $regex: searchTerm, $options: 'i' } },
                { lastName: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } },
                { 'professionalDetails.employeeId': { $regex: searchTerm, $options: 'i' } }
            ],
            isActive: true
        })
            .populate('professionalDetails.department', 'name code')
            .populate('professionalDetails.designation', 'name code level')
            .limit(20);
    }
    /**
     * Get user count by status
     */
    async getUserStats() {
        return await user_model_1.UserModel.aggregate([
            {
                $group: {
                    _id: '$professionalDetails.employmentStatus',
                    count: { $sum: 1 }
                }
            }
        ]);
    }
    async getAnniversaryToday() {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        return await user_model_1.UserModel.aggregate([
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
                    isActive: true
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
                    anniversaryMonth: 0,
                    anniversary: 0
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
    async getTodayAttendanceOverview() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return await user_model_1.UserModel.aggregate([
            // 1️⃣ Active employees only
            {
                $match: {
                    isActive: true,
                    role: "EMPLOYEE"
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
                                checkInTime: 1,
                                isLate: 1
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
                                $cond: [
                                    { $eq: ["$todayAttendance.isLate", true] },
                                    "LATE",
                                    "ON_TIME"
                                ]
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
                    "professionalDetails.employeeId": 1,
                    "professionalDetails.department": 1,
                    attendanceStatus: 1,
                    checkInTime: "$todayAttendance.checkInTime"
                }
            }
        ]);
    }
    async getYetToCheckInCount() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const result = await user_model_1.UserModel.aggregate([
            {
                $match: {
                    isActive: true,
                    role: 'EMPLOYEE'
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
exports.UserDAL = UserDAL;
exports.userDAL = new UserDAL();
//# sourceMappingURL=user.dal.js.map