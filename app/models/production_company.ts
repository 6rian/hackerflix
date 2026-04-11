import { BaseModel, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';

export default class ProductionCompany extends BaseModel {
  static primaryKey = 'id';
  static selfAssignPrimaryKey = true;

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string;

  @column()
  declare logoPath: string | null;

  @column()
  declare originCountry: string | null;

  @column()
  declare lastUpdated: DateTime;
}
