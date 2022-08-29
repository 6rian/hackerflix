import TMDB from '../services/tmdb';
import config from 'config';
import logger from './logger';
import { createFlick } from '../services/cache';

const transformListResponse = (item) => {
  const transformed = {
    hasAllDetails: false,
    tmdbId: item.id,
    mediaType: item.media_type,
    overview: item.overview,
    rating: item.vote_average,
    posterPath: item.poster_path,
    backdropPath: item.backdrop_path,
  };

  if (item.media_type === TMDB.MEDIA_TYPES.MOVIE) {
    transformed.title = item.title;
    transformed.releaseDate = new Date(item.release_date);
  } else if (item.media_type === TMDB.MEDIA_TYPES.TV) {
    transformed.title = item.name;
    transformed.firstAirDate = new Date(item.first_air_date);
  }

  return transformed;
};

export const bootstrap = async () => {
  try {
    // Fetch list data from TMDB
    const tmdb = new TMDB();
    const list = await tmdb.getList(config.get('tmdb.list_id'));

    // Transform it and save the flicks to cache
    const transformed = list.items.map(transformListResponse);
    transformed.map(createFlick);
  } catch (e) {
    logger.error('Bootstrap Failure: ' + e.message);
  }
};
