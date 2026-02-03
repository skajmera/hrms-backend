// import { Router } from 'express';
// import { announcementController } from './announcement.controller';
// import { authenticate, authorize } from '../../../../shared/middlewares/auth.middleware';
// import { validate } from '../../../../shared/middlewares/validation';
// import { USER_ROLES } from '../../../../config/constants';
// import { createAnnouncementValidation } from './announcement.validation';

// const router = Router();

// router.use(authenticate);

// router.get('/', announcementController.getAllAnnouncements.bind(announcementController));
// router.get('/my-announcements', announcementController.getMyAnnouncements.bind(announcementController));
// router.get('/:id', announcementController.getAnnouncementById.bind(announcementController));
// router.post('/', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), validate(createAnnouncementValidation), announcementController.createAnnouncement.bind(announcementController));
// router.put('/:id', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), announcementController.updateAnnouncement.bind(announcementController));
// router.delete('/:id', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), announcementController.deleteAnnouncement.bind(announcementController));
// router.post('/:id/view', announcementController.markAsViewed.bind(announcementController));
// router.put('/:id/toggle-pin', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), announcementController.togglePin.bind(announcementController));


// export default router;

import { Router } from 'express';
import { announcementController } from './announcement.controller';
import { authenticate, authorize } from '../../../../shared/middlewares/auth.middleware';
import { validate } from '../../../../shared/middlewares/validation';
import { USER_ROLES } from '../../../../config/constants';
import { createAnnouncementValidation } from './announcement.validation';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /hr/announcements:
 *   get:
 *     summary: Get all announcements with pagination
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *         description: Filter by priority
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: isPinned
 *         schema:
 *           type: boolean
 *         description: Filter by pinned status
 *     responses:
 *       200:
 *         description: Announcements retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         data:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Announcement'
 */
router.get('/', announcementController.getAllAnnouncements.bind(announcementController));

/**
 * @swagger
 * /hr/announcements/my-announcements:
 *   get:
 *     summary: Get announcements targeted for current user
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User announcements retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Announcement'
 */
router.get('/my-announcements', announcementController.getMyAnnouncements.bind(announcementController));

/**
 * @swagger
 * /hr/announcements/{id}:
 *   get:
 *     summary: Get announcement by ID
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Announcement ID
 *     responses:
 *       200:
 *         description: Announcement retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Announcement'
 *       404:
 *         description: Announcement not found
 */
router.get('/:id', announcementController.getAnnouncementById.bind(announcementController));

/**
 * @swagger
 * /hr/announcements:
 *   post:
 *     summary: Create new announcement
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - priority
 *               - startDate
 *               - targetAudience
 *             properties:
 *               title:
 *                 type: string
 *                 example: 'Company Holiday Announcement'
 *               content:
 *                 type: string
 *                 example: 'Office will remain closed on Republic Day (26th January 2026)'
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *                 example: HIGH
 *               announcementType:
 *                 type: string
 *                 enum: [BIRTHDAY, ANNIVERSARY, GENERAL]
 *                 example: GENERAL
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: '2026-01-15'
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 example: '2026-01-27'
 *               targetAudience:
 *                 type: object
 *                 required:
 *                   - isGlobal
 *                 properties:
 *                   departments:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ['507f1f77bcf86cd799439011']
 *                   roles:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ['EMPLOYEE', 'MANAGER']
 *                   specificUsers:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: []
 *                   isGlobal:
 *                     type: boolean
 *                     example: true
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: 'holiday_list.pdf'
 *                     url:
 *                       type: string
 *                       example: 'https://example.com/files/holiday_list.pdf'
 *                     type:
 *                       type: string
 *                       example: 'application/pdf'
 *                     size:
 *                       type: number
 *                       example: 1048576
 *               isPinned:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Announcement created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Announcement'
 *       400:
 *         description: Validation error
 */
router.post('/', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), validate(createAnnouncementValidation), announcementController.createAnnouncement.bind(announcementController));

/**
 * @swagger
 * /hr/announcements/{id}:
 *   put:
 *     summary: Update announcement
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Announcement ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *               expiryDate:
 *                 type: string
 *                 format: date
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Announcement updated successfully
 *       404:
 *         description: Announcement not found
 */
router.put('/:id', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), announcementController.updateAnnouncement.bind(announcementController));

/**
 * @swagger
 * /hr/announcements/{id}:
 *   delete:
 *     summary: Delete announcement
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Announcement ID
 *     responses:
 *       200:
 *         description: Announcement deleted successfully
 *       404:
 *         description: Announcement not found
 */
router.delete('/:id', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), announcementController.deleteAnnouncement.bind(announcementController));

/**
 * @swagger
 * /hr/announcements/{id}/view:
 *   post:
 *     summary: Mark announcement as viewed
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Announcement ID
 *     responses:
 *       200:
 *         description: Announcement marked as viewed
 */
router.post('/:id/view', announcementController.markAsViewed.bind(announcementController));

/**
 * @swagger
 * /hr/announcements/{id}/toggle-pin:
 *   put:
 *     summary: Toggle pin status of announcement
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Announcement ID
 *     responses:
 *       200:
 *         description: Pin status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Announcement'
 *       404:
 *         description: Announcement not found
 */
router.put('/:id/toggle-pin', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), announcementController.togglePin.bind(announcementController));

export default router;