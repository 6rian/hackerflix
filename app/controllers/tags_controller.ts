import type { HttpContext } from '@adonisjs/core/http';
import Movie from '#models/movie';
import TvSeries from '#models/tv_series';
import { serializeMovie, serializeTvSeries } from '#serializers/media_serializer';

export default class TagsController {
  async show({ params, inertia }: HttpContext) {
    const tag = decodeURIComponent(params.tag as string);

    const [movies, series] = await Promise.all([
      Movie.query()
        .whereHas('keywords', (q) => q.whereILike('name', tag))
        .preload('keywords')
        .orderBy('popularity', 'desc'),
      TvSeries.query()
        .whereHas('keywords', (q) => q.whereILike('name', tag))
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

    return inertia.render('tag', { tag: params.tag, media: combined });
  }
}
