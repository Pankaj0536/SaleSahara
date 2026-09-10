import { Router } from 'express';
import { FeedbackController } from '../controllers/feedback.controller';
import { authenticate } from '../middleware/auth';
import { requireRoles } from '../middleware/role';

const router = Router();

router.use(authenticate);

router.post('/outcome', FeedbackController.recordOutcome);
router.get('/prediction-vs-actual', requireRoles('ADMIN', 'MANAGER', 'ANALYST'), FeedbackController.getPredictionVsActual);
router.get('/model-performance', requireRoles('ADMIN', 'MANAGER', 'ANALYST'), FeedbackController.getModelPerformance);

export default router;
