"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoCheckoutForToday = autoCheckoutForToday;
exports.registerAutoCheckoutJob = registerAutoCheckoutJob;
const node_cron_1 = __importDefault(require("node-cron"));
const attendance_model_1 = require("../models/attendance.model");
const user_model_1 = require("../models/user.model");
const shiftHelper_1 = require("../utils/shiftHelper");
const constants_1 = require("../../config/constants");
function dayBounds(d) {
    const start = new Date(d);
    start.setHours(0, 0, 0, 0);
    const end = new Date(d);
    end.setHours(23, 59, 59, 999);
    return { start, end };
}
async function autoCheckoutForToday() {
    const now = new Date();
    const { start, end } = dayBounds(now);
    // Only records that have check-in but not check-out.
    const records = await attendance_model_1.AttendanceModel.find({
        date: { $gte: start, $lte: end },
        checkInTime: { $ne: null },
        $or: [{ checkOutTime: null }, { checkOutTime: { $exists: false } }]
    })
        .select('userId checkInTime shift')
        .lean();
    if (!records.length)
        return { updated: 0, skipped: 0 };
    const userIds = Array.from(new Set(records.map(r => String(r.userId))));
    const users = await user_model_1.UserModel.find({
        _id: { $in: userIds },
        isActive: true,
        role: 'EMPLOYEE',
        'professionalDetails.employmentStatus': { $in: [constants_1.EMPLOYMENT_STATUS.ACTIVE, constants_1.EMPLOYMENT_STATUS.PROBATION] }
    })
        .select('_id professionalDetails.shiftTime')
        .lean();
    const shiftByUserId = new Map();
    for (const u of users) {
        const shiftTime = u?.professionalDetails?.shiftTime;
        if (shiftTime)
            shiftByUserId.set(String(u._id), shiftTime);
    }
    let updated = 0;
    let skipped = 0;
    // Update sequentially to keep code robust.
    // If later you need faster bulk updates, we can refactor to bulkWrite safely.
    for (const r of records) {
        const userIdStr = String(r.userId);
        const shiftTime = shiftByUserId.get(userIdStr);
        if (!shiftTime) {
            skipped++;
            continue;
        }
        const checkOutTime = now;
        const checkInTime = r.checkInTime ? new Date(r.checkInTime) : null;
        if (!checkInTime) {
            skipped++;
            continue;
        }
        const workingHours = shiftHelper_1.ShiftHelper.calculateWorkingHours(checkInTime, checkOutTime);
        const overtimeHours = shiftHelper_1.ShiftHelper.calculateOvertimeHours(workingHours, shiftTime);
        const earlyExitCheck = shiftHelper_1.ShiftHelper.isEarlyExit(checkOutTime, shiftTime);
        const attendanceId = r?._id?.toString?.() ?? r?._id;
        if (!attendanceId) {
            skipped++;
            continue;
        }
        await attendance_model_1.AttendanceModel.findByIdAndUpdate(attendanceId, {
            $set: {
                checkOutTime,
                workingHours,
                overtimeHours,
                earlyExit: earlyExitCheck.earlyExit,
                earlyExitByMinutes: earlyExitCheck.earlyExitByMinutes
            }
        }, { new: true });
        updated++;
    }
    return { updated, skipped };
}
function registerAutoCheckoutJob() {
    if (process.env.DISABLE_AUTO_CHECKOUT_CRON === 'true')
        return;
    const tz = process.env.CRON_TZ || process.env.TZ || 'Asia/Kolkata';
    node_cron_1.default.schedule('30 23 * * *', async () => {
        try {
            const r = await autoCheckoutForToday();
            console.log('[Attendance][AutoCheckout]', { date: new Date().toISOString(), ...r });
        }
        catch (err) {
            console.error('[Attendance][AutoCheckout][Error]', err?.message || err);
        }
    }, { timezone: tz });
}
//# sourceMappingURL=auto-checkout.job.js.map