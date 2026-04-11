import { BaseModel, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';

export default class Season extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare tvSeriesId: number;

  @column()
  declare tmdbId: number | null;

  @column()
  declare seasonNumber: number;

  @column()
  declare name: string | null;

  @column()
  declare overview: string | null;

  @column()
  declare posterPath: string | null;

  @column()
  declare airDate: string | null;

  @column()
  declare episodeCount: number | null;

  @column()
  declare lastUpdated: DateTime;
}
