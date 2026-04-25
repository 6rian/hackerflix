import type { HttpContext } from '@adonisjs/core/http';
import Keyword from '#models/keyword';
import Movie from '#models/movie';
import TvSeries from '#models/tv_series';
import { serializeMovie, serializeTvSeries } from '#serializers/media_serializer';

export default class TagsController {
  async show({ params, inertia, response }: HttpContext) {
    const slug = params.slug as string;

    const keyword = await Keyword.query().where('slug', slug).first();
    if (!keyword) return response.notFound();

    const [movies, series] = await Promise.all([
      Movie.query()
        .whereHas('keywords', (q) => q.where('slug', slug))
        .preload('keywords')
        .orderBy('popularity', 'desc'),
      TvSeries.query()
        .whereHas('keywords', (q) => q.where('slug', slug))
        .preload('keywords')
        .orderBy('popularity', 'desc'),
    ]);

    // Both arrays are sorted by popularity desc. We merge and re-sort using the
    // raw model instances (which have `popularity`) before serializing, since
    // the serialized MediaItem interface intentionally omits popularity.
    const combined = [
      ...movies.map((m) => ({ item: serializeMovie(m), pop: m.popularity ?? 0 })),
      ...series.map((s) => ({ item: serializeTvSeries(s), pop: s.popularity ?? 0 })),
    ]
      .sort((a, b) => b.pop - a.pop)
      .map(({ item }) => item);

    return inertia.render('tag', { tag: keyword.name, media: combined });
  }
}
