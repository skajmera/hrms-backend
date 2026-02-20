"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDepartmentValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createDepartmentValidation = [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Department name is required'),
    (0, express_validator_1.body)('code').trim().notEmpty().withMessage('Department code is required'),
    (0, express_validator_1.body)('parentDepartment').optional().isMongoId().withMessage('Valid parent department ID required')
];
//# sourceMappingURL=department.validation.js.map