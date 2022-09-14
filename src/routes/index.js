import { Router } from 'express';
import apiRoutes from './api';
import devRoutes from './dev';
import pageRoutes from './pages';
import { isDevelopment } from '../lib/utils';

const router = Router();

router.use('/api', apiRoutes);

router.use('/', pageRoutes);

router.use(
  '/dev',
  (req, res, next) => {
    if (!isDevelopment()) {
      const error = new Error('This route is restricted to development environments only.');
      next(error);
    }
    next();
  },
  devRoutes,
);

export default router;
