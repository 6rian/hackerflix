import TMDB from "../../services/tmdb";
import config from 'config';
import logger from "../../lib/logger";
import { createFlick } from "../../services/cache";

const extract = async () => {
  const tmdb = new TMDB();
  return await tmdb.getList(config.get('tmdb.list_id'));
};

const transform = (item) => {
  const transformed = {
    hasAllDetails: false,
    tmdbId: item.id,
    tmdbMediaType: item.media_type,
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

const load = async (flick) => {
  createFlick(flick);
}

export const runListETL = async () => {
  try {
    const list = await extract();
    const transformed = list.items.map(transform);
    transformed.forEach(load);
  } catch (e) {
    logger.error(`TMDB List ETL Failure: ${e.message}`);
  }
};
