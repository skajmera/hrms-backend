import { OrganizationDAL } from '../dal/organization.dal';
import { holidayDAL } from '../dal/holiday.dal';

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

export async function getWorkingDaysForMonth(year: number, month: number, organizationId?: string): Promise<number> {
  const totalDays = new Date(year, month, 0).getDate();
  let workingDaysConfig: Record<string, boolean> = { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: false, sunday: false };

  if (organizationId) {
    const org = await OrganizationDAL.findById(organizationId);
    if (org?.settings?.workingDays) {
      workingDaysConfig = { ...org.settings.workingDays } as Record<string, boolean>;
    }
  }

  const allHolidays = await holidayDAL.getHolidaysByYear(year);
  const monthHolidays = allHolidays.filter(h => new Date(h.date).getMonth() + 1 === month);
  const isHoliday = (date: Date) =>
    monthHolidays.some(h => {
      const hd = new Date(h.date);
      return hd.getFullYear() === date.getFullYear() && hd.getMonth() === date.getMonth() && hd.getDate() === date.getDate();
    });

  let count = 0;
  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(year, month - 1, day);
    const key = DAY_KEYS[date.getDay()];
    if (workingDaysConfig[key] && !isHoliday(date)) count++;
  }
  return count;
}
