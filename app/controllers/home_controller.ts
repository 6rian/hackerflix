import type { HttpContext } from '@adonisjs/core/http';
import Movie from '#models/movie';
import TvSeries from '#models/tv_series';
import tmdbConfig from '#config/tmdb';
import { serializeMovie, serializeTvSeries } from '#serializers/media_serializer';

export default class HomeController {
  /**
   * Render the homepage with featured, top movies/shows, and documentaries.
   * @param inertia - Inertia.js context for SSR
   */
  async index({ inertia }: HttpContext) {
    const [featuredOrNull, topMovies, topShows, docMovies, docShows] = await Promise.all([
      Movie.query().where('id', tmdbConfig.featuredId).preload('keywords').first(),
      Movie.query().preload('keywords').orderBy('voteAverage', 'desc').limit(6),
      TvSeries.query().preload('keywords').orderBy('voteAverage', 'desc').limit(6),
      Movie.query()
        .whereHas('genres', (q) => q.where('genres.id', tmdbConfig.documentaryGenreId))
        .preload('keywords')
        .orderBy('popularity', 'desc')
        .limit(12),
      TvSeries.query()
        .whereHas('genres', (q) => q.where('genres.id', tmdbConfig.documentaryGenreId))
        .preload('keywords')
        .orderBy('popularity', 'desc')
        .limit(12),
    ]);

    const featured = featuredOrNull ?? topMovies[0];
    const featuredContent = featured ? [serializeMovie(featured)] : [];
    const movies = topMovies.map(serializeMovie);
    const shows = topShows.map(serializeTvSeries);

    const documentaries = [
      ...docMovies.map((m) => ({ item: serializeMovie(m), pop: m.popularity ?? 0 })),
      ...docShows.map((s) => ({ item: serializeTvSeries(s), pop: s.popularity ?? 0 })),
    ]
      .sort((a, b) => b.pop - a.pop)
      .slice(0, 12)
      .map(({ item }) => item);

    return inertia.render('home', { featuredContent, movies, shows, documentaries });
  }
}
