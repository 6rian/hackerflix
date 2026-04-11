import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'tv_networks';

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
        .integer('network_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('networks')
        .onDelete('CASCADE');
      table.primary(['tv_series_id', 'network_id']);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
