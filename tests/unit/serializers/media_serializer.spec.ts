import { test } from '@japa/runner';
import Movie from '#models/movie';
import TvSeries from '#models/tv_series';
import { serializeMovie, serializeTvSeries } from '#serializers/media_serializer';
import tmdbConfig from '#config/tmdb';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeMovie(overrides: Partial<Movie> = {}): Movie {
  return Object.assign(new Movie(), {
    id: 1,
    title: 'Hackers',
    releaseDate: new Date('1995-09-15'),
    voteAverage: 6.5,
    overview: 'A group of high school hackers.',
    posterPath: '/hackers.jpg',
    backdropPath: '/hackers_backdrop.jpg',
    popularity: 42.5,
    keywords: [{ name: 'hacking' }, { name: 'cyberpunk' }],
    ...overrides,
  });
}

function makeTvSeries(overrides: Partial<TvSeries> = {}): TvSeries {
  return Object.assign(new TvSeries(), {
    id: 2,
    name: 'Mr. Robot',
    firstAirDate: new Date('2015-06-24'),
    voteAverage: 8.5,
    overview: 'A cybersecurity engineer leads a hacker group.',
    posterPath: '/mrrobot.jpg',
    backdropPath: '/mrrobot_backdrop.jpg',
    popularity: 78.3,
    keywords: [{ name: 'hacking' }, { name: 'fsociety' }],
    ...overrides,
  });
}

// ---------------------------------------------------------------------------
// serializeMovie
// ---------------------------------------------------------------------------

test.group('serializeMovie', () => {
  test('maps all fields from a fully-populated movie', ({ assert }) => {
    const movie = makeMovie();
    const result = serializeMovie(movie);

    assert.equal(result.id, 1);
    assert.equal(result.title, 'Hackers');
    assert.equal(result.type, 'movie');
    assert.equal(result.year, '1995');
    assert.equal(result.rating, 6.5);
    assert.equal(result.description, 'A group of high school hackers.');
    assert.equal(result.image, tmdbConfig.imageBaseUrl + '/hackers.jpg');
    assert.equal(result.backdrop, tmdbConfig.backdropBaseUrl + '/hackers_backdrop.jpg');
    assert.deepEqual(result.tags, ['hacking', 'cyberpunk']);
  });

  test('backdropPath is prefixed with backdropBaseUrl', ({ assert }) => {
    const result = serializeMovie(makeMovie({ backdropPath: '/test_bg.jpg' }));
    assert.equal(result.backdrop, tmdbConfig.backdropBaseUrl + '/test_bg.jpg');
  });

  test('backdropPath: null → backdrop: undefined', ({ assert }) => {
    const result = serializeMovie(makeMovie({ backdropPath: null }));
    assert.isUndefined(result.backdrop);
  });

  test('type is hardcoded as "movie"', ({ assert }) => {
    const result = serializeMovie(makeMovie());
    assert.equal(result.type, 'movie');
  });

  test('posterPath is prefixed with imageBaseUrl', ({ assert }) => {
    const result = serializeMovie(makeMovie({ posterPath: '/test.jpg' }));
    assert.equal(result.image, tmdbConfig.imageBaseUrl + '/test.jpg');
  });

  test('releaseDate: null → year: ""', ({ assert }) => {
    const result = serializeMovie(makeMovie({ releaseDate: null }));
    assert.equal(result.year, '');
  });

  test('voteAverage: null → rating: 0', ({ assert }) => {
    const result = serializeMovie(makeMovie({ voteAverage: null }));
    assert.equal(result.rating, 0);
  });

  test('overview: null → description: ""', ({ assert }) => {
    const result = serializeMovie(makeMovie({ overview: null }));
    assert.equal(result.description, '');
  });

  test('posterPath: null → image: ""', ({ assert }) => {
    const result = serializeMovie(makeMovie({ posterPath: null }));
    assert.equal(result.image, '');
  });

  test('empty keywords array → tags: []', ({ assert }) => {
    const result = serializeMovie(makeMovie({ keywords: [] as unknown as Movie['keywords'] }));
    assert.deepEqual(result.tags, []);
  });
});

// ---------------------------------------------------------------------------
// serializeTvSeries
// ---------------------------------------------------------------------------

test.group('serializeTvSeries', () => {
  test('maps all fields from a fully-populated series', ({ assert }) => {
    const series = makeTvSeries();
    const result = serializeTvSeries(series);

    assert.equal(result.id, 2);
    assert.equal(result.title, 'Mr. Robot');
    assert.equal(result.type, 'show');
    assert.equal(result.year, '2015');
    assert.equal(result.rating, 8.5);
    assert.equal(result.description, 'A cybersecurity engineer leads a hacker group.');
    assert.equal(result.image, tmdbConfig.imageBaseUrl + '/mrrobot.jpg');
    assert.equal(result.backdrop, tmdbConfig.backdropBaseUrl + '/mrrobot_backdrop.jpg');
    assert.deepEqual(result.tags, ['hacking', 'fsociety']);
  });

  test('backdropPath is prefixed with backdropBaseUrl', ({ assert }) => {
    const result = serializeTvSeries(makeTvSeries({ backdropPath: '/test_bg.jpg' }));
    assert.equal(result.backdrop, tmdbConfig.backdropBaseUrl + '/test_bg.jpg');
  });

  test('backdropPath: null → backdrop: undefined', ({ assert }) => {
    const result = serializeTvSeries(makeTvSeries({ backdropPath: null }));
    assert.isUndefined(result.backdrop);
  });

  test('type is hardcoded as "show"', ({ assert }) => {
    const result = serializeTvSeries(makeTvSeries());
    assert.equal(result.type, 'show');
  });

  test('posterPath is prefixed with imageBaseUrl', ({ assert }) => {
    const result = serializeTvSeries(makeTvSeries({ posterPath: '/test.jpg' }));
    assert.equal(result.image, tmdbConfig.imageBaseUrl + '/test.jpg');
  });

  test('firstAirDate: null → year: ""', ({ assert }) => {
    const result = serializeTvSeries(makeTvSeries({ firstAirDate: null }));
    assert.equal(result.year, '');
  });

  test('voteAverage: null → rating: 0', ({ assert }) => {
    const result = serializeTvSeries(makeTvSeries({ voteAverage: null }));
    assert.equal(result.rating, 0);
  });

  test('overview: null → description: ""', ({ assert }) => {
    const result = serializeTvSeries(makeTvSeries({ overview: null }));
    assert.equal(result.description, '');
  });

  test('posterPath: null → image: ""', ({ assert }) => {
    const result = serializeTvSeries(makeTvSeries({ posterPath: null }));
    assert.equal(result.image, '');
  });

  test('empty keywords array → tags: []', ({ assert }) => {
    const result = serializeTvSeries(
      makeTvSeries({ keywords: [] as unknown as TvSeries['keywords'] })
    );
    assert.deepEqual(result.tags, []);
  });
});
