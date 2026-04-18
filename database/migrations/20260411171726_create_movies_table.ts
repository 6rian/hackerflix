import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'movies';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id');
      table.integer('tmdb_id').notNullable().unique();
      table.string('title', 500).notNullable();
      table.string('original_title', 500).nullable();
      table.string('tagline', 1000).nullable();
      table.text('overview').nullable();
      table.string('status', 50).nullable();
      table.boolean('adult').notNullable().defaultTo(false);
      table.string('backdrop_path', 255).nullable();
      table.string('poster_path', 255).nullable();
      table.string('homepage', 2048).nullable();
      table.string('imdb_id', 20).nullable();
      table.string('original_language', 10).nullable();
      table.jsonb('origin_country').nullable();
      table.date('release_date').nullable();
      table.integer('runtime').nullable();
      table.bigInteger('budget').nullable();
      table.bigInteger('revenue').nullable();
      table.decimal('popularity', 10, 3).nullable();
      table.decimal('vote_average', 4, 2).nullable();
      table.integer('vote_count').nullable();
      table.timestamp('last_updated').notNullable();
      table.timestamp('created_at').notNullable();
      table.timestamp('updated_at').notNullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
