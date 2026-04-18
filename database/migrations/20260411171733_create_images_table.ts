import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'images';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id');
      table.string('media_type', 10).notNullable(); // 'movie' or 'tv'
      table.bigInteger('media_id').unsigned().notNullable();
      table.string('image_type', 20).notNullable(); // 'backdrop', 'poster', 'logo'
      table.string('file_path', 255).notNullable().unique();
      table.decimal('aspect_ratio', 6, 4).nullable();
      table.integer('height').nullable();
      table.integer('width').nullable();
      table.decimal('vote_average', 4, 2).nullable();
      table.integer('vote_count').nullable();
      table.string('iso_639_1', 10).nullable();
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
