import { Router } from 'express';
import { AuditController } from '../controllers/audit.controller';
import { authenticate } from '../middleware/auth';
import { requireRoles } from '../middleware/role';

const router = Router();

router.use(authenticate);
router.use(requireRoles('ADMIN', 'MANAGER'));

router.get('/', AuditController.getLogs);

export default router;
