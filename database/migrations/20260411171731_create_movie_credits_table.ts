import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'movie_credits';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id');
      table
        .bigInteger('movie_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('movies')
        .onDelete('CASCADE');
      table
        .bigInteger('person_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('people')
        .onDelete('CASCADE');
      table.string('credit_id', 50).notNullable().unique();
      table.string('role_type', 10).notNullable(); // 'cast' or 'crew'
      table.string('character', 500).nullable();
      table.string('department', 100).nullable();
      table.string('job', 200).nullable();
      table.integer('cast_order').nullable();
      table.timestamp('last_updated').notNullable();
    });

    this.schema.alterTable(this.tableName, (table) => {
      table.index(['movie_id', 'role_type']);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
