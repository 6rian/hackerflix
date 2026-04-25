import { BaseSchema } from '@adonisjs/lucid/schema';

const TABLES = ['movies', 'tv_series', 'keywords', 'genres'] as const;

// Mirrors generateSlug() from app/utils/slug.ts for use during backfill.
const slugExpr = (col: string) => `
  COALESCE(
    NULLIF(
      trim('-' FROM
        regexp_replace(
          regexp_replace(
            regexp_replace(lower(${col}), '[[:space:]]+', '-', 'g'),
            '[^a-z0-9-]', '', 'g'
          ),
          '-+', '-', 'g'
        )
      ),
      ''
    ),
    'untitled'
  )
`;

export default class extends BaseSchema {
  async up() {
    for (const table of TABLES) {
      this.schema.alterTable(table, (t) => {
        t.string('slug').notNullable().defaultTo('');
      });
    }

    this.defer(async (db) => {
      // Backfill slugs, handling collisions via window function
      const backfill = async (table: string, sourceCol: string) => {
        await db.rawQuery(`
          WITH base_slugs AS (
            SELECT id, ${slugExpr(sourceCol)} AS base_slug
            FROM ${table}
          ),
          numbered AS (
            SELECT id, base_slug,
                   ROW_NUMBER() OVER (PARTITION BY base_slug ORDER BY id) - 1 AS n
            FROM base_slugs
          )
          UPDATE ${table}
          SET slug = CASE WHEN n = 0 THEN base_slug ELSE base_slug || '-' || n::text END
          FROM numbered
          WHERE ${table}.id = numbered.id
        `);
      };

      await backfill('movies', 'title');
      await backfill('tv_series', 'name');
      await backfill('keywords', 'name');
      await backfill('genres', 'name');

      for (const table of TABLES) {
        await db.rawQuery(`ALTER TABLE ${table} ADD CONSTRAINT ${table}_slug_unique UNIQUE (slug)`);
      }
    });
  }

  async down() {
    this.defer(async (db) => {
      for (const table of TABLES) {
        await db.rawQuery(`ALTER TABLE ${table} DROP CONSTRAINT IF EXISTS ${table}_slug_unique`);
        await db.rawQuery(`ALTER TABLE ${table} DROP COLUMN IF EXISTS slug`);
      }
    });
  }
}
