import { test } from '@japa/runner';
import { DateTime } from 'luxon';
import TvSeries from '#models/tv_series';
import { MoviesImporter } from '#services/tmdb/movies_importer';
import { TvImporter } from '#services/tmdb/tv_importer';
import { TmdbClient } from '#services/tmdb/client';
import tmdbConfig from '#config/tmdb';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const tvPayload = {
  id: 1399,
  name: 'Game of Thrones',
  original_name: 'Game of Thrones',
  tagline: null,
  overview: 'An epic fantasy series.',
  status: 'Ended',
  type: 'Scripted',
  adult: false,
  backdrop_path: '/backdrop.jpg',
  poster_path: '/poster.jpg',
  homepage: null,
  original_language: 'en',
  origin_country: ['US'],
  first_air_date: '2011-04-17',
  last_air_date: '2019-05-19',
  in_production: false,
  number_of_seasons: 8,
  number_of_episodes: 73,
  episode_run_time: [60],
  created_by: [],
  networks: [],
  production_companies: [],
  seasons: [],
  genres: [],
  popularity: 100,
  vote_average: 8.4,
  vote_count: 20000,
};

const emptyAggregateCredits = { id: 1399, cast: [], crew: [] };
const emptyContentRatings = { id: 1399, results: [] };
const emptyExternalIds = {
  id: 1399,
  imdb_id: null,
  tvdb_id: null,
  freebase_mid: null,
  freebase_id: null,
  tvrage_id: null,
  wikidata_id: null,
};
const emptyImages = { id: 1399, backdrops: [], posters: [], logos: [] };
const emptyKeywords = { id: 1399, results: [] };
const emptyVideos = { id: 1399, results: [] };

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeMockClient(): TmdbClient {
  const client = new TmdbClient('test-token', 0);
  client.getTvDetails = async () => tvPayload as never;
  client.getTvAggregateCredits = async () => emptyAggregateCredits;
  client.getTvContentRatings = async () => emptyContentRatings;
  client.getTvExternalIds = async () => emptyExternalIds;
  client.getTvImages = async () => emptyImages;
  client.getTvKeywords = async () => emptyKeywords;
  client.getTvVideos = async () => emptyVideos;
  return client;
}

function makeMockMoviesImporter(client: TmdbClient): MoviesImporter {
  const importer = new MoviesImporter(client);
  importer.upsertGenres = async () => {};
  importer.upsertKeywords = async () => {};
  importer.upsertImages = async () => {};
  importer.upsertVideos = async () => {};
  return importer;
}

/**
 * Stub db.transaction to a no-op that does NOT execute the callback.
 * We are only testing staleness + TMDB fetch behavior here.
 */
async function stubTransaction() {
  const { default: db } = await import('@adonisjs/lucid/services/db');
  const original = db.transaction.bind(db);
  db.transaction = (async () => undefined) as unknown as typeof db.transaction;
  return () => (db.transaction = original);
}

function makeTvImporter(client: TmdbClient): TvImporter {
  return new TvImporter(client, makeMockMoviesImporter(client));
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test.group('TvImporter — staleness check', (group) => {
  let originalFindBy: typeof TvSeries.findBy;

  group.each.setup(() => {
    originalFindBy = TvSeries.findBy;
  });

  group.each.teardown(() => {
    TvSeries.findBy = originalFindBy;
  });

  test('calls TMDB API and returns true when the series has never been stored', async ({
    assert,
  }) => {
    TvSeries.findBy = async () => null;

    let tmdbCalled = false;
    const client = makeMockClient();
    client.getTvDetails = async () => {
      tmdbCalled = true;
      return tvPayload as never;
    };

    const restore = await stubTransaction();
    try {
      const result = await makeTvImporter(client).importTvSeries(1399, false);
      assert.isTrue(result);
      assert.isTrue(tmdbCalled);
    } finally {
      restore();
    }
  });

  test('returns false and skips TMDB when the series was updated recently', async ({ assert }) => {
    TvSeries.findBy = async () => ({ lastUpdated: DateTime.now().minus({ days: 2 }) }) as never;

    let tmdbCalled = false;
    const client = makeMockClient();
    client.getTvDetails = async () => {
      tmdbCalled = true;
      return tvPayload as never;
    };

    const result = await makeTvImporter(client).importTvSeries(1399, false);
    assert.isFalse(result);
    assert.isFalse(tmdbCalled);
  });

  test('calls TMDB API when forceWrite=true even if the record is fresh', async ({ assert }) => {
    TvSeries.findBy = async () => ({ lastUpdated: DateTime.now().minus({ days: 1 }) }) as never;

    let tmdbCalled = false;
    const client = makeMockClient();
    client.getTvDetails = async () => {
      tmdbCalled = true;
      return tvPayload as never;
    };

    const restore = await stubTransaction();
    try {
      const result = await makeTvImporter(client).importTvSeries(1399, true);
      assert.isTrue(result);
      assert.isTrue(tmdbCalled);
    } finally {
      restore();
    }
  });

  test('calls TMDB API when the existing record is beyond the staleness threshold', async ({
    assert,
  }) => {
    const staleDays = tmdbConfig.stalenessThresholdDays + 1;
    TvSeries.findBy = async () =>
      ({ lastUpdated: DateTime.now().minus({ days: staleDays }) }) as never;

    let tmdbCalled = false;
    const client = makeMockClient();
    client.getTvDetails = async () => {
      tmdbCalled = true;
      return tvPayload as never;
    };

    const restore = await stubTransaction();
    try {
      const result = await makeTvImporter(client).importTvSeries(1399, false);
      assert.isTrue(result);
      assert.isTrue(tmdbCalled);
    } finally {
      restore();
    }
  });
});
