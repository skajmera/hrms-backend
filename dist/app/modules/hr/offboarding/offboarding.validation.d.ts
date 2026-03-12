export declare class OffboardingValidation {
    /**
     * Validation for creating resignation request
     */
    static createResignation: import("express-validator").ValidationChain[];
    /**
     * Validation for updating resignation
     */
    static updateResignation: import("express-validator").ValidationChain[];
    /**
     * Validation for approving resignation
     */
    static approveResignation: import("express-validator").ValidationChain[];
    /**
     * Validation for rejecting resignation
     */
    static rejectResignation: import("express-validator").ValidationChain[];
    /**
     * Validation for offboarding ID param
     */
    static offboardingId: import("express-validator").ValidationChain[];
    /**
     * Validation for query params
     */
    static getResignations: import("express-validator").ValidationChain[];
    /**
     * Validation for scheduling exit interview
     */
    static scheduleExitInterview: import("express-validator").ValidationChain[];
}
//# sourceMappingURL=offboarding.validation.d.ts.map