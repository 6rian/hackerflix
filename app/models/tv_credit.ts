import { BaseModel, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';

export default class TvCredit extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare tvSeriesId: number;

  @column()
  declare personId: number;

  @column()
  declare creditId: string;

  @column()
  declare roleType: 'cast' | 'crew';

  @column({
    prepare: (v: Record<string, unknown>[] | null) => (v !== null ? JSON.stringify(v) : null),
  })
  declare roles: Record<string, unknown>[] | null;

  @column({
    prepare: (v: Record<string, unknown>[] | null) => (v !== null ? JSON.stringify(v) : null),
  })
  declare jobs: Record<string, unknown>[] | null;

  @column()
  declare totalEpisodeCount: number | null;

  @column()
  declare castOrder: number | null;

  @column()
  declare lastUpdated: DateTime;
}
