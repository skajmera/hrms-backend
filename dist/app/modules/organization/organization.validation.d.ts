export declare class OrganizationValidation {
    /**
     * Validation for creating organization
     */
    static createOrganization: import("express-validator").ValidationChain[];
    /**
     * Validation for updating organization
     */
    static updateOrganization: import("express-validator").ValidationChain[];
    /**
     * Validation for organization ID
     */
    static organizationId: import("express-validator").ValidationChain[];
    /**
     * Validation for settings update
     */
    static updateSettings: import("express-validator").ValidationChain[];
    /**
     * Validation for admin management
     */
    static manageAdmin: import("express-validator").ValidationChain[];
    /**
     * Validation for adding office location
     */
    static addOfficeLocation: import("express-validator").ValidationChain[];
    /**
     * Validation for updating office location
     */
    static updateOfficeLocation: import("express-validator").ValidationChain[];
    /**
     * Validation for adding WiFi network
     */
    static addWifiNetwork: import("express-validator").ValidationChain[];
    /**
     * Validation for updating WiFi network
     */
    static updateWifiNetwork: import("express-validator").ValidationChain[];
    /**
     * Generic Mongo ID validation for params
     */
    static paramId: import("express-validator").ValidationChain[];
}
//# sourceMappingURL=organization.validation.d.ts.map