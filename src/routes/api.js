import { Router } from 'express';
import * as cache from '../services/cache';
import { getFlicksResponseDTO, getFlickResponseDTO } from '../dtos/flick';

const router = Router();

router.get('/flick', async (req, res, next) => {
  try {
    const data = await cache.getFlicks();
    res.json(getFlicksResponseDTO(data));
  } catch (e) {
    next(e);
  }
});

router.get('/flick/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const data = await cache.getFlickBySlug(slug);

    if (!data) {
      throw new Error(`Flick not found for slug: ${slug}`);
    }

    res.json(getFlickResponseDTO(data));
  } catch (e) {
    next(e);
  }
});

export default router;
