import { BaseModel, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';

export default class Person extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare tmdbId: number;

  @column()
  declare name: string;

  @column()
  declare gender: number | null;

  @column()
  declare profilePath: string | null;

  @column()
  declare knownForDepartment: string | null;

  @column()
  declare popularity: number | null;

  @column()
  declare lastUpdated: DateTime;
}
