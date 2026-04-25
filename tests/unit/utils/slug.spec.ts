import { test } from '@japa/runner';
import { generateSlug } from '#utils/slug';

test.group('generateSlug', () => {
  test('lowercases and replaces spaces with hyphens', ({ assert }) => {
    assert.equal(generateSlug('The Great Gatsby'), 'the-great-gatsby');
  });

  test('strips non-alphanumeric characters', ({ assert }) => {
    assert.equal(generateSlug('Mr. Robot'), 'mr-robot');
  });

  test('handles numbers', ({ assert }) => {
    assert.equal(generateSlug('23 Jump Street'), '23-jump-street');
  });

  test('collapses multiple spaces', ({ assert }) => {
    assert.equal(generateSlug('Hack  the  Planet'), 'hack-the-planet');
  });

  test('collapses hyphens produced by special chars', ({ assert }) => {
    assert.equal(generateSlug('foo - bar'), 'foo-bar');
  });

  test('handles already-slugified input', ({ assert }) => {
    assert.equal(generateSlug('hackers'), 'hackers');
  });

  test('returns untitled for all-symbol input', ({ assert }) => {
    assert.equal(generateSlug('!!!'), 'untitled');
  });

  test('returns untitled for empty string', ({ assert }) => {
    assert.equal(generateSlug(''), 'untitled');
  });

  test('trims leading and trailing hyphens', ({ assert }) => {
    assert.equal(generateSlug('--foo--'), 'foo');
  });

  test('handles year in title', ({ assert }) => {
    assert.equal(generateSlug('Hackers (1995)'), 'hackers-1995');
  });
});
