import { Router } from 'express';
import { PermissionsController } from './permissions.controller';
import { PermissionsValidation } from './permissions.validation';
// import { authMiddleware } from '../../../../shared/middlewares/auth.middleware';
import { validate } from '../../../../shared/middlewares/validation';
import { authenticate, authorize } from '../../../../shared/middlewares/auth.middleware';
const router = Router();

// All routes require authentication
router.use(authenticate);

// GET routes
router.get('/active', PermissionsController.getActiveUsers);
router.get('/defaults/:role', PermissionsController.getDefaultPermissions);
router.get('/', validate(PermissionsValidation.getPermissions), PermissionsController.getAllPermissions);
router.get('/:userId', validate(PermissionsValidation.userId), PermissionsController.getPermissionByUserId);

// POST routes
router.post('/invite', validate(PermissionsValidation.inviteUser), PermissionsController.inviteUser);
router.post('/check', PermissionsController.checkPermission);
router.post('/:userId/deactivate', validate(PermissionsValidation.userId), PermissionsController.deactivateUser);
router.post('/:userId/activate', validate(PermissionsValidation.userId), PermissionsController.activateUser);

// PUT routes
router.put('/:userId', validate(PermissionsValidation.updatePermissions), PermissionsController.updatePermissions);

// DELETE routes
router.delete('/:userId', validate(PermissionsValidation.userId), PermissionsController.deletePermissions);

export default router;