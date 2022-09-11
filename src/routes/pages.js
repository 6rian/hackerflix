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
  const view = 'flick';
  const locals = makeLocals({
    view,
    slug: req.params.slug,
  });
  res.render(view, locals);
});

router.get('/browse/:type', (req, res, next) => {
  const { type } = req.params;
  if (!type || !isValidMediaType(type)) {
    throw new Error(`Invlid media type: ${type}`);
  }

  const locals = makeLocals({
    view: 'index',
    mediaType: type,
  });

  res.render('index', locals);
});

export default router;
