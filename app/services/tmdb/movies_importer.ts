import { DateTime } from 'luxon';
import db from '@adonisjs/lucid/services/db';
import type { TransactionClientContract } from '@adonisjs/lucid/types/database';
import tmdbConfig from '#config/tmdb';
import type {
  TmdbClient,
  TmdbCastMember,
  TmdbCrewMember,
  TmdbImage,
  TmdbImagesResponse,
  TmdbVideo,
} from '#services/tmdb/client';
import Genre from '#models/genre';
import Image from '#models/image';
import Keyword from '#models/keyword';
import Movie from '#models/movie';
import Person from '#models/person';
import Video from '#models/video';
import { generateUniqueSlug } from '#utils/slug';

export class MoviesImporter {
  constructor(private readonly client: TmdbClient) {}

  /**
   * Returns true if the record was imported, false if skipped.
   */
  async importMovie(tmdbId: number, forceWrite: boolean): Promise<boolean> {
    const now = DateTime.now();
    const staleBefore = now.minus({ days: tmdbConfig.stalenessThresholdDays });

    const existing = await Movie.findBy('tmdb_id', tmdbId);
    if (existing && !forceWrite && existing.lastUpdated > staleBefore) {
      return false;
    }

    const [details, credits, images, keywords, videos] = await Promise.all([
      this.client.getMovieDetails(tmdbId),
      this.client.getMovieCredits(tmdbId),
      this.client.getMovieImages(tmdbId),
      this.client.getMovieKeywords(tmdbId),
      this.client.getMovieVideos(tmdbId),
    ]);

    await db.transaction(async (trx) => {
      const slug =
        existing?.slug ||
        (await generateUniqueSlug(
          details.title,
          async (s) =>
            !!(await Movie.query({ client: trx })
              .where('slug', s)
              .whereNot('tmdb_id', details.id)
              .first())
        ));

      const movie = await Movie.updateOrCreate(
        { tmdbId: details.id },
        {
          title: details.title,
          slug,
          originalTitle: details.original_title,
          tagline: details.tagline ?? null,
          overview: details.overview ?? null,
          status: details.status,
          adult: details.adult,
          backdropPath: details.backdrop_path,
          posterPath: details.poster_path,
          homepage: details.homepage ?? null,
          imdbId: details.imdb_id,
          originalLanguage: details.original_language,
          originCountry: details.origin_country,
          releaseDate: details.release_date ? new Date(details.release_date) : null,
          runtime: details.runtime,
          budget: details.budget,
          revenue: details.revenue,
          popularity: details.popularity,
          voteAverage: details.vote_average,
          voteCount: details.vote_count,
          lastUpdated: now,
        },
        { client: trx }
      );

      await this.upsertGenres(details.genres, movie.id, 'movie', trx);
      await this.upsertKeywords(keywords.keywords, movie.id, 'movie', trx);
      await this.upsertMovieCredits(credits.cast, credits.crew, movie.id, trx);
      await this.upsertImages(images, movie.id, 'movie', trx);
      await this.upsertVideos(videos.results, movie.id, 'movie', trx);
    });

    return true;
  }

  async upsertGenres(
    genres: { id: number; name: string }[],
    mediaId: number,
    mediaType: 'movie' | 'tv',
    trx: TransactionClientContract
  ) {
    const pivotTable = mediaType === 'movie' ? 'movie_genres' : 'tv_genres';
    const fkColumn = mediaType === 'movie' ? 'movie_id' : 'tv_series_id';

    for (const g of genres) {
      const existingGenre = await Genre.query({ client: trx }).where('id', g.id).first();
      const slug =
        existingGenre?.slug ||
        (await generateUniqueSlug(
          g.name,
          async (s) =>
            !!(await Genre.query({ client: trx })
              .where('slug', s)
              .whereNot('id', g.id)
              .first())
        ));
      await Genre.updateOrCreate(
        { id: g.id },
        { name: g.name, slug, lastUpdated: DateTime.now() },
        { client: trx }
      );
    }

    const genreIds = genres.map((g) => g.id);
    if (genreIds.length === 0) {
      await trx.from(pivotTable).where(fkColumn, mediaId).delete();
      return;
    }
    await trx.from(pivotTable).where(fkColumn, mediaId).whereNotIn('genre_id', genreIds).delete();
    for (const id of genreIds) {
      await trx.rawQuery(
        `INSERT INTO ${pivotTable} (${fkColumn}, genre_id) VALUES (?, ?) ON CONFLICT DO NOTHING`,
        [mediaId, id]
      );
    }
  }

  async upsertKeywords(
    kwds: { id: number; name: string }[],
    mediaId: number,
    mediaType: 'movie' | 'tv',
    trx: TransactionClientContract
  ) {
    const pivotTable = mediaType === 'movie' ? 'movie_keywords' : 'tv_keywords';
    const fkColumn = mediaType === 'movie' ? 'movie_id' : 'tv_series_id';

    for (const k of kwds) {
      const existingKwd = await Keyword.query({ client: trx }).where('id', k.id).first();
      const slug =
        existingKwd?.slug ||
        (await generateUniqueSlug(
          k.name,
          async (s) =>
            !!(await Keyword.query({ client: trx })
              .where('slug', s)
              .whereNot('id', k.id)
              .first())
        ));
      await Keyword.updateOrCreate(
        { id: k.id },
        { name: k.name, slug, lastUpdated: DateTime.now() },
        { client: trx }
      );
    }

    const kwdIds = kwds.map((k) => k.id);
    if (kwdIds.length === 0) {
      await trx.from(pivotTable).where(fkColumn, mediaId).delete();
      return;
    }
    await trx.from(pivotTable).where(fkColumn, mediaId).whereNotIn('keyword_id', kwdIds).delete();
    for (const id of kwdIds) {
      await trx.rawQuery(
        `INSERT INTO ${pivotTable} (${fkColumn}, keyword_id) VALUES (?, ?) ON CONFLICT DO NOTHING`,
        [mediaId, id]
      );
    }
  }

