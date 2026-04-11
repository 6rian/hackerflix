import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'tv_credits';

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
      table
        .bigInteger('person_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('people')
        .onDelete('CASCADE');
      table.string('credit_id', 50).notNullable().unique();
      table.string('role_type', 10).notNullable(); // 'cast' or 'crew'
      table.jsonb('roles').nullable(); // aggregate roles array (cast)
      table.jsonb('jobs').nullable(); // aggregate jobs array (crew)
      table.integer('total_episode_count').nullable();
      table.integer('cast_order').nullable();
      table.timestamp('last_updated').notNullable();
    });

    this.schema.alterTable(this.tableName, (table) => {
      table.index(['tv_series_id', 'role_type']);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
