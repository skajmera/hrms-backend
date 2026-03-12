import { Router } from 'express';
import { authenticate, authorize } from '../../../../shared/middlewares/auth.middleware';
import { USER_ROLES } from '../../../../config/constants';
import { holidayDAL } from '../../../../shared/dal/holiday.dal';
import { sendSuccessResponse, sendErrorResponse } from '../../../../shared/utils/response';
import { HTTP_STATUS } from '../../../../config/constants';

const router = Router();

router.use(authenticate);

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
      ? await holidayDAL.getHolidaysByYear(Number(year))
      : await holidayDAL.findAll({ isActive: true });
    sendSuccessResponse(res, 'Holidays retrieved successfully', holidays);
  } catch (error: any) {
    sendErrorResponse(res, error.message);
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
router.delete('/:id', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), async (req: any, res) => {
  try {
    const holiday = await holidayDAL.delete(req.params.id);
    if (!holiday) {
      return sendErrorResponse(res, 'Holiday not found', HTTP_STATUS.NOT_FOUND);
    }
    sendSuccessResponse(res, 'Holiday deleted successfully');
  } catch (error: any) {
    sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
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
router.post('/', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), async (req: any, res) => {
  try {
    const holiday = await holidayDAL.create({ ...req.body, createdBy: req.user._id });
    sendSuccessResponse(res, 'Holiday created successfully', holiday, HTTP_STATUS.CREATED);
  } catch (error: any) {
    sendErrorResponse(res, error.message, HTTP_STATUS.BAD_REQUEST);
  }
});
export default router;