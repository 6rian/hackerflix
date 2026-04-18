import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'tv_keywords';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .bigInteger('tv_series_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('tv_series')
        .onDelete('CASCADE');
      table
        .integer('keyword_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('keywords')
        .onDelete('CASCADE');
      table.primary(['tv_series_id', 'keyword_id']);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
