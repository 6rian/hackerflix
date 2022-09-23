import { Router } from 'express';
import * as cache from '../services/cache';
import { getFlicksResponseDTO, getFlickResponseDTO } from '../dtos/flick';
import { runDetailsETL } from '../etls/tmdb/details';
import { isValidMediaType } from '../lib/utils';

const router = Router();

router.get('/flick', async (req, res, next) => {
  try {
    let data;
    const { type, q: query } = req.query || null;

    if (query) {
      data = await cache.search(query);
    } else if (type && isValidMediaType(type)) {
      data = await cache.getFlicksByType(type);
    } else {
      data = await cache.getFlicks();
    }

    res.json(getFlicksResponseDTO(data));
  } catch (e) {
    next(e);
  }
});

router.get('/flick/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const flick = await cache.getFlickBySlug(slug);

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
      return res.json(getFlickResponseDTO(updatedFlick));
    }

    return res.json(getFlickResponseDTO(flick));
  } catch (e) {
    next(e);
  }
});

export default router;
