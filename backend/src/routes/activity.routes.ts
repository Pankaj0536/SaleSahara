import { Router } from 'express';
import { ActivityController, createActivitySchema } from '../controllers/activity.controller';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';

const router = Router();

router.use(authenticate);

router.get('/leads/:leadId/activities', ActivityController.getLeadActivities);
router.post('/leads/:leadId/activities', validateBody(createActivitySchema), ActivityController.createActivity);
router.get('/leads/:leadId/timeline', ActivityController.getTimeline);

export default router;
