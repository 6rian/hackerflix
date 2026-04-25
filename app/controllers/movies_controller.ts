import type { HttpContext } from '@adonisjs/core/http';
import Image from '#models/image';
import Movie from '#models/movie';
import Video from '#models/video';
import { serializeMovie, serializeMovieDetails } from '#serializers/media_serializer';

export default class MoviesController {
  /**
   * List all movies, sorted by popularity.
   * @param inertia - Inertia.js context for SSR
   */
  async index({ inertia }: HttpContext) {
    // TODO: add pagination before catalog grows large
    const movies = await Movie.query().preload('keywords').orderBy('popularity', 'desc');
    return inertia.render('movies', { media: movies.map(serializeMovie) });
  }

  /**
   * Show details for a single movie, including images and videos.
   * @param params - Route params (expects slug)
   * @param inertia - Inertia.js context for SSR
   * @param response - HTTP response for 404 handling
   */
  async show({ params, inertia, response }: HttpContext) {
    const movie = await Movie.query()
      .where('slug', params.slug as string)
      .preload('keywords')

      .preload('movieCredits', (q) => q.preload('person'))
      .first();

    if (!movie) return response.notFound();

    const [images, videos] = await Promise.all([
      Image.query().where('media_type', 'movie').where('media_id', movie.id),
      Video.query().where('media_type', 'movie').where('media_id', movie.id),
    ]);

    return inertia.render('media_details', {
      media: serializeMovieDetails(movie, images, videos, movie.movieCredits),
    });
  }
}
