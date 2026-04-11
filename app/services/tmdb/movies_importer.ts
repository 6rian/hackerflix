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
import MovieCredit from '#models/movie_credit';
import Person from '#models/person';
import Video from '#models/video';

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
      const movie = await Movie.updateOrCreate(
        { tmdbId: details.id },
        {
          title: details.title,
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
          releaseDate: details.release_date ?? null,
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
      await Genre.updateOrCreate(
        { id: g.id },
        { name: g.name, lastUpdated: DateTime.now() },
        { client: trx }
      );
    }

    const genreIds = genres.map((g) => g.id);
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
      await Keyword.updateOrCreate(
        { id: k.id },
        { name: k.name, lastUpdated: DateTime.now() },
        { client: trx }
      );
    }

    const kwdIds = kwds.map((k) => k.id);
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
    const now = DateTime.now();
    const allCreditIds: string[] = [];

    for (const member of cast) {
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

      await MovieCredit.updateOrCreate(
        { creditId: member.credit_id },
        {
          movieId,
          personId: person.id,
          roleType: 'cast',
          character: member.character || null,
          department: null,
          job: null,
          castOrder: member.order,
          lastUpdated: now,
        },
        { client: trx }
      );

      allCreditIds.push(member.credit_id);
    }

    for (const member of crew) {
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

      await MovieCredit.updateOrCreate(
        { creditId: member.credit_id },
        {
          movieId,
          personId: person.id,
          roleType: 'crew',
          character: null,
          department: member.department,
          job: member.job,
          castOrder: null,
          lastUpdated: now,
        },
        { client: trx }
      );

      allCreditIds.push(member.credit_id);
    }

    if (allCreditIds.length > 0) {
      await trx
        .from('movie_credits')
        .where('movie_id', movieId)
        .whereNotIn('credit_id', allCreditIds)
        .delete();
    }
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
