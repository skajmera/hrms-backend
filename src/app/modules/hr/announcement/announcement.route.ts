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
import { createAnnouncementValidation, queryAnnouncementsValidation } from './announcement.validation';
import { announcementUpload } from '../../../../shared/middlewares/upload.middleware';
import { Request, Response, NextFunction } from 'express';

const parseAnnouncementBody = (req: Request, res: Response, next: NextFunction) => {
    if (req.body.targetAudience && typeof req.body.targetAudience === 'string') {
        try {
            req.body.targetAudience = JSON.parse(req.body.targetAudience);
        } catch (e) {
            // let validation handle the error
        }
    }
    next();
};

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
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Return announcements with startDate >= provided date
 *       - in: query
 *         name: expiryDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Return announcements with expiryDate <= provided date
 *       - in: query
 *         name: announcementType
 *         schema:
 *           type: string
 *           enum: [GENERAL, BIRTHDAY, ANNIVERSARY]
 *         description: Filter by announcement type
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
router.get('/', validate(queryAnnouncementsValidation), announcementController.getAllAnnouncements.bind(announcementController));

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

// Typed dashboard routes — must be above /:id to prevent route hijacking
router.get('/new-hires', (req: any, res, next) => { req.params.announcementType = 'NEWHIRE'; announcementController.getTypedAnnouncements(req, res, next); });
router.get('/birthdays', (req: any, res, next) => { req.params.announcementType = 'BIRTHDAY'; announcementController.getTypedAnnouncements(req, res, next); });
router.get('/anniversaries', (req: any, res, next) => { req.params.announcementType = 'ANNIVERSARY'; announcementController.getTypedAnnouncements(req, res, next); });

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
 *                     example: ['697b0744dfffca6e32868866']
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
router.post('/', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), announcementUpload.array('attachments', 5), parseAnnouncementBody, validate(createAnnouncementValidation), announcementController.createAnnouncement.bind(announcementController));

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
router.put('/:id', authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_ADMIN), announcementUpload.array('attachments', 5), parseAnnouncementBody, announcementController.updateAnnouncement.bind(announcementController));

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

/**
 * @swagger
 * /hr/announcements/{id}/like:
 *   post:
 *     summary: Toggle like status of announcement (Like/Unlike)
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
 *         description: Like status toggled successfully
 */
router.post('/:id/like', announcementController.toggleLike.bind(announcementController));

/**
 * @swagger
 * /hr/announcements/{id}/comments:
 *   post:
 *     summary: Add comment to announcement
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added
 */
router.post('/:id/comments', announcementController.addComment.bind(announcementController));

/**
 * @swagger
 * /hr/announcements/{id}/comments/{commentId}/like:
 *   post:
 *     summary: Toggle like status of a comment
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
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment like toggled successfully
 */
router.post('/:id/comments/:commentId/like', announcementController.toggleCommentLike.bind(announcementController));

/**
 * @swagger
 * /hr/announcements/{id}/comments/{commentId}:
 *   delete:
 *     summary: Delete comment
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted
 */
router.delete('/:id/comments/:commentId', announcementController.deleteComment.bind(announcementController));

/**
 * @swagger
 * /hr/announcements/{id}/comments/{commentId}/replies:
 *   post:
 *     summary: Add a threaded reply to a comment
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
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reply added successfully
 */
router.post('/:id/comments/:commentId/replies', announcementController.replyToComment.bind(announcementController));

export default router;