  private async upsertMovieCredits(
    cast: TmdbCastMember[],
    crew: TmdbCrewMember[],
    movieId: number,
    trx: TransactionClientContract
  ) {
    if (cast.length === 0 && crew.length === 0) {
      await trx.from('movie_credits').where('movie_id', movieId).delete();
      return;
    }

    const now = DateTime.now();
    const allCreditIds: string[] = [];

    // Upsert all people first, building a tmdbId → person.id map.
    const allMembers = [...cast, ...crew];
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

    // rawQuery's StrictValues type excludes null, but the pg driver accepts it at runtime.
    // This helper restores the correct runtime behaviour while keeping the call sites clean.
    const rawExec = (sql: string, bindings: (string | number | boolean | null)[]) =>
      trx.rawQuery(sql, bindings as Parameters<typeof trx.rawQuery>[1]);

    const nowIso = now.toISO();
    for (const member of cast) {
      const personId = personIdByTmdbId.get(member.id)!;
      await rawExec(
        `INSERT INTO movie_credits
           (movie_id, person_id, credit_id, role_type, character, department, job, cast_order, last_updated)
         VALUES (?, ?, ?, 'cast', ?, NULL, NULL, ?, ?)
         ON CONFLICT (credit_id) DO UPDATE SET
           person_id = EXCLUDED.person_id,
           character = EXCLUDED.character,
           cast_order = EXCLUDED.cast_order,
           last_updated = EXCLUDED.last_updated`,
        [movieId, personId, member.credit_id, member.character || null, member.order, nowIso]
      );
      allCreditIds.push(member.credit_id);
    }

    for (const member of crew) {
      const personId = personIdByTmdbId.get(member.id)!;
      await rawExec(
        `INSERT INTO movie_credits
           (movie_id, person_id, credit_id, role_type, character, department, job, cast_order, last_updated)
         VALUES (?, ?, ?, 'crew', NULL, ?, ?, NULL, ?)
         ON CONFLICT (credit_id) DO UPDATE SET
           person_id = EXCLUDED.person_id,
           department = EXCLUDED.department,
           job = EXCLUDED.job,
           last_updated = EXCLUDED.last_updated`,
        [movieId, personId, member.credit_id, member.department, member.job, nowIso]
      );
      allCreditIds.push(member.credit_id);
    }

    await trx
      .from('movie_credits')
      .where('movie_id', movieId)
      .whereNotIn('credit_id', allCreditIds)
      .delete();
  }

  async upsertImages(
    images: TmdbImagesResponse,
    mediaId: number,
    mediaType: 'movie' | 'tv',
    trx: TransactionClientContract
  ) {
    const now = DateTime.now();
    const allPaths: string[] = [];

    const imageGroups: [TmdbImage[], 'backdrop' | 'poster' | 'logo'][] = [
      [images.backdrops, 'backdrop'],
      [images.posters, 'poster'],
      [images.logos, 'logo'],
    ];

    for (const [group, imageType] of imageGroups) {
      for (const img of group) {
        await Image.updateOrCreate(
          { filePath: img.file_path },
          {
            mediaType,
            mediaId,
            imageType,
            aspectRatio: img.aspect_ratio,
            height: img.height,
            width: img.width,
            voteAverage: img.vote_average,
            voteCount: img.vote_count,
            iso6391: img.iso_639_1,
            lastUpdated: now,
          },
          { client: trx }
        );
        allPaths.push(img.file_path);
      }
    }

    if (allPaths.length > 0) {
      await trx
        .from('images')
        .where('media_type', mediaType)
        .where('media_id', mediaId)
        .whereNotIn('file_path', allPaths)
        .delete();
    }
  }

  async upsertVideos(
    videos: TmdbVideo[],
    mediaId: number,
    mediaType: 'movie' | 'tv',
    trx: TransactionClientContract
  ) {
    const now = DateTime.now();
    const allTmdbIds: string[] = [];

    for (const v of videos) {
      await Video.updateOrCreate(
        { tmdbId: v.id },
        {
          mediaType,
          mediaId,
          name: v.name,
          key: v.key,
          site: v.site,
          size: v.size,
          videoType: v.type,
          official: v.official,
          publishedAt: v.published_at ? DateTime.fromISO(v.published_at) : null,
          iso6391: v.iso_639_1,
          iso31661: v.iso_3166_1,
          lastUpdated: now,
        },
        { client: trx }
      );
      allTmdbIds.push(v.id);
    }

    if (allTmdbIds.length > 0) {
      await trx
        .from('videos')
        .where('media_type', mediaType)
        .where('media_id', mediaId)
        .whereNotIn('tmdb_id', allTmdbIds)
        .delete();
    }
  }
}
