import type { HttpContext } from '@adonisjs/core/http';
import Movie from '#models/movie';
import TvSeries from '#models/tv_series';
import tmdbConfig from '#config/tmdb';
import { serializeMovie, serializeTvSeries } from '#serializers/media_serializer';

export default class HomeController {
  async index({ inertia }: HttpContext) {
    const [featuredOrNull, topMovies, topShows] = await Promise.all([
      Movie.query().where('id', tmdbConfig.featuredId).preload('keywords').first(),
      Movie.query().preload('keywords').orderBy('voteAverage', 'desc').limit(6),
      TvSeries.query().preload('keywords').orderBy('voteAverage', 'desc').limit(6),
    ]);

    const featured = featuredOrNull ?? topMovies[0];
    const featuredContent = featured ? [serializeMovie(featured)] : [];
    const movies = topMovies.map(serializeMovie);
    const shows = topShows.map(serializeTvSeries);

    return inertia.render('home', { featuredContent, movies, shows });
  }
}
