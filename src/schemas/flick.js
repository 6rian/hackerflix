import { Entity, Schema } from 'redis-om';

class Flick extends Entity {}

const flickSchema = new Schema(Flick, {
  hasAllDetails: { type: 'boolean' },
  title: { type: 'text' },
  slug: { type: 'string' },
  mediaType: { type: 'string' },
  tmdbMediaType: { type: 'string' },
  tmdbId: { type: 'string' },
  imdbId: { type: 'string' },
  overview: { type: 'text' },
  rating: { type: 'number' },
  posterPath: { type: 'string' },
  backdropPath: { type: 'string' },
  releaseDate: { type: 'date' },
  homepage: { type: 'string' },
  runtime: { type: 'number' },
  tagline: { type: 'string' },
  firstAirDate: { type: 'date' },
  lastAirDate: { type: 'date' },
  episodeRunTime: { type: 'number' },
  numberOfEpisodes: { type: 'number' },
  numberOfSeasons: { type: 'number' },
  backdropImages: { type: 'string[]' },
  logoImages: { type: 'string[]' },
  posterImages: { type: 'string[]' },
  cast: { type: 'string[]' },
  crew: { type: 'string[]' },
  tmdbKeywords: { type: 'string[]' },
  videos: { type: 'string[]' },
});

export default flickSchema;
