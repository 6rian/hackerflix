import type { HttpContext } from '@adonisjs/core/http';
import Movie from '#models/movie';
import TvSeries from '#models/tv_series';
import { serializeMovie, serializeTvSeries } from '#serializers/media_serializer';

export default class SearchController {
  async index({ inertia }: HttpContext) {
    const [allMovies, allShows] = await Promise.all([
      Movie.query().preload('keywords').orderBy('title', 'asc'),
      TvSeries.query().preload('keywords').orderBy('name', 'asc'),
    ]);

    const movies = allMovies.map(serializeMovie);
    const shows = allShows.map(serializeTvSeries);

    return inertia.render('search', { movies, shows });
  }
}
