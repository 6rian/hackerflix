import { BaseModel, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';

export default class TvExternalId extends BaseModel {
  static table = 'tv_external_ids';

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare tvSeriesId: number;

  @column()
  declare imdbId: string | null;

  @column()
  declare tvdbId: number | null;

  @column()
  declare freebaseMid: string | null;

  @column()
  declare freebaseId: string | null;

  @column()
  declare tvrageId: number | null;

  @column()
  declare wikidataId: string | null;

  @column()
  declare lastUpdated: DateTime;
}
