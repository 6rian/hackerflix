import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'tv_credits';

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Drop the TMDB credit_id unique constraint — it is unreliable as a
      // stable key because aggregate credits use the first role's credit_id,
      // which can change if TMDB reorders roles between runs.
      table.dropUnique(['credit_id']);
      table.dropColumn('credit_id');

      // Replace with a composite unique key: one row per person per series per role type.
      table.unique(['tv_series_id', 'person_id', 'role_type']);
    });
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropUnique(['tv_series_id', 'person_id', 'role_type']);
      table.string('credit_id', 50).nullable();
    });
  }
}
