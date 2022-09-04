import { Router } from 'express';
import apiRoutes from './api';
import devRoutes from './dev';

const router = Router();

router.use('/api', apiRoutes);
router.use('/dev', devRoutes);

router.get('/', (req, res, next) => {
  res.render('index', {title: 'HackerFlix.net'});
});

export default router;
