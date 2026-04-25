// TODO: migrate to @japa/api-client once that package is installed
import { test } from '@japa/runner';

const BASE_URL = `http://${process.env.HOST ?? '127.0.0.1'}:${process.env.PORT ?? '3333'}`;

test.group('GET /tag/:slug', () => {
  test('returns Inertia page with media array and tag prop for a known slug', async ({
    assert,
  }) => {
    const response = await fetch(`${BASE_URL}/tag/hacking`, {
      headers: { 'X-Inertia': 'true', 'X-Inertia-Version': '1' },
    });
    assert.equal(response.status, 200);
    const body = (await response.json()) as {
      component: string;
      props: { media: unknown[]; tag: string };
    };
    assert.equal(body.component, 'tag');
    assert.isArray(body.props.media);
    // tag prop should be the keyword name (e.g. "Hacking"), not the slug
    assert.isString(body.props.tag);
  });

  test('returns 404 for an unknown slug', async ({ assert }) => {
    const response = await fetch(`${BASE_URL}/tag/this-slug-does-not-exist-xyz`, {
      headers: { 'X-Inertia': 'true', 'X-Inertia-Version': '1' },
    });
    assert.equal(response.status, 404);
  });
});
