import tmdbConfig from '#config/tmdb';
import env from '#start/env';

// ─── TMDB response types ───────────────────────────────────────────────────

export interface TmdbListItem {
  id: number;
  media_type: 'movie' | 'tv';
  title?: string;
  name?: string;
}

export interface TmdbListResponse {
  id: number;
  items: TmdbListItem[];
  total_results: number;
}

export interface TmdbMovieDetails {
  id: number;
  adult: boolean;
  backdrop_path: string | null;
  budget: number;
  genres: { id: number; name: string }[];
  homepage: string | null;
  imdb_id: string | null;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  release_date: string | null;
  revenue: number;
  runtime: number | null;
  status: string;
  tagline: string | null;
  title: string;
  vote_average: number;
  vote_count: number;
}

export interface TmdbCastMember {
  id: number;
  name: string;
  gender: number;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface TmdbCrewMember {
  id: number;
  name: string;
  gender: number;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  department: string;
  job: string;
  credit_id: string;
}

export interface TmdbCreditsResponse {
  id: number;
  cast: TmdbCastMember[];
  crew: TmdbCrewMember[];
}

export interface TmdbImage {
  file_path: string;
  aspect_ratio: number;
  height: number;
  width: number;
  vote_average: number;
  vote_count: number;
  iso_639_1: string | null;
}

export interface TmdbImagesResponse {
  id: number;
  backdrops: TmdbImage[];
  posters: TmdbImage[];
  logos: TmdbImage[];
}

export interface TmdbKeywordsMovieResponse {
  id: number;
  keywords: { id: number; name: string }[];
}

export interface TmdbKeywordsTvResponse {
  id: number;
  results: { id: number; name: string }[];
}

export interface TmdbVideo {
  id: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  iso_639_1: string;
  iso_3166_1: string;
}

export interface TmdbVideosResponse {
  id: number;
  results: TmdbVideo[];
}

export interface TmdbTvDetails {
  id: number;
  adult: boolean;
  backdrop_path: string | null;
  created_by: Record<string, unknown>[];
  episode_run_time: number[];
  first_air_date: string | null;
  genres: { id: number; name: string }[];
  homepage: string | null;
  in_production: boolean;
  last_air_date: string | null;
  name: string;
  networks: { id: number; name: string; logo_path: string | null; origin_country: string }[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
  seasons: {
    id: number;
    season_number: number;
    name: string;
    overview: string;
    poster_path: string | null;
    air_date: string | null;
    episode_count: number;
  }[];
  status: string;
  tagline: string | null;
  type: string;
  vote_average: number;
  vote_count: number;
}

export interface TmdbAggregateCastMember {
  id: number;
  name: string;
  gender: number;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  roles: { credit_id: string; character: string; episode_count: number }[];
  total_episode_count: number;
  order: number;
}

export interface TmdbAggregateCrewMember {
  id: number;
  name: string;
  gender: number;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  jobs: { credit_id: string; job: string; episode_count: number }[];
  department: string;
  total_episode_count: number;
}

export interface TmdbAggregateCreditsResponse {
  id: number;
  cast: TmdbAggregateCastMember[];
  crew: TmdbAggregateCrewMember[];
}

export interface TmdbContentRating {
  descriptors: string[];
  iso_3166_1: string;
  rating: string;
}

export interface TmdbContentRatingsResponse {
  id: number;
  results: TmdbContentRating[];
}

export interface TmdbExternalIdsResponse {
  id: number;
  imdb_id: string | null;
  tvdb_id: number | null;
  freebase_mid: string | null;
  freebase_id: string | null;
  tvrage_id: number | null;
  wikidata_id: string | null;
}

// ─── Rate limiter ──────────────────────────────────────────────────────────

export class RateLimiter {
  private requestTimestamps: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async throttle(): Promise<void> {
    const now = Date.now();
    // Drop timestamps outside the window
    this.requestTimestamps = this.requestTimestamps.filter((ts) => now - ts < this.windowMs);

    if (this.requestTimestamps.length >= this.maxRequests) {
      // Wait until the oldest request in the window exits the window
      const oldest = this.requestTimestamps[0];
      const waitMs = this.windowMs - (now - oldest) + 1;
      await new Promise((resolve) => setTimeout(resolve, waitMs));
      // Re-clean after waiting
      const after = Date.now();
      this.requestTimestamps = this.requestTimestamps.filter((ts) => after - ts < this.windowMs);
    }

    this.requestTimestamps.push(Date.now());
  }
}

// ─── Client ────────────────────────────────────────────────────────────────

export class TmdbClient {
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly rateLimiter: RateLimiter;
  private readonly maxRetries: number;
  private readonly baseDelayMs: number;

