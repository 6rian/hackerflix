import { Router } from 'express';
import { isValidMediaType } from '../lib/utils';
import { getFlickDTO } from '../dtos/flick';
import { runDetailsETL } from '../etls/tmdb/details';
import * as cache from '../services/cache';

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

router.get('/flick/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const flick = await cache.getFlickBySlug(slug);
    let flickData;

    if (!flick) {
      throw new Error(`Flick not found for slug: ${slug}`);
    }

    if (!flick.hasAllDetails) {
      const id = flick.tmdbId;
      const type = flick.tmdbMediaType;

      const detailsLoaded = await runDetailsETL(id, type);

      if (!detailsLoaded) {
        throw new Error(`Failed loading details for slug: ${slug}`);
      }

      const updatedFlick = await cache.getFlickById(id, type);
      flickData = getFlickDTO(updatedFlick);
    } else {
      flickData = getFlickDTO(flick);
    }

    const view = 'flick';
    const locals = makeLocals({
      view,
      slug: req.params.slug,
      flick: flickData,
    });
    res.render(view, locals);
  } catch (e) {
    next(e);
  }
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

router.get('/about', (req, res, next) => {
  const locals = makeLocals({
    view: 'about',
  });
  res.render('about', locals);
});

export default router;
