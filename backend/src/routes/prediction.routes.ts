import { Router } from 'express';
import { PredictionController } from '../controllers/prediction.controller';
import { authenticate } from '../middleware/auth';
import { requireRoles } from '../middleware/role';

const router = Router();

router.use(authenticate);

router.post('/batch', requireRoles('ADMIN', 'MANAGER', 'ANALYST'), PredictionController.batchPredict);
router.post('/:leadId', PredictionController.predictLead);
router.get('/:leadId/explanation', PredictionController.getExplanation);
router.get('/:leadId/history', PredictionController.getHistory);

export default router;
