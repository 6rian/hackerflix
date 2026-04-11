import { test } from '@japa/runner';
import { TmdbClient } from '#services/tmdb/client';

// Helper to create a minimal Response-like object
function makeResponse(status: number, body: unknown = {}): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as unknown as Response;
}

// TmdbClient with 0ms retry delay so retry tests don't exceed the 2s unit timeout
function makeClient(): TmdbClient {
  return new TmdbClient('test-token', 0);
}

test.group('TmdbClient', (group) => {
  let originalFetch: typeof globalThis.fetch;

  group.each.setup(() => {
    originalFetch = globalThis.fetch;
  });

  group.each.teardown(() => {
    // Always restore fetch, even if the test threw or timed out
    globalThis.fetch = originalFetch;
  });

  // ── Successful responses ───────────────────────────────────────────────────

  test('returns parsed JSON on a successful response', async ({ assert }) => {
    const payload = { id: 8214827, items: [{ id: 1, media_type: 'movie' }], total_results: 1 };
    globalThis.fetch = async () => makeResponse(200, payload);

    const result = await makeClient().getList(8214827);
    assert.deepEqual(result, payload);
  });

  // ── Retry logic ────────────────────────────────────────────────────────────

  test('retries on HTTP 429 and succeeds on the third attempt', async ({ assert }) => {
    let calls = 0;
    globalThis.fetch = async () => {
      calls++;
      if (calls < 3) return makeResponse(429);
      return makeResponse(200, { id: 1, items: [], total_results: 0 });
    };

    const result = await makeClient().getList(8214827);
    assert.equal(calls, 3);
    assert.equal(result.id, 1);
  });

  test('retries on HTTP 500 and succeeds on the second attempt', async ({ assert }) => {
    let calls = 0;
    globalThis.fetch = async () => {
      calls++;
      if (calls === 1) return makeResponse(500);
      return makeResponse(200, { id: 99 });
    };

    const result = await makeClient().getMovieDetails(99);
    assert.equal(calls, 2);
    assert.equal(result.id, 99);
  });

  test('throws immediately on HTTP 404 without retrying', async ({ assert }) => {
    let calls = 0;
    globalThis.fetch = async () => {
      calls++;
      return makeResponse(404);
    };

    await assert.rejects(() => makeClient().getMovieDetails(0), /HTTP 404/);
    assert.equal(calls, 1);
  });

  test('throws after exhausting all retry attempts on persistent 429', async ({ assert }) => {
    globalThis.fetch = async () => makeResponse(429);
    await assert.rejects(() => makeClient().getList(8214827), /HTTP 429/);
  });

  test('sends Authorization header with Bearer token', async ({ assert }) => {
    let capturedHeaders: Record<string, string> = {};
    globalThis.fetch = async (_url, init) => {
      capturedHeaders = (init?.headers ?? {}) as Record<string, string>;
      return makeResponse(200, { id: 1, items: [], total_results: 0 });
    };

    await new TmdbClient('my-secret-token', 0).getList(1);
    assert.equal(capturedHeaders['Authorization'], 'Bearer my-secret-token');
  });

  // ── Endpoint URL construction ───────────────────────────────────────────────

  test('getMovieDetails calls the correct TMDB endpoint', async ({ assert }) => {
    let capturedUrl = '';
    globalThis.fetch = async (url) => {
      capturedUrl = url.toString();
      return makeResponse(200, { id: 42 });
    };

    await makeClient().getMovieDetails(42);
    assert.isTrue(capturedUrl.includes('/movie/42'));
  });

  test('getTvDetails calls the correct TMDB endpoint', async ({ assert }) => {
    let capturedUrl = '';
    globalThis.fetch = async (url) => {
      capturedUrl = url.toString();
      return makeResponse(200, { id: 77 });
    };

    await makeClient().getTvDetails(77);
    assert.isTrue(capturedUrl.includes('/tv/77'));
  });

  test('getTvContentRatings calls /content_ratings not /aggregate_credits', async ({ assert }) => {
    let capturedUrl = '';
    globalThis.fetch = async (url) => {
      capturedUrl = url.toString();
      return makeResponse(200, { id: 1, results: [] });
    };

    await makeClient().getTvContentRatings(1);
    assert.isTrue(capturedUrl.includes('/content_ratings'));
    assert.isFalse(capturedUrl.includes('/aggregate_credits'));
  });
});
