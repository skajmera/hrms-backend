"use strict";
/**
 * Application Constants
 * Centralized constants for the HRMS application
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMPLOYMENT_TYPE = exports.SHIFT_TIMINGS = exports.PAGINATION_DEFAULTS = exports.LEAVE_BALANCE_CONFIG = exports.HTTP_STATUS = exports.ANNOUNCEMENT_PRIORITY = exports.PAYMENT_STATUS = exports.EMPLOYMENT_STATUS = exports.SHIFT_TYPES = exports.ATTENDANCE_STATUS = exports.LEAVE_TYPES = exports.LEAVE_STATUS = exports.USER_ROLES = void 0;
exports.USER_ROLES = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    HR_ADMIN: 'HR_ADMIN',
    MANAGER: 'MANAGER',
    EMPLOYEE: 'EMPLOYEE'
};
exports.LEAVE_STATUS = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    CANCELLED: 'CANCELLED'
};
exports.LEAVE_TYPES = {
    CASUAL: 'CASUAL',
    SICK: 'SICK',
    EARNED: 'EARNED',
    MATERNITY: 'MATERNITY',
    PATERNITY: 'PATERNITY',
    UNPAID: 'UNPAID'
};
exports.ATTENDANCE_STATUS = {
    PRESENT: 'PRESENT',
    ABSENT: 'ABSENT',
    HALF_DAY: 'HALF_DAY',
    LATE: 'LATE',
    WFH: 'WFH',
    ON_LEAVE: 'ON_LEAVE'
};
exports.SHIFT_TYPES = {
    MORNING: 'MORNING', // 9 AM - 6 PM
    EVENING: 'EVENING', // 2 PM - 11 PM
    NIGHT: 'NIGHT', // 10 PM - 7 AM
    FLEXIBLE: 'FLEXIBLE' // Flexible hours
};
// export const SHIFT_TIME = {
//   startTime: {
//     type: String, 
//     required: true
//   },
//   endTime: {
//     type: String, 
//     required: true
//   }
// } as const;
exports.EMPLOYMENT_STATUS = {
    ACTIVE: 'ACTIVE',
    PROBATION: 'PROBATION',
    RESIGNED: 'RESIGNED',
    TERMINATED: 'TERMINATED',
    RETIRED: 'RETIRED',
    DRAFT: 'DRAFT'
};
exports.PAYMENT_STATUS = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    PAID: 'PAID',
    FAILED: 'FAILED'
};
exports.ANNOUNCEMENT_PRIORITY = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL'
};
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
};
exports.LEAVE_BALANCE_CONFIG = {
    CASUAL: 12, // 12 days per year
    SICK: 10, // 10 days per year
    EARNED: 15 // 15 days per year
};
exports.PAGINATION_DEFAULTS = {
    PAGE: 1,
    LIMIT: 10,
    MAX_LIMIT: 100
};
// export const EMPLOYMENT_TYPE = {
//   INTERN: 'INTERN',
//   PERMANENT: 'PERMANENT',
//   CONTRACT: 'CONTRACT'
// } as const;
exports.SHIFT_TIMINGS = {
    MORNING: {
        startTime: '09:00',
        endTime: '18:00',
        gracePeriod: 15, // minutes
        minimumHours: 8
    },
    EVENING: {
        startTime: '14:00',
        endTime: '23:00',
        gracePeriod: 15,
        minimumHours: 8
    },
    NIGHT: {
        startTime: '22:00',
        endTime: '07:00',
        gracePeriod: 15,
        minimumHours: 8
    },
    FLEXIBLE: {
        startTime: '00:00',
        endTime: '23:59',
        gracePeriod: 0,
        minimumHours: 8
    }
};
exports.EMPLOYMENT_TYPE = {
    INTERN: 'INTERN',
    FULL_TIME: 'FULL_TIME',
    PART_TIME: 'PART_TIME',
    CONTRACT: 'CONTRACT',
    CONSULTANT: 'CONSULTANT'
};
//# sourceMappingURL=constants.js.map