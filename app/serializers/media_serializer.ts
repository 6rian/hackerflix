import tmdbConfig from '#config/tmdb';
import Movie from '#models/movie';
import TvSeries from '#models/tv_series';

export interface MediaItem {
  id: number;
  title: string;
  type: 'movie' | 'show';
  year: string;
  rating: number;
  description: string;
  image: string;
  tags: string[];
}

export function serializeMovie(movie: Movie): MediaItem {
  return {
    id: movie.id,
    title: movie.title,
    type: 'movie',
    year: movie.releaseDate ? movie.releaseDate.getFullYear().toString() : '',
    rating: movie.voteAverage ?? 0,
    description: movie.overview ?? '',
    image: movie.posterPath ? tmdbConfig.imageBaseUrl + movie.posterPath : '',
    tags: movie.keywords.map((k) => k.name),
  };
}

export function serializeTvSeries(series: TvSeries): MediaItem {
  return {
    id: series.id,
    title: series.name,
    type: 'show',
    year: series.firstAirDate ? series.firstAirDate.getFullYear().toString() : '',
    rating: series.voteAverage ?? 0,
    description: series.overview ?? '',
    image: series.posterPath ? tmdbConfig.imageBaseUrl + series.posterPath : '',
    tags: series.keywords.map((k) => k.name),
  };
}
