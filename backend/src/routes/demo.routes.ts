import { Router } from 'express';
import { DemoController } from '../controllers/demo.controller';

const router = Router();

// Demo endpoints for hackathon testing & rapid reset
router.post('/reset', DemoController.reset);
router.post('/seed', DemoController.seed);

export default router;
