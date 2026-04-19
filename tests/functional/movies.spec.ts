import { test } from '@japa/runner';

const BASE_URL = `http://${process.env.HOST ?? '127.0.0.1'}:${process.env.PORT ?? '3333'}`;

test.group('GET /movies', () => {
  test('returns Inertia page with media array', async ({ assert }) => {
    const response = await fetch(`${BASE_URL}/movies`, {
      headers: { 'X-Inertia': 'true', 'X-Inertia-Version': '1' },
    });
    assert.equal(response.status, 200);
    const body = (await response.json()) as { component: string; props: { media: unknown[] } };
    assert.equal(body.component, 'movies');
    assert.isArray(body.props.media);
  });
});
