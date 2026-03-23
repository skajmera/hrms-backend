import cron from 'node-cron';
import { AttendanceModel } from '../models/attendance.model';
import { UserModel } from '../models/user.model';
import { ShiftHelper } from '../utils/shiftHelper';
import { EMPLOYMENT_STATUS } from '../../config/constants';

function dayBounds(d: Date): { start: Date; end: Date } {
  const start = new Date(d);
  start.setHours(0, 0, 0, 0);
  const end = new Date(d);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export async function autoCheckoutForToday(): Promise<{ updated: number; skipped: number }> {
  const now = new Date();
  const { start, end } = dayBounds(now);

  // Only records that have check-in but not check-out.
  const records = await AttendanceModel.find({
    date: { $gte: start, $lte: end },
    checkInTime: { $ne: null },
    $or: [{ checkOutTime: null }, { checkOutTime: { $exists: false } }]
  })
    .select('userId checkInTime shift')
    .lean();

  if (!records.length) return { updated: 0, skipped: 0 };

  const userIds = Array.from(new Set(records.map(r => String(r.userId))));

  const users = await UserModel.find({
    _id: { $in: userIds },
    isActive: true,
    role: 'EMPLOYEE',
    'professionalDetails.employmentStatus': { $in: [EMPLOYMENT_STATUS.ACTIVE, EMPLOYMENT_STATUS.PROBATION] }
  })
    .select('_id professionalDetails.shiftTime')
    .lean();

  const shiftByUserId = new Map<string, any>();
  for (const u of users as any[]) {
    const shiftTime = u?.professionalDetails?.shiftTime;
    if (shiftTime) shiftByUserId.set(String(u._id), shiftTime);
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
    const checkInTime = r.checkInTime ? new Date(r.checkInTime as any) : null;
    if (!checkInTime) {
      skipped++;
      continue;
    }

    const workingHours = ShiftHelper.calculateWorkingHours(checkInTime, checkOutTime);
    const overtimeHours = ShiftHelper.calculateOvertimeHours(workingHours, shiftTime);

    const earlyExitCheck = ShiftHelper.isEarlyExit(checkOutTime, shiftTime);

    const attendanceId = (r as any)?._id?.toString?.() ?? (r as any)?._id;
    if (!attendanceId) {
      skipped++;
      continue;
    }

    await AttendanceModel.findByIdAndUpdate(
      attendanceId,
      {
        $set: {
          checkOutTime,
          workingHours,
          overtimeHours,
          earlyExit: earlyExitCheck.earlyExit,
          earlyExitByMinutes: earlyExitCheck.earlyExitByMinutes
        }
      },
      { new: true }
    );
    updated++;
  }

  return { updated, skipped };
}

export function registerAutoCheckoutJob(): void {
  if (process.env.DISABLE_AUTO_CHECKOUT_CRON === 'true') return;
  const tz = process.env.CRON_TZ || process.env.TZ || 'Asia/Kolkata';

  cron.schedule(
    '30 23 * * *',
    async () => {
      try {
        const r = await autoCheckoutForToday();
        console.log('[Attendance][AutoCheckout]', { date: new Date().toISOString(), ...r });
      } catch (err: any) {
        console.error('[Attendance][AutoCheckout][Error]', err?.message || err);
      }
    },
    { timezone: tz }
  );
}

