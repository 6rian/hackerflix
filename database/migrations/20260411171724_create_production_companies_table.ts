import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'production_companies';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('id').primary(); // TMDB company ID
      table.string('name', 255).notNullable();
      table.string('logo_path', 255).nullable();
      table.string('origin_country', 10).nullable();
      table.timestamp('last_updated').notNullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
