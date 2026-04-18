import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'genres';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('id').primary(); // TMDB genre ID
      table.string('name', 100).notNullable();
      table.timestamp('last_updated').notNullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
