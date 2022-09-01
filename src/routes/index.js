import { Router } from 'express';
import apiRoutes from './api';
import devRoutes from './dev';

const router = Router();

router.use('/api', apiRoutes);
router.use('/dev', devRoutes);

export default router;
