import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm';
import type { ManyToMany } from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';
import Genre from '#models/genre';
import Keyword from '#models/keyword';

export default class Movie extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare tmdbId: number;

  @column()
  declare title: string;

  @column()
  declare originalTitle: string | null;

  @column()
  declare tagline: string | null;

  @column()
  declare overview: string | null;

  @column()
  declare status: string | null;

  @column()
  declare adult: boolean;

  @column()
  declare backdropPath: string | null;

  @column()
  declare posterPath: string | null;

  @column()
  declare homepage: string | null;

  @column()
  declare imdbId: string | null;

  @column()
  declare originalLanguage: string | null;

  @column()
  declare originCountry: string[] | null;

  @column()
  declare releaseDate: string | null;

  @column()
  declare runtime: number | null;

  @column()
  declare budget: number | null;

  @column()
  declare revenue: number | null;

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
    pivotTable: 'movie_genres',
  })
  declare genres: ManyToMany<typeof Genre>;

  @manyToMany(() => Keyword, {
    pivotTable: 'movie_keywords',
  })
  declare keywords: ManyToMany<typeof Keyword>;
}
