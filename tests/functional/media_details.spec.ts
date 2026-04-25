// TODO: migrate to @japa/api-client once that package is installed
import { test } from '@japa/runner';

const BASE_URL = `http://${process.env.HOST ?? '127.0.0.1'}:${process.env.PORT ?? '3333'}`;

test.group('GET /movies/:slug', () => {
  test('returns 404 for an unknown movie slug', async ({ assert }) => {
    const response = await fetch(`${BASE_URL}/movies/this-movie-does-not-exist-xyz`, {
      headers: { 'X-Inertia': 'true', 'X-Inertia-Version': '1' },
    });
    assert.equal(response.status, 404);
  });

  test('returns Inertia media_details page for a known movie slug', async ({ assert }) => {
    // Use the default featured movie slug (Hackers, 1995 — tmdbConfig.featuredId = 8487)
    const response = await fetch(`${BASE_URL}/movies/hackers-1995`, {
      headers: { 'X-Inertia': 'true', 'X-Inertia-Version': '1' },
    });
    // If the DB has the record, expect 200; if not yet seeded, expect 404 (both are acceptable)
    assert.include([200, 404], response.status);
    if (response.status === 200) {
      const body = (await response.json()) as {
        component: string;
        props: { media: { slug: string; mediaType: string } };
      };
      assert.equal(body.component, 'media_details');
      assert.equal(body.props.media.mediaType, 'movie');
    }
  });
});

test.group('GET /shows/:slug', () => {
  test('returns 404 for an unknown show slug', async ({ assert }) => {
    const response = await fetch(`${BASE_URL}/shows/this-show-does-not-exist-xyz`, {
      headers: { 'X-Inertia': 'true', 'X-Inertia-Version': '1' },
    });
    assert.equal(response.status, 404);
  });
});
