import { test } from '@japa/runner';

const BASE_URL = `http://${process.env.HOST ?? '127.0.0.1'}:${process.env.PORT ?? '3333'}`;

test.group('GET /tag/:tag', () => {
  test('returns Inertia page with media array and tag prop', async ({ assert }) => {
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
    assert.equal(body.props.tag, 'hacking');
  });
});
