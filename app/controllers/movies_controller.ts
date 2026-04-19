import type { HttpContext } from '@adonisjs/core/http';
import Movie from '#models/movie';
import { serializeMovie } from '#serializers/media_serializer';

export default class MoviesController {
  async index({ inertia }: HttpContext) {
    const movies = await Movie.query().preload('keywords').orderBy('popularity', 'desc');
    return inertia.render('movies', { media: movies.map(serializeMovie) });
  }
}
