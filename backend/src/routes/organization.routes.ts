import { Router } from 'express';
import { OrganizationController } from '../controllers/organization.controller';
import { authenticate } from '../middleware/auth';
import { requireRoles } from '../middleware/role';

const router = Router();

router.use(authenticate);

router.get('/me', OrganizationController.getMe);
router.put('/me', requireRoles('ADMIN'), OrganizationController.updateMe);

export default router;
