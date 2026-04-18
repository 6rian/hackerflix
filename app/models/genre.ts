import { BaseModel, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';

export default class Genre extends BaseModel {
  static primaryKey = 'id';
  static selfAssignPrimaryKey = true;

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string;

  @column.dateTime()
  declare lastUpdated: DateTime;
}
