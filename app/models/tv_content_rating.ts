import { BaseModel, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';

export default class TvContentRating extends BaseModel {
  static table = 'tv_content_ratings';

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare tvSeriesId: number;

  @column()
  declare rating: string;

  @column()
  declare lastUpdated: DateTime;
}
