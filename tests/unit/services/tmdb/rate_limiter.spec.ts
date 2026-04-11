import { test } from '@japa/runner';
import { RateLimiter } from '#services/tmdb/client';

test.group('RateLimiter', () => {
  test('allows requests up to the limit with no delay', async ({ assert }) => {
    const limiter = new RateLimiter(5, 1000);
    const start = Date.now();

    for (let i = 0; i < 5; i++) {
      await limiter.throttle();
    }

    // All 5 should complete near-instantly (well under 100ms)
    assert.isBelow(Date.now() - start, 100);
  });

  test('delays the request that exceeds the window limit', async ({ assert }) => {
    // 2 requests per 150ms window
    const limiter = new RateLimiter(2, 150);

    await limiter.throttle(); // 1st
    await limiter.throttle(); // 2nd — fills the window

    const start = Date.now();
    await limiter.throttle(); // 3rd — must wait for window to slide
    const elapsed = Date.now() - start;

    // Should have waited at least part of the window
    assert.isAbove(elapsed, 50);
  });

  test('allows a fresh burst after the window elapses', async ({ assert }) => {
    const limiter = new RateLimiter(2, 100);

    await limiter.throttle();
    await limiter.throttle();

    // Wait for the window to fully elapse
    await new Promise((r) => setTimeout(r, 110));

    const start = Date.now();
    await limiter.throttle(); // Should be immediate again
    await limiter.throttle();
    const elapsed = Date.now() - start;

    assert.isBelow(elapsed, 80);
  });
});
