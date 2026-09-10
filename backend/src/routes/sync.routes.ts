import { Router } from 'express';
import { SyncController } from '../controllers/sync.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/push', SyncController.push);
router.post('/pull', SyncController.pull);
router.get('/status', SyncController.getStatus);

export default router;
