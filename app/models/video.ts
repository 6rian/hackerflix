import { BaseModel, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';

export default class Video extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare mediaType: 'movie' | 'tv';

  @column()
  declare mediaId: number;

  @column()
  declare tmdbId: string;

  @column()
  declare name: string | null;

  @column()
  declare key: string;

  @column()
  declare site: string;

  @column()
  declare size: number | null;

  @column()
  declare videoType: string | null;

  @column()
  declare official: boolean | null;

  @column()
  declare publishedAt: DateTime | null;

  @column({ columnName: 'iso_639_1' })
  declare iso6391: string | null;

  @column({ columnName: 'iso_3166_1' })
  declare iso31661: string | null;

  @column.dateTime()
  declare lastUpdated: DateTime;
}
