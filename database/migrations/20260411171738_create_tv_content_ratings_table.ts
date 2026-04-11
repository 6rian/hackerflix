import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'tv_content_ratings';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id');
      table
        .bigInteger('tv_series_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('tv_series')
        .onDelete('CASCADE');
      table.string('rating', 20).notNullable();
      table.timestamp('last_updated').notNullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
