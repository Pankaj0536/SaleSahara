import { Router } from 'express';
import { ModelController } from '../controllers/model.controller';
import { authenticate } from '../middleware/auth';
import { requireRoles } from '../middleware/role';

const router = Router();

router.use(authenticate);
router.use(requireRoles('ADMIN', 'MANAGER', 'ANALYST'));

router.get('/compare', ModelController.getCompare);
router.get('/metrics', ModelController.getMetrics);
router.post('/retrain', ModelController.retrain);

export default router;
