import { test } from '@japa/runner';
import { DateTime } from 'luxon';
import Movie from '#models/movie';
import { MoviesImporter } from '#services/tmdb/movies_importer';
import { TmdbClient } from '#services/tmdb/client';
import tmdbConfig from '#config/tmdb';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const moviePayload = {
  id: 8487,
  title: 'Hackers',
  original_title: 'Hackers',
  tagline: null,
  overview: 'Teenagers who are hackers.',
  status: 'Released',
  adult: false,
  backdrop_path: '/backdrop.jpg',
  poster_path: '/poster.jpg',
  homepage: null,
  imdb_id: 'tt0113243',
  origin_country: ['US'],
  original_language: 'en',
  release_date: '1995-09-15',
  runtime: 107,
  budget: 0,
  revenue: 0,
  popularity: 20.5,
  vote_average: 6.3,
  vote_count: 1200,
  genres: [],
};

const emptyCredits = { id: 8487, cast: [], crew: [] };
const emptyImages = { id: 8487, backdrops: [], posters: [], logos: [] };
const emptyKeywords = { id: 8487, keywords: [] };
const emptyVideos = { id: 8487, results: [] };

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeMockClient(): TmdbClient {
  const client = new TmdbClient('test-token', 0);
  client.getMovieDetails = async () => moviePayload as never;
  client.getMovieCredits = async () => emptyCredits;
  client.getMovieImages = async () => emptyImages;
  client.getMovieKeywords = async () => emptyKeywords;
  client.getMovieVideos = async () => emptyVideos;
  return client;
}

/**
 * Stub db.transaction to a no-op that does NOT execute the callback.
 * This is intentional: we are only testing the staleness check and TMDB fetch
 * behavior — not the DB write logic (which belongs in integration tests).
 */
async function stubTransaction() {
  const { default: db } = await import('@adonisjs/lucid/services/db');
  const original = db.transaction.bind(db);
  db.transaction = (async () => undefined) as unknown as typeof db.transaction;
  return () => (db.transaction = original);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test.group('MoviesImporter — staleness check', (group) => {
  let originalFindBy: typeof Movie.findBy;

  group.each.setup(() => {
    originalFindBy = Movie.findBy;
  });

  group.each.teardown(() => {
    Movie.findBy = originalFindBy;
  });

  test('calls TMDB API and returns true when the movie has never been stored', async ({
    assert,
  }) => {
    Movie.findBy = async () => null;

    let tmdbCalled = false;
    const client = makeMockClient();
    client.getMovieDetails = async () => {
      tmdbCalled = true;
      return moviePayload as never;
    };

    const restore = await stubTransaction();
    try {
      const result = await new MoviesImporter(client).importMovie(8487, false);
      assert.isTrue(result);
      assert.isTrue(tmdbCalled);
    } finally {
      restore();
    }
  });

  test('returns false and skips TMDB when the movie was updated recently', async ({ assert }) => {
    Movie.findBy = async () => ({ lastUpdated: DateTime.now().minus({ days: 1 }) }) as never;

    let tmdbCalled = false;
    const client = makeMockClient();
    client.getMovieDetails = async () => {
      tmdbCalled = true;
      return moviePayload as never;
    };

    const result = await new MoviesImporter(client).importMovie(8487, false);
    assert.isFalse(result);
    assert.isFalse(tmdbCalled);
  });

  test('calls TMDB API when forceWrite=true even if the record is fresh', async ({ assert }) => {
    Movie.findBy = async () => ({ lastUpdated: DateTime.now().minus({ days: 1 }) }) as never;

    let tmdbCalled = false;
    const client = makeMockClient();
    client.getMovieDetails = async () => {
      tmdbCalled = true;
      return moviePayload as never;
    };

    const restore = await stubTransaction();
    try {
      const result = await new MoviesImporter(client).importMovie(8487, true);
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
    Movie.findBy = async () =>
      ({ lastUpdated: DateTime.now().minus({ days: staleDays }) }) as never;

    let tmdbCalled = false;
    const client = makeMockClient();
    client.getMovieDetails = async () => {
      tmdbCalled = true;
      return moviePayload as never;
    };

    const restore = await stubTransaction();
    try {
      const result = await new MoviesImporter(client).importMovie(8487, false);
      assert.isTrue(result);
      assert.isTrue(tmdbCalled);
    } finally {
      restore();
    }
  });
});
