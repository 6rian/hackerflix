import { DateTime } from 'luxon';
import db from '@adonisjs/lucid/services/db';
import type { TransactionClientContract } from '@adonisjs/lucid/types/database';
import tmdbConfig from '#config/tmdb';
import type { TmdbClient, TmdbAggregateCreditsResponse } from '#services/tmdb/client';
import type { MoviesImporter } from '#services/tmdb/movies_importer';
import Network from '#models/network';
import Person from '#models/person';
import ProductionCompany from '#models/production_company';
import Season from '#models/season';
import TvContentRating from '#models/tv_content_rating';
import TvExternalId from '#models/tv_external_id';
import TvSeries from '#models/tv_series';
import { generateUniqueSlug } from '#utils/slug';

export class TvImporter {
  constructor(
    private readonly client: TmdbClient,
    private readonly moviesImporter: MoviesImporter
  ) {}

  /**
   * Returns true if the record was imported, false if skipped.
   */
  async importTvSeries(tmdbId: number, forceWrite: boolean): Promise<boolean> {
    const now = DateTime.now();
    const staleBefore = now.minus({ days: tmdbConfig.stalenessThresholdDays });

    const existing = await TvSeries.findBy('tmdb_id', tmdbId);
    if (existing && !forceWrite && existing.lastUpdated > staleBefore) {
      return false;
    }

    const [details, aggregateCredits, contentRatings, externalIds, images, keywords, videos] =
      await Promise.all([
        this.client.getTvDetails(tmdbId),
        this.client.getTvAggregateCredits(tmdbId),
        this.client.getTvContentRatings(tmdbId),
        this.client.getTvExternalIds(tmdbId),
        this.client.getTvImages(tmdbId),
        this.client.getTvKeywords(tmdbId),
        this.client.getTvVideos(tmdbId),
      ]);

    await db.transaction(async (trx) => {
      const slug =
        existing?.slug ||
        (await generateUniqueSlug(
          details.name,
          async (s) =>
            !!(await TvSeries.query({ client: trx })
              .where('slug', s)
              .whereNot('tmdb_id', details.id)
              .first())
        ));

      const series = await TvSeries.updateOrCreate(
        { tmdbId: details.id },
        {
          name: details.name,
          slug,
          originalName: details.original_name,
          tagline: details.tagline ?? null,
          overview: details.overview ?? null,
          status: details.status,
          type: details.type,
          adult: details.adult,
          backdropPath: details.backdrop_path,
          posterPath: details.poster_path,
          homepage: details.homepage ?? null,
          originalLanguage: details.original_language,
          originCountry: details.origin_country,
          firstAirDate: details.first_air_date ? new Date(details.first_air_date) : null,
          lastAirDate: details.last_air_date ? new Date(details.last_air_date) : null,
          inProduction: details.in_production,
          numberOfSeasons: details.number_of_seasons,
          numberOfEpisodes: details.number_of_episodes,
          episodeRunTime: details.episode_run_time,
          createdBy: details.created_by,
          popularity: details.popularity,
          voteAverage: details.vote_average,
          voteCount: details.vote_count,
          lastUpdated: now,
        },
        { client: trx }
      );

      await this.moviesImporter.upsertGenres(details.genres, series.id, 'tv', trx);
      await this.moviesImporter.upsertKeywords(keywords.results, series.id, 'tv', trx);
      await this.upsertNetworks(details.networks, series.id, trx);
      await this.upsertProductionCompanies(details.production_companies, series.id, trx);
      await this.upsertSeasons(details.seasons, series.id, trx);
      await this.upsertAggregateCredits(aggregateCredits, series.id, trx);
      await this.moviesImporter.upsertImages(images, series.id, 'tv', trx);
      await this.moviesImporter.upsertVideos(videos.results, series.id, 'tv', trx);

      await TvExternalId.updateOrCreate(
        { tvSeriesId: series.id },
        {
          imdbId: externalIds.imdb_id,
          tvdbId: externalIds.tvdb_id,
          freebaseMid: externalIds.freebase_mid,
          freebaseId: externalIds.freebase_id,
          tvrageId: externalIds.tvrage_id,
          wikidataId: externalIds.wikidata_id,
          lastUpdated: now,
        },
        { client: trx }
      );

      // US content rating only — replace on each run
      await trx.from('tv_content_ratings').where('tv_series_id', series.id).delete();
      const usRating = contentRatings.results.find((r) => r.iso_3166_1 === 'US');
      if (usRating) {
        await TvContentRating.create(
          { tvSeriesId: series.id, rating: usRating.rating, lastUpdated: now },
          { client: trx }
        );
      }
    });

    return true;
  }

  private async upsertNetworks(
    networks: { id: number; name: string; logo_path: string | null; origin_country: string }[],
    tvSeriesId: number,
    trx: TransactionClientContract
  ) {
    for (const n of networks) {
      await Network.updateOrCreate(
        { id: n.id },
        {
          name: n.name,
          logoPath: n.logo_path,
          originCountry: n.origin_country,
          lastUpdated: DateTime.now(),
        },
        { client: trx }
      );
    }
    const networkIds = networks.map((n) => n.id);
    if (networkIds.length === 0) {
      await trx.from('tv_networks').where('tv_series_id', tvSeriesId).delete();
      return;
    }
    await trx
      .from('tv_networks')
      .where('tv_series_id', tvSeriesId)
      .whereNotIn('network_id', networkIds)
      .delete();
    for (const id of networkIds) {
      await trx.rawQuery(
        `INSERT INTO tv_networks (tv_series_id, network_id) VALUES (?, ?) ON CONFLICT DO NOTHING`,
        [tvSeriesId, id]
      );
    }
  }

