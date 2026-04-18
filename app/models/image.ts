import { BaseModel, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';

export default class Image extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare mediaType: 'movie' | 'tv';

  @column()
  declare mediaId: number;

  @column()
  declare imageType: 'backdrop' | 'poster' | 'logo';

  @column()
  declare filePath: string;

  @column()
  declare aspectRatio: number | null;

  @column()
  declare height: number | null;

  @column()
  declare width: number | null;

  @column()
  declare voteAverage: number | null;

  @column()
  declare voteCount: number | null;

  @column({ columnName: 'iso_639_1' })
  declare iso6391: string | null;

  @column()
  declare lastUpdated: DateTime;
}
