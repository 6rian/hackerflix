import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'tv_credits';

  async up() {
    // Drop the old credit_id constraint and column first (DDL runs before defer).
    this.schema.alterTable(this.tableName, (table) => {
      table.dropUnique(['credit_id']);
      table.dropColumn('credit_id');
    });

    // Deduplicate then add the composite unique key in defer so it runs after
    // the column drop. Keeps the most recently inserted row per group.
    this.defer(async (db) => {
      await db.rawQuery(`
        DELETE FROM tv_credits
        WHERE id NOT IN (
          SELECT MAX(id)
          FROM tv_credits
          GROUP BY tv_series_id, person_id, role_type
        )
      `);

      await db.rawQuery(`
        ALTER TABLE tv_credits
        ADD CONSTRAINT tv_credits_tv_series_id_person_id_role_type_unique
        UNIQUE (tv_series_id, person_id, role_type)
      `);
    });
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropUnique(['tv_series_id', 'person_id', 'role_type']);
      table.string('credit_id', 50).nullable();
    });
  }
}
