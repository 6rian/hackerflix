// TODO: migrate to @japa/api-client once that package is installed
import { test } from '@japa/runner';

const BASE_URL = `http://${process.env.HOST ?? '127.0.0.1'}:${process.env.PORT ?? '3333'}`;

test.group('GET /search', () => {
  test('returns Inertia search page with movies and shows', async ({ assert }) => {
    const response = await fetch(`${BASE_URL}/search`, {
      headers: { 'X-Inertia': 'true', 'X-Inertia-Version': '1' },
    });
    assert.equal(response.status, 200);
    const body = (await response.json()) as {
      component: string;
      props: { movies: unknown[]; shows: unknown[] };
    };
    assert.equal(body.component, 'search');
    assert.isArray(body.props.movies);
    assert.isArray(body.props.shows);
  });
});
