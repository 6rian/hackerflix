import { BaseModel, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';

type AggregateRole = { credit_id: string; character: string; episode_count: number };
type AggregateJob = { credit_id: string; job: string; episode_count: number };

export default class TvCredit extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare tvSeriesId: number;

  @column()
  declare personId: number;

  @column()
  declare roleType: 'cast' | 'crew';

  @column({
    prepare: (v: AggregateRole[] | null) => (v !== null ? JSON.stringify(v) : null),
  })
  declare roles: AggregateRole[] | null;

  @column({
    prepare: (v: AggregateJob[] | null) => (v !== null ? JSON.stringify(v) : null),
  })
  declare jobs: AggregateJob[] | null;

  @column()
  declare totalEpisodeCount: number | null;

  @column()
  declare castOrder: number | null;

  @column.dateTime()
  declare lastUpdated: DateTime;
}
