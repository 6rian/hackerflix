import { Router } from 'express';
import * as cache from '../services/cache';
import { getFlicksResponseDTO } from '../dtos/flick';

const router = Router();

router.use('/flick', async (req, res, next) => {
  try {
    const data = await cache.getFlicks();
    res.json(getFlicksResponseDTO(data));
  } catch (e) {
    next(e);
  }
});

export default router;
