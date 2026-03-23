"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAbsentForToday = markAbsentForToday;
exports.registerAbsentMarkingJob = registerAbsentMarkingJob;
const node_cron_1 = __importDefault(require("node-cron"));
const user_model_1 = require("../models/user.model");
const attendance_model_1 = require("../models/attendance.model");
const leave_model_1 = require("../models/leave.model");
const organization_dal_1 = require("../dal/organization.dal");
const holiday_dal_1 = require("../dal/holiday.dal");
const constants_1 = require("../../config/constants");
const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
function dayBounds(d) {
    const start = new Date(d);
    start.setHours(0, 0, 0, 0);
    const end = new Date(d);
    end.setHours(23, 59, 59, 999);
    return { start, end };
}
function isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
async function shouldSkipBecauseHoliday(date) {
    const holidays = await holiday_dal_1.holidayDAL.getHolidaysByYear(date.getFullYear());
    return holidays.some(h => isSameDay(new Date(h.date), date));
}
async function isWorkingDayForOrg(date, organizationId) {
    const key = DAY_KEYS[date.getDay()];
    const org = await organization_dal_1.OrganizationDAL.findById(organizationId);
    const cfg = {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false,
        ...org?.settings?.workingDays
    };
    return !!cfg[key];
}
async function markAbsentForToday() {
    const now = new Date();
    const { start, end } = dayBounds(now);
    if (await shouldSkipBecauseHoliday(now))
        return { inserted: 0, skipped: true };
    const users = await user_model_1.UserModel.find({
        isActive: true,
        role: 'EMPLOYEE',
        'professionalDetails.employmentStatus': { $in: [constants_1.EMPLOYMENT_STATUS.ACTIVE, constants_1.EMPLOYMENT_STATUS.PROBATION] }
    })
        .select('_id organizationId professionalDetails.shift')
        .lean();
    const byOrg = new Map();
    for (const u of users) {
        const orgId = u.organizationId?.toString?.() ?? String(u.organizationId ?? '');
        if (!orgId)
            continue;
        const arr = byOrg.get(orgId) || [];
        arr.push({ userId: u._id.toString(), shift: u?.professionalDetails?.shift });
        byOrg.set(orgId, arr);
    }
    let inserted = 0;
    for (const [orgId, orgUsers] of byOrg.entries()) {
        const working = await isWorkingDayForOrg(now, orgId);
        if (!working)
            continue;
        const userIds = orgUsers.map(u => u.userId);
        const [onLeave, alreadyMarked] = await Promise.all([
            leave_model_1.LeaveModel.find({
                status: constants_1.LEAVE_STATUS.APPROVED,
                userId: { $in: userIds },
                startDate: { $lte: end },
                endDate: { $gte: start }
            })
                .select('userId')
                .lean(),
            attendance_model_1.AttendanceModel.find({
                userId: { $in: userIds },
                date: { $gte: start, $lte: end }
            })
                .select('userId')
                .lean()
        ]);
        const leaveSet = new Set(onLeave.map(l => l.userId.toString()));
        const attendanceSet = new Set(alreadyMarked.map(a => a.userId.toString()));
        const missing = orgUsers.filter(u => !leaveSet.has(u.userId) && !attendanceSet.has(u.userId));
        if (!missing.length)
            continue;
        const docs = missing.map(u => ({
            userId: u.userId,
            date: start,
            status: constants_1.ATTENDANCE_STATUS.ABSENT,
            shift: u.shift || constants_1.SHIFT_TYPES.MORNING,
            isApproved: true
        }));
        try {
            const res = await attendance_model_1.AttendanceModel.insertMany(docs, { ordered: false });
            inserted += Array.isArray(res) ? res.length : 0;
        }
        catch (e) {
            // Duplicate key errors are fine (multiple instances running job).
            inserted += Array.isArray(e?.insertedDocs) ? e.insertedDocs.length : 0;
        }
    }
    return { inserted, skipped: false };
}
function registerAbsentMarkingJob() {
    if (process.env.DISABLE_ABSENT_CRON === 'true')
        return;
    const tz = process.env.CRON_TZ || process.env.TZ || 'Asia/Kolkata';
    // Temporary test schedule: every day at 16:00 (4 PM)
    node_cron_1.default.schedule('0 16 * * *', async () => {
        try {
            const r = await markAbsentForToday();
            console.log('[Attendance][AutoAbsent]', { date: new Date().toISOString(), ...r });
        }
        catch (err) {
            console.error('[Attendance][AutoAbsent][Error]', err?.message || err);
        }
    }, { timezone: tz });
}
//# sourceMappingURL=absent-marking.job.js.map