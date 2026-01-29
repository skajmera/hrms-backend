/**
 * Application Constants
 * Centralized constants for the HRMS application
 */

export const USER_ROLES = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    HR_ADMIN: 'HR_ADMIN',
    MANAGER: 'MANAGER',
    EMPLOYEE: 'EMPLOYEE'
  } as const;
  
  export const LEAVE_STATUS = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    CANCELLED: 'CANCELLED'
  } as const;
  
  export const LEAVE_TYPES = {
    CASUAL: 'CASUAL',
    SICK: 'SICK',
    EARNED: 'EARNED',
    MATERNITY: 'MATERNITY',
    PATERNITY: 'PATERNITY',
    UNPAID: 'UNPAID'
  } as const;
  
  export const ATTENDANCE_STATUS = {
    PRESENT: 'PRESENT',
    ABSENT: 'ABSENT',
    HALF_DAY: 'HALF_DAY',
    LATE: 'LATE',
    WFH: 'WFH',
    ON_LEAVE: 'ON_LEAVE'
  } as const;
  
  export const SHIFT_TYPES = {
    MORNING: 'MORNING',    // 9 AM - 6 PM
    EVENING: 'EVENING',    // 2 PM - 11 PM
    NIGHT: 'NIGHT',        // 10 PM - 7 AM
    FLEXIBLE: 'FLEXIBLE'   // Flexible hours
  } as const;
  
  export const EMPLOYMENT_STATUS = {
    ACTIVE: 'ACTIVE',
    PROBATION: 'PROBATION',
    RESIGNED: 'RESIGNED',
    TERMINATED: 'TERMINATED',
    RETIRED: 'RETIRED'
  } as const;
  
  export const PAYMENT_STATUS = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    PAID: 'PAID',
    FAILED: 'FAILED'
  } as const;
  
  export const ANNOUNCEMENT_PRIORITY = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL'
  } as const;
  
  export const HTTP_STATUS = {
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
  } as const;
  
  export const LEAVE_BALANCE_CONFIG = {
    CASUAL: 12,      // 12 days per year
    SICK: 10,        // 10 days per year
    EARNED: 15       // 15 days per year
  } as const;
  
  export const PAGINATION_DEFAULTS = {
    PAGE: 1,
    LIMIT: 10,
    MAX_LIMIT: 100
  } as const;