import type { HttpContext } from '@adonisjs/core/http';
import Image from '#models/image';
import TvSeries from '#models/tv_series';
import Video from '#models/video';
import { serializeTvSeries, serializeTvSeriesDetails } from '#serializers/media_serializer';

export default class TvShowsController {
/**
   * List all TV series, sorted by popularity.
   * @param inertia - Inertia.js context for SSR
   */
  async index({ inertia }: HttpContext) {
    // TODO: add pagination before catalog grows large
    const series = await TvSeries.query().preload('keywords').orderBy('popularity', 'desc');
    return inertia.render('tv_shows', { media: series.map(serializeTvSeries) });
  }

/**
   * Show details for a single TV series, including images and videos.
   * @param params - Route params (expects slug)
   * @param inertia - Inertia.js context for SSR
   * @param response - HTTP response for 404 handling
   */
  async show({ params, inertia, response }: HttpContext) {
    const series = await TvSeries.query()
      .where('slug', params.slug as string)
      .preload('keywords')
      
      .preload('tvCredits', (q) => q.preload('person'))
      .first();

    if (!series) return response.notFound();

    const [images, videos] = await Promise.all([
      Image.query().where('media_type', 'tv').where('media_id', series.id),
      Video.query().where('media_type', 'tv').where('media_id', series.id),
    ]);

    return inertia.render('media_details', {
      media: serializeTvSeriesDetails(series, images, videos, series.tvCredits),
    });
  }
}
