import { Router } from 'express';
import { AIController, generateMessageSchema } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';

const router = Router();

router.use(authenticate);

router.get('/action/:leadId', AIController.getNextBestAction);
router.post('/message', validateBody(generateMessageSchema), AIController.generateMessage);
router.post('/message/regenerate', validateBody(generateMessageSchema), AIController.regenerateMessage);
router.post('/message/shorten', AIController.shortenMessage);

export default router;
