import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'videos';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id');
      table.string('media_type', 10).notNullable(); // 'movie' or 'tv'
      table.bigInteger('media_id').unsigned().notNullable();
      table.string('tmdb_id', 50).notNullable().unique(); // TMDB's video ID
      table.string('name', 500).nullable();
      table.string('key', 100).notNullable(); // YouTube/Vimeo key
      table.string('site', 50).notNullable(); // YouTube, Vimeo, etc.
      table.integer('size').nullable(); // quality: 360, 480, 720, 1080
      table.string('video_type', 50).nullable(); // Trailer, Teaser, Clip, etc.
      table.boolean('official').nullable();
      table.timestamp('published_at').nullable();
      table.string('iso_639_1', 10).nullable();
      table.string('iso_3166_1', 10).nullable();
      table.timestamp('last_updated').notNullable();
    });

    this.schema.alterTable(this.tableName, (table) => {
      table.index(['media_type', 'media_id']);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
