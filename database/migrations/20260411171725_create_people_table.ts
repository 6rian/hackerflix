import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'people';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id');
      table.integer('tmdb_id').notNullable().unique();
      table.string('name', 255).notNullable();
      table.smallint('gender').nullable();
      table.string('profile_path', 255).nullable();
      table.string('known_for_department', 100).nullable();
      table.decimal('popularity', 8, 3).nullable();
      table.timestamp('last_updated').notNullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
