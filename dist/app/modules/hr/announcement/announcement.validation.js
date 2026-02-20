"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnnouncementValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createAnnouncementValidation = [
    (0, express_validator_1.body)('title').trim().notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('content').trim().notEmpty().withMessage('Content is required'),
    (0, express_validator_1.body)('priority').isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).withMessage('Valid priority is required'),
    (0, express_validator_1.body)('startDate').isISO8601().withMessage('Valid start date is required'),
    (0, express_validator_1.body)('targetAudience.isGlobal').isBoolean().withMessage('isGlobal must be boolean')
];
//# sourceMappingURL=announcement.validation.js.map