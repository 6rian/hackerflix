import { BaseModel, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';

export default class Keyword extends BaseModel {
  static primaryKey = 'id';
  static selfAssignPrimaryKey = true;

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string;

  @column()
  declare slug: string;

  @column.dateTime()
  declare lastUpdated: DateTime;
}
