import TMDB from '../services/tmdb';
import config from 'config';
import logger from './logger';
import { createFlick, updateFlick } from '../services/cache';
import { fetchSheet } from '../services/google';

const logError = (step, message) => {
  logger.error(`Bootstrap Failure on Step: ${step} :: ${message}`);
};

const transformListResponse = (item) => {
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

const validateSheetRow = (row) => {
  // TODO: validate required fields - everything except tags are required.

  // Skip header row
  if (row[0] === '0:tmdb_id') {
    return false;
  }

  return true;
};

const transformSheetRow = (row) => {
  return {
    tmdbId: row[0],
    tmdbMediaType: row[1],
    mediaType: row[2],
    slug: row[4],
  };
};

export const bootstrap = async () => {
  // STEP 1: Extract data from TMDB and load into Cache
  try {
    const tmdb = new TMDB();
    const list = await tmdb.getList(config.get('tmdb.list_id'));
    const transformed = list.items.map(transformListResponse);
    transformed.map(createFlick);
  } catch (e) {
    logError('TMDB ETL', e.message);
  }

  // STEP 2: Extract data from Google Sheet and load into Cache
  try {
    const sheet = await fetchSheet();
    const transformed = sheet.filter((row) => validateSheetRow(row)).map(transformSheetRow);
    transformed.map(updateFlick);
  } catch (e) {
    logError('Google Sheet ETL', e.message);
  }
};
