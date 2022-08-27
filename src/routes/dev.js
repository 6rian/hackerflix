import TMDB from '../services/tmdb';
import { Router } from 'express';

const router = Router();

router.use('/tmdb/list', async (req, res, next) => {
  try {
    const tmdb = new TMDB();
    const list = await tmdb.getList('8214827');
    res.json({ data: list });
  } catch (e) {
    next(e);
  }
});

router.use('/tmdb/movie', async (req, res, next) => {
  try {
    const tmdb = new TMDB();
    const movie = await tmdb.getMovie('10428');
    res.json({ data: movie });
  } catch (e) {
    next(e);
  }
});

router.use('/tmdb/show', async (req, res, next) => {
  try {
    const tmdb = new TMDB();
    const show = await tmdb.getShow('59659');
    res.json({ data: show });
  } catch (e) {
    next(e);
  }
});

export default router;
