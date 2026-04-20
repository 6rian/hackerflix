// TODO: migrate to @japa/api-client once that package is installed
import { test } from '@japa/runner';

const BASE_URL = `http://${process.env.HOST ?? '127.0.0.1'}:${process.env.PORT ?? '3333'}`;

test.group('GET /', () => {
  test('returns Inertia home page with featuredContent, movies, and shows', async ({ assert }) => {
    const response = await fetch(`${BASE_URL}/`, {
      headers: { 'X-Inertia': 'true', 'X-Inertia-Version': '1' },
    });
    assert.equal(response.status, 200);
    const body = (await response.json()) as {
      component: string;
      props: { featuredContent: unknown[]; movies: unknown[]; shows: unknown[] };
    };
    assert.equal(body.component, 'home');
    assert.isArray(body.props.featuredContent);
    assert.isArray(body.props.movies);
    assert.isArray(body.props.shows);
  });

  test('featuredContent items include backdrop and image string fields', async ({ assert }) => {
    const response = await fetch(`${BASE_URL}/`, {
      headers: { 'X-Inertia': 'true', 'X-Inertia-Version': '1' },
    });
    const body = (await response.json()) as {
      props: { featuredContent: Array<{ backdrop?: string; image: string }> };
    };
    const featured = body.props.featuredContent[0];
    assert.isDefined(featured);
    assert.typeOf(featured.image, 'string');
    assert.isDefined(featured.backdrop);
    assert.typeOf(featured.backdrop, 'string');
  });

  test('movies row contains at most 6 items', async ({ assert }) => {
    const response = await fetch(`${BASE_URL}/`, {
      headers: { 'X-Inertia': 'true', 'X-Inertia-Version': '1' },
    });
    const body = (await response.json()) as { props: { movies: unknown[] } };
    assert.isAtMost(body.props.movies.length, 6);
  });

  test('shows row contains at most 6 items', async ({ assert }) => {
    const response = await fetch(`${BASE_URL}/`, {
      headers: { 'X-Inertia': 'true', 'X-Inertia-Version': '1' },
    });
    const body = (await response.json()) as { props: { shows: unknown[] } };
    assert.isAtMost(body.props.shows.length, 6);
  });
});
