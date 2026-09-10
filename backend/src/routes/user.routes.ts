import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { requireRoles } from '../middleware/role';

const router = Router();

router.use(authenticate);

router.get('/me', UserController.getMe);
router.put('/me', UserController.updateMe);
router.get('/', requireRoles('ADMIN', 'MANAGER'), UserController.getUsers);
router.get('/:id', requireRoles('ADMIN', 'MANAGER'), UserController.getUserById);
router.put('/:id', requireRoles('ADMIN'), UserController.updateUser);

export default router;
