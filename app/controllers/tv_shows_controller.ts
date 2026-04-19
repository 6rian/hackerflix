import type { HttpContext } from '@adonisjs/core/http';
import TvSeries from '#models/tv_series';
import { serializeTvSeries } from '#serializers/media_serializer';

export default class TvShowsController {
  async index({ inertia }: HttpContext) {
    // TODO: add pagination before catalog grows large
    const series = await TvSeries.query().preload('keywords').orderBy('popularity', 'desc');
    return inertia.render('tv_shows', { media: series.map(serializeTvSeries) });
  }
}
