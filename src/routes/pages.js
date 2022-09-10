import { Router } from 'express';
import { isValidMediaType } from '../lib/utils';

const router = Router();

const GLOBAL_PAGE_PARAMS = {
  title: 'HackerFlix.net',
};

const makeLocals = (locals) => ({
  ...GLOBAL_PAGE_PARAMS,
  ...locals,
});

router.get('/', (req, res, next) => {
  const locals = makeLocals({
    view: 'index',
    mediaType: '',
  });
  res.render('index', locals);
});

router.get('/flick/:slug', (req, res, next) => {
  const locals = makeLocals();
  res.render('flick', locals);
});

router.get('/browse/:type', (req, res, next) => {
  try {
    const { type } = req.params;
    if (!type || !isValidMediaType(type)) {
      throw new Error(`Invlid media type: ${type}`);
    }

    const locals = makeLocals({
      view: 'index',
      mediaType: type,
    });

    res.render('index', locals);
  } catch (e) {
    next(e);
  }
});

export default router;
