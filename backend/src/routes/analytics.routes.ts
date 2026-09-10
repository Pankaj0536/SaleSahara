import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth';
import { requireRoles } from '../middleware/role';

const router = Router();

router.use(authenticate);
router.use(requireRoles('ADMIN', 'MANAGER', 'ANALYST'));

router.get('/overview', AnalyticsController.getOverview);
router.get('/funnel', AnalyticsController.getFunnel);
router.get('/sources', AnalyticsController.getSources);
router.get('/revenue', AnalyticsController.getRevenue);
router.get('/segments', AnalyticsController.getSegments);
router.get('/calibration', AnalyticsController.getPredictionVsActual);

export default router;
