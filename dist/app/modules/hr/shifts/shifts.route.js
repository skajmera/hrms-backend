"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../../../shared/middlewares/auth.middleware");
const constants_1 = require("../../../../config/constants");
const response_1 = require("../../../../shared/utils/response");
const constants_2 = require("../../../../config/constants");
const shiftHelper_1 = require("../../../../shared/utils/shiftHelper");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * /hr/shifts/default-timings:
 *   get:
 *     summary: Get default shift timings
 *     tags: [Shifts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Default timings retrieved
 */
router.get('/default-timings', (req, res) => {
    (0, response_1.sendSuccessResponse)(res, 'Default shift timings', constants_2.SHIFT_TIMINGS);
});
/**
 * @swagger
 * /hr/shifts/validate:
 *   post:
 *     summary: Validate shift timing
 *     tags: [Shifts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *                 example: "09:00"
 *               endTime:
 *                 type: string
 *                 example: "18:00"
 *     responses:
 *       200:
 *         description: Validation result
 */
router.post('/validate', (0, auth_middleware_1.authorize)(constants_1.USER_ROLES.SUPER_ADMIN, constants_1.USER_ROLES.HR_ADMIN), (req, res) => {
    const { startTime, endTime } = req.body;
    // Basic validation
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        return (0, response_1.sendSuccessResponse)(res, 'Invalid time format. Use HH:mm', {
            valid: false,
            error: 'Invalid time format'
        });
    }
    const startMinutes = shiftHelper_1.ShiftHelper.timeToMinutes(startTime);
    const endMinutes = shiftHelper_1.ShiftHelper.timeToMinutes(endTime);
    const duration = endMinutes > startMinutes
        ? endMinutes - startMinutes
        : (24 * 60 - startMinutes) + endMinutes;
    (0, response_1.sendSuccessResponse)(res, 'Shift timing validated', {
        valid: true,
        duration: `${Math.floor(duration / 60)}h ${duration % 60}m`,
        crossesMidnight: endMinutes < startMinutes
    });
});
exports.default = router;
//# sourceMappingURL=shifts.route.js.map