import { Router } from 'express';
import { ImportController } from '../controllers/import.controller';
import { authenticate } from '../middleware/auth';
import { requireRoles } from '../middleware/role';
import { upload } from '../middleware/upload';

const router = Router();

router.use(authenticate);
router.use(requireRoles('ADMIN', 'MANAGER'));

router.post('/', upload.single('file'), ImportController.uploadFile);
router.get('/:jobId', ImportController.getStatus);

export default router;
