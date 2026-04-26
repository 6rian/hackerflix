import tmdbConfig from '#config/tmdb';
import type Image from '#models/image';
import type Movie from '#models/movie';
import type MovieCredit from '#models/movie_credit';
import type TvCredit from '#models/tv_credit';
import type TvSeries from '#models/tv_series';
import type Video from '#models/video';

export interface MediaTag {
  name: string;
  slug: string;
}

export interface MediaItem {
  id: number;
  slug: string;
  mediaType: 'movie' | 'tv';
  title: string;
  type: 'movie' | 'show' | 'documentary';
  year: string;
  rating: number;
  description: string;
  image: string;
  backdrop?: string;
  tags: MediaTag[];
  genres: MediaTag[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  image: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  image: string;
}

export interface MediaDetails extends MediaItem {
  synopsis: string;
  runtime?: string;
  seasons?: number;
  episodes?: number;
  status: string;
  budget?: string;
  revenue?: string;
  originalLanguage: string;
  cast: CastMember[];
  crew: CrewMember[];
  videos: { id: number; title: string; type: string; thumbnail: string; url: string }[];
  backdrops: string[];
  posters: string[];
  relatedIds?: number[];
}

const CREW_ROLES = new Set(['Director', 'Writer', 'Screenplay', 'Producer', 'Creator']);

/**
 * Serializes a Movie model to a MediaItem for client rendering.
 *
 * Sets `type` to `'documentary'` when TMDB genre ID 99 (Documentary) is present;
 * otherwise `'movie'`. `genres` falls back to `[]` when the relation is not preloaded.
 *
 * @param movie - Movie model with `keywords` and `genres` preloaded.
 * @returns Serialized MediaItem ready for Inertia props.
 */
export function serializeMovie(movie: Movie): MediaItem {
  // TMDB genre ID 99 = Documentary
  const isDocumentary = (movie.genres ?? []).some((g) => g.id === 99);
  return {
    id: movie.id,
    slug: movie.slug,
    mediaType: 'movie',
    title: movie.title,
    type: isDocumentary ? 'documentary' : 'movie',
    year: movie.releaseDate ? movie.releaseDate.getFullYear().toString() : '',
    rating: movie.voteAverage ?? 0,
    description: movie.overview ?? '',
    image: movie.posterPath ? tmdbConfig.imageBaseUrl + movie.posterPath : '',
    backdrop: movie.backdropPath ? tmdbConfig.backdropBaseUrl + movie.backdropPath : undefined,
    tags: movie.keywords.map((k) => ({ name: k.name, slug: k.slug })),
    genres: (movie.genres ?? []).map((g) => ({ name: g.name, slug: g.slug })),
  };
}

/**
 * Serializes a TvSeries model to a MediaItem for client rendering.
 *
 * `genres` falls back to `[]` when the relation is not preloaded.
 *
 * @param series - TvSeries model with `keywords` and `genres` preloaded.
 * @returns Serialized MediaItem ready for Inertia props.
 */
export function serializeTvSeries(series: TvSeries): MediaItem {
  return {
    id: series.id,
    slug: series.slug,
    mediaType: 'tv',
    title: series.name,
    type: 'show',
    year: series.firstAirDate ? series.firstAirDate.getFullYear().toString() : '',
    rating: series.voteAverage ?? 0,
    description: series.overview ?? '',
    image: series.posterPath ? tmdbConfig.imageBaseUrl + series.posterPath : '',
    backdrop: series.backdropPath ? tmdbConfig.backdropBaseUrl + series.backdropPath : undefined,
    tags: series.keywords.map((k) => ({ name: k.name, slug: k.slug })),
    genres: (series.genres ?? []).map((g) => ({ name: g.name, slug: g.slug })),
  };
}

/**
 * Serializes a Movie with its related media into a full MediaDetails object.
 *
 * @param movie - Movie model with `keywords`, `genres`, and `movieCredits` (+ `person`) preloaded.
 * @param images - Separately queried Image records for the movie.
 * @param videos - Separately queried Video records for the movie.
 * @param credits - Separately queried MovieCredit records with `person` preloaded.
 * @returns Full MediaDetails including cast, crew, images, and videos.
 */
export function serializeMovieDetails(
  movie: Movie,
  images: Image[],
  videos: Video[],
  credits: MovieCredit[]
): MediaDetails {
  const profileBase = tmdbConfig.imageBaseUrl;

  const cast: CastMember[] = credits
    .filter((c) => c.roleType === 'cast')
    .sort((a, b) => (a.castOrder ?? 999) - (b.castOrder ?? 999))
    .slice(0, 20)
    .map((c) => ({
      id: c.personId,
      name: c.person.name,
      character: c.character ?? '',
      image: c.person.profilePath ? profileBase + c.person.profilePath : '',
    }));

  const crew: CrewMember[] = credits
    .filter((c) => c.roleType === 'crew' && CREW_ROLES.has(c.job ?? ''))
    .map((c) => ({
      id: c.personId,
      name: c.person.name,
      job: c.job ?? '',
      image: c.person.profilePath ? profileBase + c.person.profilePath : '',
    }));

  return {
    ...serializeMovie(movie),
    synopsis: movie.overview ?? '',
    runtime: movie.runtime ? `${movie.runtime}m` : undefined,
    status: movie.status ?? '',
    budget: movie.budget ? `$${movie.budget.toLocaleString()}` : undefined,
    revenue: movie.revenue ? `$${movie.revenue.toLocaleString()}` : undefined,
    originalLanguage: movie.originalLanguage ?? '',
    cast,
    crew,
    videos: videos
      .filter((v) => v.site === 'YouTube')
      .map((v) => ({
        id: v.id,
        title: v.name ?? '',
        type: v.videoType ?? 'Video',
        thumbnail: `https://img.youtube.com/vi/${v.key}/hqdefault.jpg`,
        url: `https://www.youtube.com/watch?v=${v.key}`,
      })),
    backdrops: images
      .filter((i) => i.imageType === 'backdrop')
      .slice(0, 9)
      .map((i) => tmdbConfig.backdropBaseUrl + i.filePath),
    posters: images
      .filter((i) => i.imageType === 'poster')
      .slice(0, 9)
      .map((i) => tmdbConfig.imageBaseUrl + i.filePath),
    relatedIds: [],
  };
}

/**
 * Serializes a TvSeries with its related media into a full MediaDetails object.
 *
 * @param series - TvSeries model with `keywords`, `genres`, and `tvCredits` (+ `person`) preloaded.
 * @param images - Separately queried Image records for the series.
 * @param videos - Separately queried Video records for the series.
 * @param credits - Separately queried TvCredit records with `person` preloaded.
 * @returns Full MediaDetails including cast, crew, images, and videos.
 */
export function serializeTvSeriesDetails(
  series: TvSeries,
  images: Image[],
  videos: Video[],
  credits: TvCredit[]
): MediaDetails {
  const profileBase = tmdbConfig.imageBaseUrl;

  const cast: CastMember[] = credits
    .filter((c) => c.roleType === 'cast')
    .sort((a, b) => (a.castOrder ?? 999) - (b.castOrder ?? 999))
    .slice(0, 20)
    .map((c) => ({
      id: c.personId,
      name: c.person.name,
      character: c.roles?.[0]?.character ?? '',
      image: c.person.profilePath ? profileBase + c.person.profilePath : '',
    }));

  const crew: CrewMember[] = credits
    .filter((c) => c.roleType === 'crew' && c.jobs?.some((j) => CREW_ROLES.has(j.job)))
    .map((c) => ({
      id: c.personId,
      name: c.person.name,
      job: c.jobs?.[0]?.job ?? '',
      image: c.person.profilePath ? profileBase + c.person.profilePath : '',
    }));

  return {
    ...serializeTvSeries(series),
    synopsis: series.overview ?? '',
    seasons: series.numberOfSeasons ?? undefined,
    episodes: series.numberOfEpisodes ?? undefined,
    status: series.status ?? '',
    originalLanguage: series.originalLanguage ?? '',
    cast,
    crew,
    videos: videos
      .filter((v) => v.site === 'YouTube')
      .map((v) => ({
        id: v.id,
        title: v.name ?? '',
        type: v.videoType ?? 'Video',
        thumbnail: `https://img.youtube.com/vi/${v.key}/hqdefault.jpg`,
        url: `https://www.youtube.com/watch?v=${v.key}`,
      })),
    backdrops: images
      .filter((i) => i.imageType === 'backdrop')
      .slice(0, 9)
      .map((i) => tmdbConfig.backdropBaseUrl + i.filePath),
    posters: images
      .filter((i) => i.imageType === 'poster')
      .slice(0, 9)
      .map((i) => tmdbConfig.imageBaseUrl + i.filePath),
    relatedIds: [],
  };
}
