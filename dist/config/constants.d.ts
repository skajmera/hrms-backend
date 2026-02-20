/**
 * Application Constants
 * Centralized constants for the HRMS application
 */
export declare const USER_ROLES: {
    readonly SUPER_ADMIN: "SUPER_ADMIN";
    readonly HR_ADMIN: "HR_ADMIN";
    readonly MANAGER: "MANAGER";
    readonly EMPLOYEE: "EMPLOYEE";
};
export declare const LEAVE_STATUS: {
    readonly PENDING: "PENDING";
    readonly APPROVED: "APPROVED";
    readonly REJECTED: "REJECTED";
    readonly CANCELLED: "CANCELLED";
};
export declare const LEAVE_TYPES: {
    readonly CASUAL: "CASUAL";
    readonly SICK: "SICK";
    readonly EARNED: "EARNED";
    readonly MATERNITY: "MATERNITY";
    readonly PATERNITY: "PATERNITY";
    readonly UNPAID: "UNPAID";
};
export declare const ATTENDANCE_STATUS: {
    readonly PRESENT: "PRESENT";
    readonly ABSENT: "ABSENT";
    readonly HALF_DAY: "HALF_DAY";
    readonly LATE: "LATE";
    readonly WFH: "WFH";
    readonly ON_LEAVE: "ON_LEAVE";
};
export declare const SHIFT_TYPES: {
    readonly MORNING: "MORNING";
    readonly EVENING: "EVENING";
    readonly NIGHT: "NIGHT";
    readonly FLEXIBLE: "FLEXIBLE";
};
export declare const EMPLOYMENT_STATUS: {
    readonly ACTIVE: "ACTIVE";
    readonly PROBATION: "PROBATION";
    readonly RESIGNED: "RESIGNED";
    readonly TERMINATED: "TERMINATED";
    readonly RETIRED: "RETIRED";
};
export declare const PAYMENT_STATUS: {
    readonly PENDING: "PENDING";
    readonly PROCESSING: "PROCESSING";
    readonly PAID: "PAID";
    readonly FAILED: "FAILED";
};
export declare const ANNOUNCEMENT_PRIORITY: {
    readonly LOW: "LOW";
    readonly MEDIUM: "MEDIUM";
    readonly HIGH: "HIGH";
    readonly CRITICAL: "CRITICAL";
};
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly ACCEPTED: 202;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly INTERNAL_SERVER_ERROR: 500;
    readonly SERVICE_UNAVAILABLE: 503;
};
export declare const LEAVE_BALANCE_CONFIG: {
    readonly CASUAL: 12;
    readonly SICK: 10;
    readonly EARNED: 15;
};
export declare const PAGINATION_DEFAULTS: {
    readonly PAGE: 1;
    readonly LIMIT: 10;
    readonly MAX_LIMIT: 100;
};
export declare const SHIFT_TIMINGS: {
    readonly MORNING: {
        readonly startTime: "09:00";
        readonly endTime: "18:00";
        readonly gracePeriod: 15;
        readonly minimumHours: 8;
    };
    readonly EVENING: {
        readonly startTime: "14:00";
        readonly endTime: "23:00";
        readonly gracePeriod: 15;
        readonly minimumHours: 8;
    };
    readonly NIGHT: {
        readonly startTime: "22:00";
        readonly endTime: "07:00";
        readonly gracePeriod: 15;
        readonly minimumHours: 8;
    };
    readonly FLEXIBLE: {
        readonly startTime: "00:00";
        readonly endTime: "23:59";
        readonly gracePeriod: 0;
        readonly minimumHours: 8;
    };
};
export declare const EMPLOYMENT_TYPE: {
    readonly INTERN: "INTERN";
    readonly FULL_TIME: "FULL_TIME";
    readonly PART_TIME: "PART_TIME";
    readonly CONTRACT: "CONTRACT";
    readonly CONSULTANT: "CONSULTANT";
};
//# sourceMappingURL=constants.d.ts.map