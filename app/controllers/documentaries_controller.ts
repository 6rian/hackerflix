import type { HttpContext } from '@adonisjs/core/http';
import Movie from '#models/movie';
import TvSeries from '#models/tv_series';
import { serializeMovie, serializeTvSeries } from '#serializers/media_serializer';

import tmdbConfig from '#config/tmdb';

export default class DocumentariesController {
/**
   * Render the documentaries page with all movies and shows tagged as documentaries.
   * @param inertia - Inertia.js context for SSR
   */
  async index({ inertia }: HttpContext) {
    const [docMovies, docShows] = await Promise.all([
      Movie.query()
        .whereHas('genres', (q) => q.where('genres.id', DOCUMENTARY_GENRE_ID))
        .preload('keywords')
        .orderBy('popularity', 'desc'),
      TvSeries.query()
        .whereHas('genres', (q) => q.where('genres.id', DOCUMENTARY_GENRE_ID))
        .preload('keywords')
        .orderBy('popularity', 'desc'),
    ]);

    const media = [
      ...docMovies.map((m) => ({ item: serializeMovie(m), pop: m.popularity ?? 0 })),
      ...docShows.map((s) => ({ item: serializeTvSeries(s), pop: s.popularity ?? 0 })),
    ]
      .sort((a, b) => b.pop - a.pop)
      .map(({ item }) => item);

    return inertia.render('documentaries', { media });
  }
}
