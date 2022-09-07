import { Router } from 'express';
import apiRoutes from './api';
import devRoutes from './dev';
import { isValidMediaType } from '../lib/utils';

const router = Router();

router.use('/api', apiRoutes);
router.use('/dev', devRoutes);

const GLOBAL_PAGE_PARAMS = {
  title: 'HackerFlix.net',
};

router.get('/', (req, res, next) => {
  res.render('index', GLOBAL_PAGE_PARAMS);
});

router.get('/flick/:slug', (req, res, next) => {
  res.render('flick', GLOBAL_PAGE_PARAMS);
});

router.get('/browse/:type', (req, res, next) => {
  try {
    const { type } = req.params;
    if (!type || !isValidMediaType(type)) {
      throw new Error(`Invlid media type: ${type}`);
    }

    res.render('index', { ...GLOBAL_PAGE_PARAMS, mediaType: type });
  } catch (e) {
    next(e);
  }
});

export default router;
