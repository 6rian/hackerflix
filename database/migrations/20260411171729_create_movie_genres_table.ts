import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'movie_genres';

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
        .integer('genre_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('genres')
        .onDelete('CASCADE');
      table.primary(['movie_id', 'genre_id']);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
