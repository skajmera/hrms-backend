"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftHelper = void 0;
class ShiftHelper {
    static roundToTwo(value) {
        return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
    }
    /**
     * Check if employee is late based on shift time
     */
    static isLate(checkInTime, shiftTime) {
        const checkInHours = checkInTime.getHours();
        const checkInMinutes = checkInTime.getMinutes();
        const checkInTotalMinutes = checkInHours * 60 + checkInMinutes;
        const [shiftStartHours, shiftStartMinutes] = shiftTime.startTime.split(':').map(Number);
        const shiftStartTotalMinutes = shiftStartHours * 60 + shiftStartMinutes;
        const gracePeriod = shiftTime.gracePeriod || 15;
        const allowedStartTime = shiftStartTotalMinutes + gracePeriod;
        if (checkInTotalMinutes > allowedStartTime) {
            const lateByMinutes = checkInTotalMinutes - shiftStartTotalMinutes;
            return { isLate: true, lateByMinutes };
        }
        return { isLate: false, lateByMinutes: 0 };
    }
    /**
     * Check if employee left early
     */
    static isEarlyExit(checkOutTime, shiftTime) {
        const checkOutHours = checkOutTime.getHours();
        const checkOutMinutes = checkOutTime.getMinutes();
        const checkOutTotalMinutes = checkOutHours * 60 + checkOutMinutes;
        const [shiftEndHours, shiftEndMinutes] = shiftTime.endTime.split(':').map(Number);
        let shiftEndTotalMinutes = shiftEndHours * 60 + shiftEndMinutes;
        // Handle night shift (crosses midnight)
        if (shiftEndHours < 12 && shiftTime.startTime.startsWith('2')) {
            shiftEndTotalMinutes += 24 * 60;
        }
        if (checkOutTotalMinutes < shiftEndTotalMinutes) {
            const earlyExitByMinutes = shiftEndTotalMinutes - checkOutTotalMinutes;
            return { earlyExit: true, earlyExitByMinutes };
        }
        return { earlyExit: false, earlyExitByMinutes: 0 };
    }
    /**
     * Calculate working hours
     */
    static calculateWorkingHours(checkInTime, checkOutTime, breakHours = 0) {
        const diffMs = checkOutTime.getTime() - checkInTime.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        return this.roundToTwo(Math.max(0, diffHours - breakHours));
    }
    /**
     * Calculate overtime hours
     */
    static calculateOvertimeHours(workingHours, shiftTime) {
        const minimumHours = shiftTime.minimumHours || 8;
        return this.roundToTwo(Math.max(0, workingHours - minimumHours));
    }
    /**
     * Check if working hours meet minimum requirement
     */
    static meetsMinimumHours(workingHours, shiftTime) {
        const minimumHours = shiftTime.minimumHours || 8;
        return workingHours >= minimumHours;
    }
    /**
     * Get shift status based on check-in time
     */
    static getShiftStatus(checkInTime, shiftTime) {
        if (!checkInTime)
            return 'NOT_MARKED';
        const { isLate } = this.isLate(checkInTime, shiftTime);
        return isLate ? 'LATE' : 'ON_TIME';
    }
    /**
     * Parse time string to minutes
     */
    static timeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }
    /**
     * Convert minutes to time string
     */
    static minutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }
    /**
     * Check if current time is within shift time
     */
    static isWithinShift(currentTime, shiftTime) {
        const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
        const startMinutes = this.timeToMinutes(shiftTime.startTime);
        const endMinutes = this.timeToMinutes(shiftTime.endTime);
        // Handle shift crossing midnight
        if (endMinutes < startMinutes) {
            return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
        }
        return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    }
}
exports.ShiftHelper = ShiftHelper;
//# sourceMappingURL=shiftHelper.js.map