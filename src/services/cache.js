import Flick from '../models/Flick';
import logger from '../lib/logger';

// Since IDs for Movies and TV shows can overlap in TMDB,
// locating a record requires the TMDB ID + Media Type.
export const getFlickById = async (tmdbId, mediaType) => {
  return await Flick.search()
    .where('tmdbId')
    .equals(tmdbId)
    .and('mediaType')
    .equals(mediaType)
    .return.first();
};

export const flickExists = async (tmdbId, mediaType) => {
  const flick = await getFlickById(tmdbId, mediaType);
  return flick !== null ? true : false;
};

// Create Flick if it does not already exist in the cache.
export const createFlick = async (flickJson) => {
  const { tmdbId, mediaType } = flickJson;
  const exists = await flickExists(tmdbId, mediaType);

  if (!exists) {
    const flick = await Flick.createAndSave(flickJson);
    if (flick) {
      logger.info(`Added to cache: ${flickJson.title}`);
      return true;
    }
  }

  return false;
};
