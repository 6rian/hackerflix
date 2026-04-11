import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'seasons';

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
      table.integer('tmdb_id').nullable();
      table.integer('season_number').notNullable();
      table.string('name', 255).nullable();
      table.text('overview').nullable();
      table.string('poster_path', 255).nullable();
      table.date('air_date').nullable();
      table.integer('episode_count').nullable();
      table.timestamp('last_updated').notNullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
