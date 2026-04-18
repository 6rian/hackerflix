import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'movie_keywords';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .bigInteger('movie_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('movies')
        .onDelete('CASCADE');
      table
        .integer('keyword_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('keywords')
        .onDelete('CASCADE');
      table.primary(['movie_id', 'keyword_id']);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
