import cron from 'node-cron';
import { UserModel } from '../models/user.model';
import { AttendanceModel } from '../models/attendance.model';
import { LeaveModel } from '../models/leave.model';
import { OrganizationDAL } from '../dal/organization.dal';
import { holidayDAL } from '../dal/holiday.dal';
import { ATTENDANCE_STATUS, EMPLOYMENT_STATUS, LEAVE_STATUS, SHIFT_TYPES } from '../../config/constants';

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

function dayBounds(d: Date): { start: Date; end: Date } {
  const start = new Date(d);
  start.setHours(0, 0, 0, 0);
  const end = new Date(d);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

async function shouldSkipBecauseHoliday(date: Date): Promise<boolean> {
  const holidays = await holidayDAL.getHolidaysByYear(date.getFullYear());
  return holidays.some(h => isSameDay(new Date(h.date as any), date));
}

async function isWorkingDayForOrg(date: Date, organizationId: string): Promise<boolean> {
  const key = DAY_KEYS[date.getDay()];
  const org = await OrganizationDAL.findById(organizationId);
  const cfg = {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
    ...(org?.settings?.workingDays as any)
  } as Record<string, boolean>;
  return !!cfg[key];
}

export async function markAbsentForToday(): Promise<{ inserted: number; skipped: boolean }> {
  const now = new Date();
  const { start, end } = dayBounds(now);

  if (await shouldSkipBecauseHoliday(now)) return { inserted: 0, skipped: true };

  const users = await UserModel.find({
    isActive: true,
    role: 'EMPLOYEE',
    'professionalDetails.employmentStatus': { $in: [EMPLOYMENT_STATUS.ACTIVE, EMPLOYMENT_STATUS.PROBATION] }
  })
    .select('_id organizationId professionalDetails.shift')
    .lean();

  const byOrg = new Map<string, { userId: string; shift?: string }[]>();
  for (const u of users as any[]) {
    const orgId = u.organizationId?.toString?.() ?? String(u.organizationId ?? '');
    if (!orgId) continue;
    const arr = byOrg.get(orgId) || [];
    arr.push({ userId: u._id.toString(), shift: u?.professionalDetails?.shift });
    byOrg.set(orgId, arr);
  }

  let inserted = 0;
  for (const [orgId, orgUsers] of byOrg.entries()) {
    const working = await isWorkingDayForOrg(now, orgId);
    if (!working) continue;

    const userIds = orgUsers.map(u => u.userId);

    const [onLeave, alreadyMarked] = await Promise.all([
      LeaveModel.find({
        status: LEAVE_STATUS.APPROVED,
        userId: { $in: userIds },
        startDate: { $lte: end },
        endDate: { $gte: start }
      })
        .select('userId')
        .lean(),
      AttendanceModel.find({
        userId: { $in: userIds },
        date: { $gte: start, $lte: end }
      })
        .select('userId')
        .lean()
    ]);

    const leaveSet = new Set((onLeave as any[]).map(l => l.userId.toString()));
    const attendanceSet = new Set((alreadyMarked as any[]).map(a => a.userId.toString()));

    const missing = orgUsers.filter(u => !leaveSet.has(u.userId) && !attendanceSet.has(u.userId));
    if (!missing.length) continue;

    const docs = missing.map(u => ({
      userId: u.userId,
      date: start,
      status: ATTENDANCE_STATUS.ABSENT,
      shift: (u.shift as any) || SHIFT_TYPES.MORNING,
      isApproved: true
    }));

    try {
      const res: any = await AttendanceModel.insertMany(docs, { ordered: false });
      inserted += Array.isArray(res) ? res.length : 0;
    } catch (e: any) {
      // Duplicate key errors are fine (multiple instances running job).
      inserted += Array.isArray(e?.insertedDocs) ? e.insertedDocs.length : 0;
    }
  }

  return { inserted, skipped: false };
}

export function registerAbsentMarkingJob(): void {
  if (process.env.DISABLE_ABSENT_CRON === 'true') return;
  const tz = process.env.CRON_TZ || process.env.TZ || 'Asia/Kolkata';
  // Temporary test schedule: every day at 16:00 (4 PM)
  cron.schedule(
    '0 16 * * *',
    async () => {
      try {
        const r = await markAbsentForToday();
        console.log('[Attendance][AutoAbsent]', { date: new Date().toISOString(), ...r });
      } catch (err: any) {
        console.error('[Attendance][AutoAbsent][Error]', err?.message || err);
      }
    },
    { timezone: tz }
  );
}

