import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'tv_external_ids';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id');
      table
        .bigInteger('tv_series_id')
        .unsigned()
        .notNullable()
        .unique()
        .references('id')
        .inTable('tv_series')
        .onDelete('CASCADE');
      table.string('imdb_id', 20).nullable();
      table.integer('tvdb_id').nullable();
      table.string('freebase_mid', 100).nullable();
      table.string('freebase_id', 100).nullable();
      table.integer('tvrage_id').nullable();
      table.string('wikidata_id', 50).nullable();
      table.timestamp('last_updated').notNullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
