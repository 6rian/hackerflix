const tmdbConfig = {
  /** TMDB list ID for the HackerFlix curated collection */
  listId: 8214827,

  /** TMDB movie ID for the default featured title (Hackers, 1995) */
  featuredId: 8487,

  /** TMDB genre ID for Documentary — shared by both movies and TV series */
  documentaryGenreId: 99,

  /** Number of days before a record is considered stale and eligible for re-import */
  stalenessThresholdDays: 7,

  /** TMDB API base URL */
  baseUrl: 'https://api.themoviedb.org/3',

  /** TMDB image base URL for w500 posters */
  imageBaseUrl: 'https://image.tmdb.org/t/p/w500',

  /** TMDB image base URL for w1280 backdrops (hero section) */
  backdropBaseUrl: 'https://image.tmdb.org/t/p/w1280',

  /** Maximum requests per rate-limit window */
  rateLimit: {
    maxRequests: 40,
    windowMs: 10_000,
  },

  /** Retry configuration for failed requests */
  retry: {
    maxAttempts: 3,
    baseDelayMs: 1_000,
  },
};

export default tmdbConfig;
