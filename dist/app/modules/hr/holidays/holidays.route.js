"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../../../shared/middlewares/auth.middleware");
const constants_1 = require("../../../../config/constants");
const holiday_dal_1 = require("../../../../shared/dal/holiday.dal");
const response_1 = require("../../../../shared/utils/response");
const constants_2 = require("../../../../config/constants");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * /hr/holidays:
 *   get:
 *     summary: Get all holidays
 *     tags: [Holidays]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Holidays retrieved successfully
 */
router.get('/', async (req, res) => {
    try {
        const { year } = req.query;
        const holidays = year
            ? await holiday_dal_1.holidayDAL.getHolidaysByYear(Number(year))
            : await holiday_dal_1.holidayDAL.findAll({ isActive: true });
        (0, response_1.sendSuccessResponse)(res, 'Holidays retrieved successfully', holidays);
    }
    catch (error) {
        (0, response_1.sendErrorResponse)(res, error.message);
    }
});
/**
 * @swagger
 * /hr/holidays/{id}:
 *   delete:
 *     summary: Delete a holiday
 *     tags: [Holidays]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Holiday deleted successfully
 */
router.delete('/:id', (0, auth_middleware_1.authorize)(constants_1.USER_ROLES.SUPER_ADMIN, constants_1.USER_ROLES.HR_ADMIN), async (req, res) => {
    try {
        const holiday = await holiday_dal_1.holidayDAL.delete(req.params.id);
        if (!holiday) {
            return (0, response_1.sendErrorResponse)(res, 'Holiday not found', constants_2.HTTP_STATUS.NOT_FOUND);
        }
        (0, response_1.sendSuccessResponse)(res, 'Holiday deleted successfully');
    }
    catch (error) {
        (0, response_1.sendErrorResponse)(res, error.message, constants_2.HTTP_STATUS.BAD_REQUEST);
    }
});
/**
 * @swagger
 * /hr/holidays:
 *   post:
 *     summary: Create holiday
 *     tags: [Holidays]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - date
 *             properties:
 *               name:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               type:
 *                 type: string
 *                 enum: [PUBLIC, RESTRICTED, OPTIONAL]
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Holiday created successfully
 */
router.post('/', (0, auth_middleware_1.authorize)(constants_1.USER_ROLES.SUPER_ADMIN, constants_1.USER_ROLES.HR_ADMIN), async (req, res) => {
    try {
        const holiday = await holiday_dal_1.holidayDAL.create({ ...req.body, createdBy: req.user._id });
        (0, response_1.sendSuccessResponse)(res, 'Holiday created successfully', holiday, constants_2.HTTP_STATUS.CREATED);
    }
    catch (error) {
        (0, response_1.sendErrorResponse)(res, error.message, constants_2.HTTP_STATUS.BAD_REQUEST);
    }
});
exports.default = router;
//# sourceMappingURL=holidays.route.js.map