"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkingDaysForMonth = getWorkingDaysForMonth;
const organization_dal_1 = require("../dal/organization.dal");
const holiday_dal_1 = require("../dal/holiday.dal");
const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
async function getWorkingDaysForMonth(year, month, organizationId) {
    const totalDays = new Date(year, month, 0).getDate();
    let workingDaysConfig = { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: false, sunday: false };
    if (organizationId) {
        const org = await organization_dal_1.OrganizationDAL.findById(organizationId);
        if (org?.settings?.workingDays) {
            workingDaysConfig = { ...org.settings.workingDays };
        }
    }
    const allHolidays = await holiday_dal_1.holidayDAL.getHolidaysByYear(year);
    const monthHolidays = allHolidays.filter(h => new Date(h.date).getMonth() + 1 === month);
    const isHoliday = (date) => monthHolidays.some(h => {
        const hd = new Date(h.date);
        return hd.getFullYear() === date.getFullYear() && hd.getMonth() === date.getMonth() && hd.getDate() === date.getDate();
    });
    let count = 0;
    for (let day = 1; day <= totalDays; day++) {
        const date = new Date(year, month - 1, day);
        const key = DAY_KEYS[date.getDay()];
        if (workingDaysConfig[key] && !isHoliday(date))
            count++;
    }
    return count;
}
//# sourceMappingURL=workingDays.js.map