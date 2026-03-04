"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachOrganization = exports.checkOrganizationAccess = void 0;
const organization_dal_1 = require("../dal/organization.dal");
const constants_1 = require("../../config/constants");
/**
 * Middleware to check if user belongs to organization
 */
const checkOrganizationAccess = async (req, res, next) => {
    try {
        const organizationId = req.params.id || req.body.organizationId || req.query.organizationId;
        const userId = req.user?.id;
        if (!organizationId) {
            res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                status: 'error',
                message: 'Organization ID is required'
            });
            return;
        }
        const hasAccess = await organization_dal_1.OrganizationDAL.isUserInOrganization(organizationId, userId);
        if (!hasAccess) {
            res.status(constants_1.HTTP_STATUS.FORBIDDEN).json({
                status: 'error',
                message: 'You do not have access to this organization'
            });
            return;
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.checkOrganizationAccess = checkOrganizationAccess;
/**
 * Middleware to attach user's organization to request
 */
const attachOrganization = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const organization = await organization_dal_1.OrganizationDAL.findByOwner(userId);
        if (organization) {
            req.user = {
                ...req.user,
                organizationId: organization._id.toString()
            };
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.attachOrganization = attachOrganization;
//# sourceMappingURL=organization.middleware.js.map