import { Router } from 'express';
import { authenticate, authorize } from '../../../../shared/middlewares/auth.middleware';
import { USER_ROLES } from '../../../../config/constants';
import { sendSuccessResponse } from '../../../../shared/utils/response';
import { SHIFT_TIMINGS } from '../../../../config/constants';
import { ShiftHelper } from '../../../../shared/utils/shiftHelper';

const router = Router();

router.use(authenticate);

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
  sendSuccessResponse(res, 'Default shift timings', SHIFT_TIMINGS);
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
router.post('/validate', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), (req, res) => {
  const { startTime, endTime } = req.body;
  
  // Basic validation
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  
  if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
    return sendSuccessResponse(res, 'Invalid time format. Use HH:mm', {
      valid: false,
      error: 'Invalid time format'
    });
  }

  const startMinutes = ShiftHelper.timeToMinutes(startTime);
  const endMinutes = ShiftHelper.timeToMinutes(endTime);
  
  const duration = endMinutes > startMinutes 
    ? endMinutes - startMinutes 
    : (24 * 60 - startMinutes) + endMinutes;

  sendSuccessResponse(res, 'Shift timing validated', {
    valid: true,
    duration: `${Math.floor(duration / 60)}h ${duration % 60}m`,
    crossesMidnight: endMinutes < startMinutes
  });
});

export default router;