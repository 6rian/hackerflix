import Flick from '../models/Flick';
import logger from '../lib/logger';

export const getFlicks = async () => {
  return await Flick.search().returnAll();
};

export const getFlickBySlug = async (slug) => {
  return await Flick.search()
    .where('slug')
    .equals(slug)
    .return
    .first();
}

// Since IDs for Movies and TV shows can overlap in TMDB,
// locating a record requires the TMDB ID + Media Type.
export const getFlickById = async (tmdbId, tmdbMediaType) => {
  return await Flick.search()
    .where('tmdbId')
    .equals(tmdbId)
    .and('tmdbMediaType')
    .equals(tmdbMediaType)
    .return.first();
};

export const flickExists = async (tmdbId, tmdbMediaType) => {
  const flick = await getFlickById(tmdbId, tmdbMediaType);
  return flick !== null ? true : false;
};

// Create Flick if it does not already exist in the cache.
export const createFlick = async (flickJson) => {
  const { tmdbId, tmdbMediaType } = flickJson;
  const exists = await flickExists(tmdbId, tmdbMediaType);

  if (!exists) {
    const flick = await Flick.createAndSave(flickJson);
    if (!flick) {
      logger.error(`Failed adding to cache: ${flickJson.title}`);
      return false;
    }

    logger.info(`Added cache entry for: ${flickJson.title}`);
    return true;
  }

  // Returning true because the cache entry already exists
  return true;
};

// Update an existing Flick.
export const updateFlick = async (flickJson) => {
  const { tmdbId, tmdbMediaType } = flickJson;
  const flick = await getFlickById(tmdbId, tmdbMediaType);

  if (!flick) {
    logger.error(`Could not find flick in cache to update: ${flickJson.title}`);
    console.log(flickJson);
    return false;
  }

  const properties = Object.keys(flickJson);
  properties.forEach((prop) => {
    const skip = ['tmdbId', 'tmdbMediaType'];
    if (!skip.includes(prop)) {
      flick[prop] = flickJson[prop];
    }
  });

  const saved = await Flick.save(flick);
  if (!saved) {
    logger.error(`Failed updating cache entry for: ${flickJson.title}`);
    return false;
  }

  logger.info(`Updated cache entry for: ${flick.title}`);
  return true;
};
