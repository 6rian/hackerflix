import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'tv_production_companies';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .bigInteger('tv_series_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('tv_series')
        .onDelete('CASCADE');
      table
        .integer('company_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('production_companies')
        .onDelete('CASCADE');
      table.primary(['tv_series_id', 'company_id']);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
