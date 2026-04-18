import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'keywords';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('id').primary(); // TMDB keyword ID
      table.string('name', 255).notNullable();
      table.timestamp('last_updated').notNullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
