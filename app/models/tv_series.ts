import { BaseModel, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm';
import type { HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';
import Genre from '#models/genre';
import Keyword from '#models/keyword';
import Network from '#models/network';
import ProductionCompany from '#models/production_company';
import Season from '#models/season';
import TvExternalId from '#models/tv_external_id';
import TvContentRating from '#models/tv_content_rating';

export default class TvSeries extends BaseModel {
  static table = 'tv_series';

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare tmdbId: number;

  @column()
  declare name: string;

  @column()
  declare originalName: string | null;

  @column()
  declare tagline: string | null;

  @column()
  declare overview: string | null;

  @column()
  declare status: string | null;

  @column()
  declare type: string | null;

  @column()
  declare adult: boolean;

  @column()
  declare backdropPath: string | null;

  @column()
  declare posterPath: string | null;

  @column()
  declare homepage: string | null;

  @column()
  declare originalLanguage: string | null;

  @column()
  declare originCountry: string[] | null;

  @column()
  declare firstAirDate: string | null;

  @column()
  declare lastAirDate: string | null;

  @column()
  declare inProduction: boolean | null;

  @column()
  declare numberOfSeasons: number | null;

  @column()
  declare numberOfEpisodes: number | null;

  @column()
  declare episodeRunTime: number[] | null;

  @column()
  declare createdBy: Record<string, unknown>[] | null;

  @column()
  declare popularity: number | null;

  @column()
  declare voteAverage: number | null;

  @column()
  declare voteCount: number | null;

  @column()
  declare lastUpdated: DateTime;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @manyToMany(() => Genre, {
    pivotTable: 'tv_genres',
    localKey: 'id',
    pivotForeignKey: 'tv_series_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'genre_id',
  })
  declare genres: ManyToMany<typeof Genre>;

  @manyToMany(() => Keyword, {
    pivotTable: 'tv_keywords',
    localKey: 'id',
    pivotForeignKey: 'tv_series_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'keyword_id',
  })
  declare keywords: ManyToMany<typeof Keyword>;

  @manyToMany(() => Network, {
    pivotTable: 'tv_networks',
    localKey: 'id',
    pivotForeignKey: 'tv_series_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'network_id',
  })
  declare networks: ManyToMany<typeof Network>;

  @manyToMany(() => ProductionCompany, {
    pivotTable: 'tv_production_companies',
    localKey: 'id',
    pivotForeignKey: 'tv_series_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'company_id',
  })
  declare productionCompanies: ManyToMany<typeof ProductionCompany>;

  @hasMany(() => Season)
  declare seasons: HasMany<typeof Season>;

  @hasOne(() => TvExternalId)
  declare externalIds: HasOne<typeof TvExternalId>;

  @hasMany(() => TvContentRating)
  declare contentRatings: HasMany<typeof TvContentRating>;
}