  constructor(token?: string, baseDelayMs?: number) {
    this.baseUrl = tmdbConfig.baseUrl;
    this.token = token ?? env.get('TMDB_API_ACCESS_TOKEN');
    this.rateLimiter = new RateLimiter(
      tmdbConfig.rateLimit.maxRequests,
      tmdbConfig.rateLimit.windowMs
    );
    this.maxRetries = tmdbConfig.retry.maxAttempts;
    this.baseDelayMs = baseDelayMs ?? tmdbConfig.retry.baseDelayMs;
  }

  private async fetch<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
      }
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      await this.rateLimiter.throttle();

      const response = await globalThis.fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        return response.json() as Promise<T>;
      }

      if (response.status === 429 || response.status >= 500) {
        lastError = new Error(`TMDB API error: HTTP ${response.status} on ${path}`);
        if (attempt < this.maxRetries) {
          const delay = this.baseDelayMs * attempt;
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
      } else {
        // 4xx client errors (except 429) are not retried
        throw new Error(`TMDB API error: HTTP ${response.status} on ${path}`);
      }
    }

    throw lastError ?? new Error(`TMDB API failed after ${this.maxRetries} attempts on ${path}`);
  }

  // ── List ─────────────────────────────────────────────────────────────────

  async getList(listId: number): Promise<TmdbListResponse> {
    return this.fetch<TmdbListResponse>(`/list/${listId}`);
  }

  // ── Movies ───────────────────────────────────────────────────────────────

  async getMovieDetails(movieId: number): Promise<TmdbMovieDetails> {
    return this.fetch<TmdbMovieDetails>(`/movie/${movieId}`);
  }

  async getMovieCredits(movieId: number): Promise<TmdbCreditsResponse> {
    return this.fetch<TmdbCreditsResponse>(`/movie/${movieId}/credits`);
  }

  async getMovieImages(movieId: number): Promise<TmdbImagesResponse> {
    return this.fetch<TmdbImagesResponse>(`/movie/${movieId}/images`);
  }

  async getMovieKeywords(movieId: number): Promise<TmdbKeywordsMovieResponse> {
    return this.fetch<TmdbKeywordsMovieResponse>(`/movie/${movieId}/keywords`);
  }

  async getMovieVideos(movieId: number): Promise<TmdbVideosResponse> {
    return this.fetch<TmdbVideosResponse>(`/movie/${movieId}/videos`);
  }

  // ── TV Series ────────────────────────────────────────────────────────────

  async getTvDetails(seriesId: number): Promise<TmdbTvDetails> {
    return this.fetch<TmdbTvDetails>(`/tv/${seriesId}`);
  }

  async getTvAggregateCredits(seriesId: number): Promise<TmdbAggregateCreditsResponse> {
    return this.fetch<TmdbAggregateCreditsResponse>(`/tv/${seriesId}/aggregate_credits`);
  }

  async getTvContentRatings(seriesId: number): Promise<TmdbContentRatingsResponse> {
    return this.fetch<TmdbContentRatingsResponse>(`/tv/${seriesId}/content_ratings`);
  }

  async getTvExternalIds(seriesId: number): Promise<TmdbExternalIdsResponse> {
    return this.fetch<TmdbExternalIdsResponse>(`/tv/${seriesId}/external_ids`);
  }

  async getTvImages(seriesId: number): Promise<TmdbImagesResponse> {
    return this.fetch<TmdbImagesResponse>(`/tv/${seriesId}/images`);
  }

  async getTvKeywords(seriesId: number): Promise<TmdbKeywordsTvResponse> {
    return this.fetch<TmdbKeywordsTvResponse>(`/tv/${seriesId}/keywords`);
  }

  async getTvVideos(seriesId: number): Promise<TmdbVideosResponse> {
    return this.fetch<TmdbVideosResponse>(`/tv/${seriesId}/videos`);
  }
}
