import TMDB from '../services/tmdb';
import { Router } from 'express';

const router = Router();

router.use('/tmdb', (req, res, next) => {
  try {
    const tmdb = new TMDB();
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

export default router;
