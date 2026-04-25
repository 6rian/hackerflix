import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';
import Person from '#models/person';

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

  @belongsTo(() => Person, { foreignKey: 'personId' })
  declare person: BelongsTo<typeof Person>;
}
