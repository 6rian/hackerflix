// TODO: migrate to @japa/api-client once that package is installed
import { test } from '@japa/runner';

const BASE_URL = `http://${process.env.HOST ?? '127.0.0.1'}:${process.env.PORT ?? '3333'}`;

type MediaItemShape = {
  id: number;
  mediaType: 'movie' | 'tv';
  type: 'movie' | 'show' | 'documentary';
  genres: { name: string; slug: string }[];
  tags: { name: string; slug: string }[];
};

test.group('GET /search', () => {
  test('returns Inertia search page with movies and shows', async ({ assert }) => {
    const response = await fetch(`${BASE_URL}/search`, {
      headers: { 'X-Inertia': 'true', 'X-Inertia-Version': '1' },
    });
    assert.equal(response.status, 200);
    const body = (await response.json()) as {
      component: string;
      props: { movies: MediaItemShape[]; shows: MediaItemShape[] };
    };
    assert.equal(body.component, 'search');
    assert.isArray(body.props.movies);
    assert.isArray(body.props.shows);
  });

  test('each movie item includes a genres array and a valid type', async ({ assert }) => {
    const response = await fetch(`${BASE_URL}/search`, {
      headers: { 'X-Inertia': 'true', 'X-Inertia-Version': '1' },
    });
    const body = (await response.json()) as {
      props: { movies: MediaItemShape[] };
    };
    const validTypes = new Set(['movie', 'show', 'documentary']);
    for (const item of body.props.movies) {
      assert.isArray(item.genres, `genres should be an array on movie id=${item.id}`);
      assert.isTrue(
        validTypes.has(item.type),
        `type "${item.type}" is not valid on movie id=${item.id}`
      );
    }
  });

  test('each show item includes a genres array and type "show"', async ({ assert }) => {
    const response = await fetch(`${BASE_URL}/search`, {
      headers: { 'X-Inertia': 'true', 'X-Inertia-Version': '1' },
    });
    const body = (await response.json()) as {
      props: { shows: MediaItemShape[] };
    };
    for (const item of body.props.shows) {
      assert.isArray(item.genres, `genres should be an array on show id=${item.id}`);
      assert.equal(item.type, 'show', `type should be "show" on show id=${item.id}`);
    }
  });
});
