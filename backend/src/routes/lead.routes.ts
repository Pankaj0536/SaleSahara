import { Router } from 'express';
import { LeadController, createLeadSchema } from '../controllers/lead.controller';
import { authenticate } from '../middleware/auth';
import { requireRoles } from '../middleware/role';
import { validateBody } from '../middleware/validate';

const router = Router();

router.use(authenticate);

router.get('/prioritized', LeadController.getPrioritized);
router.get('/hot', LeadController.getHot);
router.get('/at-risk', LeadController.getAtRisk);
router.get('/rising-intent', LeadController.getRisingIntent);
router.post('/bulk', requireRoles('ADMIN', 'MANAGER'), LeadController.bulkCreate);

router.get('/', LeadController.getLeads);
router.get('/:id', LeadController.getLeadById);
router.post('/', validateBody(createLeadSchema), LeadController.createLead);
router.put('/:id', LeadController.updateLead);
router.delete('/:id', requireRoles('ADMIN', 'MANAGER'), LeadController.deleteLead);

export default router;