  private async upsertProductionCompanies(
    companies: { id: number; name: string; logo_path: string | null; origin_country: string }[],
    tvSeriesId: number,
    trx: TransactionClientContract
  ) {
    for (const c of companies) {
      await ProductionCompany.updateOrCreate(
        { id: c.id },
        {
          name: c.name,
          logoPath: c.logo_path,
          originCountry: c.origin_country,
          lastUpdated: DateTime.now(),
        },
        { client: trx }
      );
    }
    const companyIds = companies.map((c) => c.id);
    if (companyIds.length === 0) {
      await trx.from('tv_production_companies').where('tv_series_id', tvSeriesId).delete();
      return;
    }
    await trx
      .from('tv_production_companies')
      .where('tv_series_id', tvSeriesId)
      .whereNotIn('company_id', companyIds)
      .delete();
    for (const id of companyIds) {
      await trx.rawQuery(
        `INSERT INTO tv_production_companies (tv_series_id, company_id) VALUES (?, ?) ON CONFLICT DO NOTHING`,
        [tvSeriesId, id]
      );
    }
  }

  private async upsertSeasons(
    seasons: {
      id: number;
      season_number: number;
      name: string;
      overview: string;
      poster_path: string | null;
      air_date: string | null;
      episode_count: number;
    }[],
    tvSeriesId: number,
    trx: TransactionClientContract
  ) {
    const now = DateTime.now();
    const seasonNumbers = seasons.map((s) => s.season_number);

    if (seasonNumbers.length === 0) {
      await trx.from('seasons').where('tv_series_id', tvSeriesId).delete();
      return;
    }
    await trx
      .from('seasons')
      .where('tv_series_id', tvSeriesId)
      .whereNotIn('season_number', seasonNumbers)
      .delete();

    for (const s of seasons) {
      await Season.updateOrCreate(
        { tvSeriesId, seasonNumber: s.season_number },
        {
          tmdbId: s.id,
          name: s.name || null,
          overview: s.overview || null,
          posterPath: s.poster_path,
          airDate: s.air_date,
          episodeCount: s.episode_count,
          lastUpdated: now,
        },
        { client: trx }
      );
    }
  }

  private async upsertAggregateCredits(
    credits: TmdbAggregateCreditsResponse,
    tvSeriesId: number,
    trx: TransactionClientContract
  ) {
    if (credits.cast.length === 0 && credits.crew.length === 0) {
      await trx.from('tv_credits').where('tv_series_id', tvSeriesId).delete();
      return;
    }

    const now = DateTime.now();
    const nowIso = now.toISO();

    // Upsert all people first, deduplicating by tmdbId.
    const allMembers = [...credits.cast, ...credits.crew];
    const personIdByTmdbId = new Map<number, number>();
    for (const member of allMembers) {
      if (!personIdByTmdbId.has(member.id)) {
        const person = await Person.updateOrCreate(
          { tmdbId: member.id },
          {
            name: member.name,
            gender: member.gender,
            profilePath: member.profile_path,
            knownForDepartment: member.known_for_department,
            popularity: member.popularity,
            lastUpdated: now,
          },
          { client: trx }
        );
        personIdByTmdbId.set(member.id, person.id);
      }
    }

    const seenPersonIds: number[] = [];

    for (const member of credits.cast) {
      const personId = personIdByTmdbId.get(member.id)!;
      await trx.rawQuery(
        `INSERT INTO tv_credits
           (tv_series_id, person_id, role_type, roles, jobs, total_episode_count, cast_order, last_updated)
         VALUES (?, ?, 'cast', ?::jsonb, NULL, ?, ?, ?)
         ON CONFLICT (tv_series_id, person_id, role_type) DO UPDATE SET
           roles = EXCLUDED.roles,
           total_episode_count = EXCLUDED.total_episode_count,
           cast_order = EXCLUDED.cast_order,
           last_updated = EXCLUDED.last_updated`,
        [
          tvSeriesId,
          personId,
          JSON.stringify(member.roles),
          member.total_episode_count,
          member.order,
          nowIso,
        ]
      );
      seenPersonIds.push(personId);
    }

    for (const member of credits.crew) {
      const personId = personIdByTmdbId.get(member.id)!;
      await trx.rawQuery(
        `INSERT INTO tv_credits
           (tv_series_id, person_id, role_type, roles, jobs, total_episode_count, cast_order, last_updated)
         VALUES (?, ?, 'crew', NULL, ?::jsonb, ?, NULL, ?)
         ON CONFLICT (tv_series_id, person_id, role_type) DO UPDATE SET
           jobs = EXCLUDED.jobs,
           total_episode_count = EXCLUDED.total_episode_count,
           last_updated = EXCLUDED.last_updated`,
        [tvSeriesId, personId, JSON.stringify(member.jobs), member.total_episode_count, nowIso]
      );
      seenPersonIds.push(personId);
    }

    await trx
      .from('tv_credits')
      .where('tv_series_id', tvSeriesId)
      .whereNotIn('person_id', seenPersonIds)
      .delete();
  }
}
