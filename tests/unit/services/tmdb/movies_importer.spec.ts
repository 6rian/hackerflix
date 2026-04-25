import { test } from '@japa/runner';
import { DateTime } from 'luxon';
import Genre from '#models/genre';
import Keyword from '#models/keyword';
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

/**
 * Stub db.transaction to actually execute the callback with a lightweight mock
 * transaction client. Used when we need to test logic inside the transaction.
 */
async function executeTransaction() {
  const { default: db } = await import('@adonisjs/lucid/services/db');
  const original = db.transaction.bind(db);
  db.transaction = (async (cb: (trx: any) => any) =>
    cb(makeMockTrx())) as unknown as typeof db.transaction;
  return () => (db.transaction = original);
}

function makeMockTrx(): any {
  const builder: any = {
    where: () => builder,
    whereNot: () => builder,
    whereNotIn: () => builder,
    delete: async () => {},
    first: async () => null,
  };
  return {
    from: () => builder,
    rawQuery: async () => ({ rows: [] }),
  };
}

function mockQueryBuilder(result: unknown) {
  const builder: any = {
    where: () => builder,
    whereNot: () => builder,
    first: async () => result,
  };
  return builder;
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

// ── Slug tests ────────────────────────────────────────────────────────────────

test.group('MoviesImporter — importMovie slug', (group) => {
  let originalFindBy: typeof Movie.findBy;
  let originalQuery: typeof Movie.query;
  let originalUpdateOrCreate: typeof Movie.updateOrCreate;

  group.each.setup(() => {
    originalFindBy = Movie.findBy;
    originalQuery = Movie.query;
    originalUpdateOrCreate = Movie.updateOrCreate;
  });

  group.each.teardown(() => {
    Movie.findBy = originalFindBy;
    Movie.query = originalQuery;
    Movie.updateOrCreate = originalUpdateOrCreate;
  });

  test('generates slug from title for a new record', async ({ assert }) => {
    Movie.findBy = async () => null;
    Movie.query = (() => mockQueryBuilder(null)) as typeof Movie.query;

    let capturedSlug: string | undefined;
    Movie.updateOrCreate = (async (_s: any, data: any) => {
      capturedSlug = data.slug;
      return { id: 1 } as any;
    }) as typeof Movie.updateOrCreate;

    const restore = await executeTransaction();
    try {
      await new MoviesImporter(makeMockClient()).importMovie(8487, false);
      assert.equal(capturedSlug, 'hackers');
    } finally {
      restore();
    }
  });

  test('preserves an existing slug on re-import', async ({ assert }) => {
    const staleDays = tmdbConfig.stalenessThresholdDays + 1;
    Movie.findBy = async () =>
      ({ lastUpdated: DateTime.now().minus({ days: staleDays }), slug: 'hackers-1995' }) as never;

    let capturedSlug: string | undefined;
    let queryWasCalled = false;
    Movie.query = (() => {
      queryWasCalled = true;
      return mockQueryBuilder(null);
    }) as typeof Movie.query;
    Movie.updateOrCreate = (async (_s: any, data: any) => {
      capturedSlug = data.slug;
      return { id: 1 } as any;
    }) as typeof Movie.updateOrCreate;

    const restore = await executeTransaction();
    try {
      await new MoviesImporter(makeMockClient()).importMovie(8487, false);
      assert.equal(capturedSlug, 'hackers-1995');
      assert.isFalse(queryWasCalled, 'Movie.query should not be called when slug already set');
    } finally {
      restore();
    }
  });

  test('generates slug when existing record has empty slug', async ({ assert }) => {
    const staleDays = tmdbConfig.stalenessThresholdDays + 1;
    Movie.findBy = async () =>
      ({ lastUpdated: DateTime.now().minus({ days: staleDays }), slug: '' }) as never;

    Movie.query = (() => mockQueryBuilder(null)) as typeof Movie.query;

    let capturedSlug: string | undefined;
    Movie.updateOrCreate = (async (_s: any, data: any) => {
      capturedSlug = data.slug;
      return { id: 1 } as any;
    }) as typeof Movie.updateOrCreate;

    const restore = await executeTransaction();
    try {
      await new MoviesImporter(makeMockClient()).importMovie(8487, false);
      assert.equal(capturedSlug, 'hackers');
    } finally {
      restore();
    }
  });

  test('appends numeric suffix when base slug is taken', async ({ assert }) => {
    Movie.findBy = async () => null;

    let queryCallCount = 0;
    Movie.query = (() => {
      queryCallCount++;
      // First uniqueness check ('hackers') returns taken; second ('hackers-1') is free
      return mockQueryBuilder(queryCallCount === 1 ? { slug: 'hackers' } : null);
    }) as typeof Movie.query;

    let capturedSlug: string | undefined;
    Movie.updateOrCreate = (async (_s: any, data: any) => {
      capturedSlug = data.slug;
      return { id: 1 } as any;
    }) as typeof Movie.updateOrCreate;

    const restore = await executeTransaction();
    try {
      await new MoviesImporter(makeMockClient()).importMovie(8487, false);
      assert.equal(capturedSlug, 'hackers-1');
    } finally {
      restore();
    }
  });
});

test.group('MoviesImporter — upsertGenres slug', (group) => {
  let originalGenreQuery: typeof Genre.query;
  let originalGenreUpdateOrCreate: typeof Genre.updateOrCreate;

  group.each.setup(() => {
    originalGenreQuery = Genre.query;
    originalGenreUpdateOrCreate = Genre.updateOrCreate;
  });

  group.each.teardown(() => {
    Genre.query = originalGenreQuery;
    Genre.updateOrCreate = originalGenreUpdateOrCreate;
  });

  test('generates slug from name for a new genre', async ({ assert }) => {
    Genre.query = (() => mockQueryBuilder(null)) as typeof Genre.query;

    let capturedData: Record<string, unknown> | undefined;
    Genre.updateOrCreate = (async (_s: any, data: any) => {
      capturedData = data;
      return {} as any;
    }) as typeof Genre.updateOrCreate;

    await new MoviesImporter(makeMockClient()).upsertGenres(
      [{ id: 878, name: 'Science Fiction' }],
      1,
      'movie',
      makeMockTrx()
    );
    assert.equal(capturedData?.slug, 'science-fiction');
  });

  test('preserves an existing genre slug on re-upsert', async ({ assert }) => {
    Genre.query = (() => mockQueryBuilder({ slug: 'sci-fi' })) as typeof Genre.query;

    let capturedData: Record<string, unknown> | undefined;
    Genre.updateOrCreate = (async (_s: any, data: any) => {
      capturedData = data;
      return {} as any;
    }) as typeof Genre.updateOrCreate;

    await new MoviesImporter(makeMockClient()).upsertGenres(
      [{ id: 878, name: 'Science Fiction' }],
      1,
      'movie',
      makeMockTrx()
    );
    assert.equal(capturedData?.slug, 'sci-fi');
  });
});

test.group('MoviesImporter — upsertKeywords slug', (group) => {
  let originalKeywordQuery: typeof Keyword.query;
  let originalKeywordUpdateOrCreate: typeof Keyword.updateOrCreate;

  group.each.setup(() => {
    originalKeywordQuery = Keyword.query;
    originalKeywordUpdateOrCreate = Keyword.updateOrCreate;
  });

  group.each.teardown(() => {
    Keyword.query = originalKeywordQuery;
    Keyword.updateOrCreate = originalKeywordUpdateOrCreate;
  });

  test('generates slug from name for a new keyword', async ({ assert }) => {
    Keyword.query = (() => mockQueryBuilder(null)) as typeof Keyword.query;

    let capturedData: Record<string, unknown> | undefined;
    Keyword.updateOrCreate = (async (_s: any, data: any) => {
      capturedData = data;
      return {} as any;
    }) as typeof Keyword.updateOrCreate;

    await new MoviesImporter(makeMockClient()).upsertKeywords(
      [{ id: 9951, name: 'Artificial Intelligence' }],
      1,
      'movie',
      makeMockTrx()
    );
    assert.equal(capturedData?.slug, 'artificial-intelligence');
  });

  test('preserves an existing keyword slug on re-upsert', async ({ assert }) => {
    Keyword.query = (() => mockQueryBuilder({ slug: 'ai' })) as typeof Keyword.query;

    let capturedData: Record<string, unknown> | undefined;
    Keyword.updateOrCreate = (async (_s: any, data: any) => {
      capturedData = data;
      return {} as any;
    }) as typeof Keyword.updateOrCreate;

    await new MoviesImporter(makeMockClient()).upsertKeywords(
      [{ id: 9951, name: 'Artificial Intelligence' }],
      1,
      'movie',
      makeMockTrx()
    );
    assert.equal(capturedData?.slug, 'ai');
  });
});
