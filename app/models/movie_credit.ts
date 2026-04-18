import { BaseModel, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';

export default class MovieCredit extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare movieId: number;

  @column()
  declare personId: number;

  @column()
  declare creditId: string;

  @column()
  declare roleType: 'cast' | 'crew';

  @column()
  declare character: string | null;

  @column()
  declare department: string | null;

  @column()
  declare job: string | null;

  @column()
  declare castOrder: number | null;

  @column.dateTime()
  declare lastUpdated: DateTime;
}
