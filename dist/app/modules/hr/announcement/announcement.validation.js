"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryAnnouncementsValidation = exports.createAnnouncementValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createAnnouncementValidation = [
    (0, express_validator_1.body)('title').trim().notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('content').trim().notEmpty().withMessage('Content is required'),
    (0, express_validator_1.body)('priority').isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).withMessage('Valid priority is required'),
    (0, express_validator_1.body)('startDate').isISO8601().withMessage('Valid start date is required'),
    (0, express_validator_1.body)('targetAudience.isGlobal').isBoolean().withMessage('isGlobal must be boolean')
];
exports.queryAnnouncementsValidation = [
    // pagination & sorting are validated globally or elsewhere; repeat minimal checks
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('sortBy').optional().isString(),
    (0, express_validator_1.query)('sortOrder').optional().isIn(['asc', 'desc']),
    // new filter parameters
    (0, express_validator_1.query)('startDate').optional().isISO8601().withMessage('startDate must be a valid date'),
    (0, express_validator_1.query)('expiryDate').optional().isISO8601().withMessage('expiryDate must be a valid date'),
    (0, express_validator_1.query)('announcementType')
        .optional()
        .isIn(['GENERAL', 'BIRTHDAY', 'ANNIVERSARY'])
        .withMessage('Invalid announcementType')
];
//# sourceMappingURL=announcement.validation.js.map